import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mark apartment as viewed
export const markAsViewed = mutation({
  args: {
    apartmentId: v.string()
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if interaction already exists for this apartment
    const existing = await ctx.db
      .query("userInteractions")
      .withIndex("by_apartment", (q) => q.eq("apartmentId", args.apartmentId))
      .first();

    if (existing) {
      // Update existing interaction
      await ctx.db.patch(existing._id, {
        isViewed: true,
        viewedAt: now,
        updatedAt: now,
      });
    } else {
      // Create new interaction
      await ctx.db.insert("userInteractions", {
        apartmentId: args.apartmentId,
        userId: undefined,
        isViewed: true,
        isLiked: false,
        viewedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Toggle apartment like status
export const toggleLike = mutation({
  args: {
    apartmentId: v.string(),
    isLiked: v.boolean()
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if interaction already exists for this apartment
    const existing = await ctx.db
      .query("userInteractions")
      .withIndex("by_apartment", (q) => q.eq("apartmentId", args.apartmentId))
      .first();

    if (existing) {
      // Update existing interaction
      await ctx.db.patch(existing._id, {
        isLiked: args.isLiked,
        likedAt: args.isLiked ? now : undefined,
        updatedAt: now,
      });
    } else {
      // Create new interaction
      await ctx.db.insert("userInteractions", {
        apartmentId: args.apartmentId,
        userId: undefined,
        isViewed: false,
        isLiked: args.isLiked,
        likedAt: args.isLiked ? now : undefined,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get user interactions for specific apartments
export const getUserInteractions = query({
  args: {
    apartmentIds: v.array(v.string())
  },
  handler: async (ctx, args) => {
    const interactions = await ctx.db
      .query("userInteractions")
      .filter((q) => 
        q.or(...args.apartmentIds.map(id => q.eq(q.field("apartmentId"), id)))
      )
      .collect();

    const interactionMap: Record<string, { isViewed: boolean; isLiked: boolean }> = {};
    interactions.forEach((interaction) => {
      interactionMap[interaction.apartmentId] = {
        isViewed: interaction.isViewed,
        isLiked: interaction.isLiked,
      };
    });

    return interactionMap;
  },
});