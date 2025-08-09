import { DatabaseReader, DatabaseWriter } from "../_generated/server";
import { Apartment } from "../apartments";

export async function cacheApartments(
  db: DatabaseWriter,
  apartments: Apartment[]
) {
  const now = Date.now();

  for (const apartment of apartments) {
    // Check if apartment already exists
    const existing = await db
      .query("apartments")
      .withIndex("by_external_id", (q) => q.eq("id", apartment.id))
      .first();

    if (existing) {
      // Update existing apartment
      await db.patch(existing._id, {
        title: apartment.title,
        price: apartment.price,
        floor: apartment.floor || "",
        area: apartment.area || "",
        imageUrl: apartment.image || "",
        updatedAt: now,
      });
    } else {
      // Create new apartment
      await db.insert("apartments", {
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
}

export async function getLatestApartments(
  db: DatabaseReader,
  apartmentIds: string[]
): Promise<Apartment[]> {
  // Get interactions for this user (or anonymous if no user)
  const interactions = await db
    .query("userInteractions")
    .filter((q) =>
      q.and(
        q.or(q.eq(q.field("isViewed"), true), q.eq(q.field("isLiked"), true))
      )
    )
    .collect();

  const excludedIds = new Set(interactions.map((i) => i.apartmentId));

  // Filter out excluded apartments
  const filteredIds = apartmentIds.filter((id) => !excludedIds.has(id));

  // Get apartment details for the filtered IDs
  const apartments: Apartment[] = [];
  for (const id of filteredIds) {
    const apartment = await db
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
}

export async function getLikedApartments(
  db: DatabaseReader
): Promise<Apartment[]> {
  // Get all liked interactions (anonymous users can see all liked apartments)
  const likedInteractions = await db
    .query("userInteractions")
    .withIndex("by_liked", (q) => q.eq("isLiked", true))
    .collect();

  // Sort by liked date (most recent first)
  likedInteractions.sort((a, b) => (b.likedAt || 0) - (a.likedAt || 0));

  // Get apartment details for liked apartments
  const apartments: Apartment[] = [];
  for (const interaction of likedInteractions) {
    const apartment = await db
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
}

export async function scrapeOtodomApartments(): Promise<Apartment[]> {
  const baseUrl = "https://www.otodom.pl/pl/wyniki/wynajem/mieszkanie/wielkopolskie/poznan/poznan/poznan?ownerTypeSingleSelect=ALL&areaMin=45&direction=DESC&limit=72";
  const urls = [
    baseUrl,
    `${baseUrl}&page=2`
  ];

  const allApartments: Apartment[] = [];

  for (const url of urls) {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      continue;
    }

    const html = await response.text();

    // Parse HTML using simple string manipulation (since cheerio isn't available in Convex)
    const scrapedApartments: Apartment[] = [];

    // Extract articles using regex patterns
    const articleRegex = /<article[^>]*>(.*?)<\/article>/g;
    const articles = html.match(articleRegex) || [];

    for (const article of articles) {
      // Extract listing link
      const linkMatch = article.match(
        /data-cy="listing-item-link"[^>]*href="([^"]*)"[^>]*>/
      );
      if (!linkMatch) continue;

      const link = linkMatch[1];
      const fullLink = link.startsWith("http")
        ? link
        : `https://www.otodom.pl${link}`;

      // Extract title
      const titleMatch = article.match(
        /data-cy="listing-item-title"[^>]*>([^<]*)</
      );
      const title = titleMatch ? titleMatch[1].trim() : "";

      // Extract main price
      const priceMatch = article.match(
        /class="css-1grq1gi e1uoo6be1"[^>]*>([^<]*)</
      );
      const mainPrice = priceMatch ? priceMatch[1].trim() : "";

      // Extract additional cost
      const additionalCostMatch = article.match(
        /class="css-13du2ho e1uoo6be2"[^>]*>([^<]*)</
      );
      const additionalCost = additionalCostMatch
        ? additionalCostMatch[1].trim()
        : "";

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

    allApartments.push(...scrapedApartments);
  }

  return allApartments;
}
