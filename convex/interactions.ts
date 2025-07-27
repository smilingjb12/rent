import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import * as interactionService from "./services/interaction-service";

// Mark apartment as viewed
export const markAsViewed = mutation({
  args: {
    apartmentId: v.string()
  },
  handler: async (ctx, args) => {
    return await interactionService.markAsViewed(ctx.db, args.apartmentId);
  },
});

// Toggle apartment like status
export const toggleLike = mutation({
  args: {
    apartmentId: v.string(),
    isLiked: v.boolean()
  },
  handler: async (ctx, args) => {
    return await interactionService.toggleLike(ctx.db, args.apartmentId, args.isLiked);
  },
});

// Get user interactions for specific apartments
export const getUserInteractions = query({
  args: {
    apartmentIds: v.array(v.string())
  },
  handler: async (ctx, args) => {
    return await interactionService.getUserInteractions(ctx.db, args.apartmentIds);
  },
});