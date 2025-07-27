import { DatabaseReader, DatabaseWriter } from "../_generated/server";

export async function markAsViewed(
  db: DatabaseWriter,
  apartmentId: string
) {
  const now = Date.now();
  
  // Check if interaction already exists for this apartment
  const existing = await db
    .query("userInteractions")
    .withIndex("by_apartment", (q) => q.eq("apartmentId", apartmentId))
    .first();

  if (existing) {
    // Update existing interaction
    await db.patch(existing._id, {
      isViewed: true,
      viewedAt: now,
      updatedAt: now,
    });
  } else {
    // Create new interaction
    await db.insert("userInteractions", {
      apartmentId: apartmentId,
      userId: undefined,
      isViewed: true,
      isLiked: false,
      viewedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function toggleLike(
  db: DatabaseWriter,
  apartmentId: string,
  isLiked: boolean
) {
  const now = Date.now();
  
  // Check if interaction already exists for this apartment
  const existing = await db
    .query("userInteractions")
    .withIndex("by_apartment", (q) => q.eq("apartmentId", apartmentId))
    .first();

  if (existing) {
    // Update existing interaction
    await db.patch(existing._id, {
      isLiked: isLiked,
      likedAt: isLiked ? now : undefined,
      updatedAt: now,
    });
  } else {
    // Create new interaction
    await db.insert("userInteractions", {
      apartmentId: apartmentId,
      userId: undefined,
      isViewed: false,
      isLiked: isLiked,
      likedAt: isLiked ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function getUserInteractions(
  db: DatabaseReader,
  apartmentIds: string[]
): Promise<Record<string, { isViewed: boolean; isLiked: boolean }>> {
  const interactions = await db
    .query("userInteractions")
    .filter((q) => 
      q.or(...apartmentIds.map(id => q.eq(q.field("apartmentId"), id)))
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
}