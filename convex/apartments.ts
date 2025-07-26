import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

export interface Apartment {
  id: string;
  title: string;
  price: string;
  floor: string;
  area: string;
  image: string;
  link: string;
}

// Cache apartments from scraping
export const cacheApartments = mutation({
  args: {
    apartments: v.array(v.object({
      id: v.string(),
      title: v.string(),
      price: v.string(),
      floor: v.optional(v.string()),
      area: v.optional(v.string()),
      image: v.optional(v.string()),
      link: v.string(),
    }))
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    for (const apartment of args.apartments) {
      // Check if apartment already exists
      const existing = await ctx.db
        .query("apartments")
        .withIndex("by_external_id", (q) => q.eq("id", apartment.id))
        .first();

      if (existing) {
        // Update existing apartment
        await ctx.db.patch(existing._id, {
          title: apartment.title,
          price: apartment.price,
          floor: apartment.floor || "",
          area: apartment.area || "",
          imageUrl: apartment.image || "",
          updatedAt: now,
        });
      } else {
        // Create new apartment
        await ctx.db.insert("apartments", {
          id: apartment.id,
          title: apartment.title,
          price: apartment.price,
          floor: apartment.floor || "",
          area: apartment.area || "",
          imageUrl: apartment.image || "",
          externalLink: apartment.link,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  },
});

// Get latest apartments (excluding viewed/liked ones)
export const getLatestApartments = query({
  args: {
    apartmentIds: v.array(v.string())
  },
  handler: async (ctx, args) => {
    // Get all viewed or liked apartment IDs
    const interactions = await ctx.db
      .query("userInteractions")
      .filter((q) => q.or(q.eq(q.field("isViewed"), true), q.eq(q.field("isLiked"), true)))
      .collect();

    const excludedIds = new Set(interactions.map(i => i.apartmentId));
    
    // Filter out excluded apartments
    const filteredIds = args.apartmentIds.filter(id => !excludedIds.has(id));
    
    // Get apartment details for the filtered IDs
    const apartments: Apartment[] = [];
    for (const id of filteredIds) {
      const apartment = await ctx.db
        .query("apartments")
        .withIndex("by_external_id", (q) => q.eq("id", id))
        .first();
      
      if (apartment) {
        apartments.push({
          id: apartment.id,
          title: apartment.title,
          price: apartment.price,
          floor: apartment.floor || "",
          area: apartment.area || "",
          image: apartment.imageUrl || "",
          link: apartment.externalLink,
        });
      }
    }
    
    return apartments;
  },
});

// Get liked apartments
export const getLikedApartments = query({
  args: {},
  handler: async (ctx) => {
    // Get all liked interactions
    const likedInteractions = await ctx.db
      .query("userInteractions")
      .withIndex("by_liked", (q) => q.eq("isLiked", true))
      .collect();

    // Sort by liked date (most recent first)
    likedInteractions.sort((a, b) => (b.likedAt || 0) - (a.likedAt || 0));

    // Get apartment details for liked apartments
    const apartments: Apartment[] = [];
    for (const interaction of likedInteractions) {
      const apartment = await ctx.db
        .query("apartments")
        .withIndex("by_external_id", (q) => q.eq("id", interaction.apartmentId))
        .first();
      
      if (apartment) {
        apartments.push({
          id: apartment.id,
          title: apartment.title,
          price: apartment.price,
          floor: apartment.floor || "",
          area: apartment.area || "",
          image: apartment.imageUrl || "",
          link: apartment.externalLink,
        });
      }
    }
    
    return apartments;
  },
});

// Scrape and get latest apartments (action that calls external API)
export const scrapeAndGetLatestApartments = action({
  args: {},
  handler: async (ctx): Promise<Apartment[]> => {
    // Scrape apartments from otodom.pl
    const url = "https://www.otodom.pl/pl/wyniki/wynajem/mieszkanie/wielkopolskie/poznan/poznan/poznan?ownerTypeSingleSelect=ALL&areaMin=45&by=LATEST&direction=DESC";
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Parse HTML using simple string manipulation (since cheerio isn't available in Convex)
    const scrapedApartments: Apartment[] = [];
    
    // Extract articles using regex patterns
    const articleRegex = /<article[^>]*>(.*?)<\/article>/g;
    const articles = html.match(articleRegex) || [];
    
    for (const article of articles) {
      // Extract listing link
      const linkMatch = article.match(/data-cy="listing-item-link"[^>]*href="([^"]*)"[^>]*>/);
      if (!linkMatch) continue;
      
      const link = linkMatch[1];
      const fullLink = link.startsWith("http") ? link : `https://www.otodom.pl${link}`;
      
      // Extract title
      const titleMatch = article.match(/data-cy="listing-item-title"[^>]*>([^<]*)</);
      const title = titleMatch ? titleMatch[1].trim() : "";
      
      // Extract main price
      const priceMatch = article.match(/class="css-1grq1gi e1uoo6be1"[^>]*>([^<]*)</);
      const mainPrice = priceMatch ? priceMatch[1].trim() : "";
      
      // Extract additional cost
      const additionalCostMatch = article.match(/class="css-13du2ho e1uoo6be2"[^>]*>([^<]*)</);
      const additionalCost = additionalCostMatch ? additionalCostMatch[1].trim() : "";
      
      // Combine price information
      let price = mainPrice;
      if (additionalCost) {
        price = `${mainPrice} (${additionalCost})`;
      }
      
      // Extract image
      const imageMatch = article.match(/<img[^>]*src="([^"]*)"[^>]*>/);
      const image = imageMatch ? imageMatch[1] : "";
      
      // Extract area from additional cost
      let area = "";
      const areaMatch = additionalCost.match(/(\d+)\s*zł\/m²/);
      if (areaMatch) {
        area = `${areaMatch[1]} m²`;
      }
      
      // Extract floor info from title
      let floor = "";
      if (title.toLowerCase().includes("parter")) {
        floor = "parter";
      } else if (title.toLowerCase().includes("piętro")) {
        const floorMatch = title.match(/(\d+)\s*piętro/i);
        if (floorMatch) {
          floor = `${floorMatch[1]} piętro`;
        } else {
          floor = "piętro";
        }
      }
      
      if (title && price) {
        scrapedApartments.push({
          id: fullLink,
          title,
          price,
          floor,
          area,
          image,
          link: fullLink,
        });
      }
    }
    
    // Cache scraped apartments
    await ctx.runMutation(api.apartments.cacheApartments, {
      apartments: scrapedApartments
    });
    
    // Get apartment IDs and return filtered latest apartments
    const apartmentIds = scrapedApartments.map(apt => apt.id);
    return await ctx.runQuery(api.apartments.getLatestApartments, {
      apartmentIds
    });
  },
});