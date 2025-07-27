import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  apartments: defineTable({
    id: v.string(), // External apartment ID (URL)
    title: v.string(),
    price: v.string(),
    floor: v.optional(v.string()),
    area: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    externalLink: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_external_id", ["id"]),

  userInteractions: defineTable({
    apartmentId: v.string(),
    userId: v.optional(v.id("users")), // Link to authenticated user
    isViewed: v.boolean(),
    isLiked: v.boolean(),
    viewedAt: v.optional(v.number()),
    likedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_apartment", ["apartmentId"])
    .index("by_viewed", ["isViewed"])
    .index("by_liked", ["isLiked"])
    .index("by_user", ["userId"]),
});