import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import * as apartmentService from "./services/apartmentService";

export interface Apartment {
  id: string;
  title: string;
  price: string;
  floor: string;
  area: string;
  image: string;
  link: string;
  createdAt?: number;
}

// Cache apartments from scraping
export const cacheApartments = mutation({
  args: {
    apartments: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        price: v.string(),
        floor: v.optional(v.string()),
        area: v.optional(v.string()),
        image: v.optional(v.string()),
        link: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const apartments: Apartment[] = args.apartments.map(apt => ({
      id: apt.id,
      title: apt.title,
      price: apt.price,
      floor: apt.floor || "",
      area: apt.area || "",
      image: apt.image || "",
      link: apt.link,
    }));
    return await apartmentService.cacheApartments(ctx.db, apartments);
  },
});

// Get latest apartments (excluding viewed/liked ones)
export const getLatestApartments = query({
  args: {
    apartmentIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await apartmentService.getLatestApartments(ctx.db, args.apartmentIds);
  },
});

// Get liked apartments
export const getLikedApartments = query({
  args: {},
  handler: async (ctx) => {
    return await apartmentService.getLikedApartments(ctx.db);
  },
});

// Scrape and get latest apartments (action that calls external API)
export const scrapeAndGetLatestApartments = action({
  args: {},
  handler: async (ctx): Promise<Apartment[]> => {
    // Scrape apartments from otodom.pl
    const scrapedApartments = await apartmentService.scrapeOtodomApartments();

    // Cache scraped apartments
    await ctx.runMutation(api.apartments.cacheApartments, {
      apartments: scrapedApartments,
    });

    // Get apartment IDs and return filtered latest apartments
    const apartmentIds = scrapedApartments.map((apt) => apt.id);
    return await ctx.runQuery(api.apartments.getLatestApartments, {
      apartmentIds,
    });
  },
});
