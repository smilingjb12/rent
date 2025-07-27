import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    console.log("userId", userId);
    if (userId === null) {
      return null;
    }
    // Return a simple user object since we're using Convex Auth
    // The userId is sufficient for authentication checks
    return { id: userId };
  },
});
