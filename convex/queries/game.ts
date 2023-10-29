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

export const getGameFromUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    if (args.username == null) {
      // if no id, return null
      return null;
    } else {
      const game_id = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('username'), args.username))
      // there should only be one, but fetch just one
      .first();
      if (game_id==null) {
        return null;
      }
      else {
        return await ctx.db.get(game_id.game);
      }
      
    }
  },
});

export const listGames = query({
  handler: async (ctx) => {
    return ctx.db.query('games').collect();
  },
});

