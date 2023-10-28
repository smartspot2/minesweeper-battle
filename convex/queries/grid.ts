import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getGrid = query({
  args: { user: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('grids')
      .filter((q) => q.eq(q.field('user'), args.user))
      // there should only be one, but fetch just one
      .first();
  },
});

export const getGame = query({
  args: { id: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('games')
      .filter((q) => q.eq(q.field('_id'), args.id))
      // there should only be one, but fetch just one
      .first();
  },
}); 
