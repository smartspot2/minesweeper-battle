import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getGridFromUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('grids')
      .filter((q) => q.eq(q.field('username'), args.username))
      // there should only be one, but fetch just one
      .first();
  },
});

export const getOpponentGridsFromGame = query({
  args: { game_id: v.id('games'), username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('grids')
      .filter((q) => q.eq(q.field('game'), args.game_id))
      .filter((q) => q.neq(q.field('username'), args.username))
      .collect();
  },
});
