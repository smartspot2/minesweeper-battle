import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getGameFromId = query({
  args: { id: v.union(v.id('games'), v.null()) },
  handler: async (ctx, args) => {
    if (args.id == null) {
      // if no id, return null
      return null;
    } else {
      return await ctx.db.get(args.id);
    }
  },
});
