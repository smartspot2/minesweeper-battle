import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const mutateGrid = mutation({
  args: {
    grid_id: v.id('grids'),
    state: v.object({
      numbers: v.array(v.array(v.number())),
      covers: v.array(v.array(v.number())),
    }),

  },
  handler: async (ctx, args) => {
    ctx.db.patch(args.grid_id, {
      state: args.state,
    });
  },
});

export const addWinner = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string()
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query('games')
      .filter((q) => q.eq(q.field('_id'), args.game_id))
      // there should only be one, but fetch just one
      .first();
    if (game!=null) {
      game.winners.push(args.username);
      ctx.db.patch(args.game_id, {
        winners: game.winners
      });
    }
  },
});

export const addLoser = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string()
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query('games')
      .filter((q) => q.eq(q.field('_id'), args.game_id))
      // there should only be one, but fetch just one
      .first();
    if (game!=null) {
      game.losers.push(args.username);
      ctx.db.patch(args.game_id, {
        losers: game.losers
      });
    }
  },
});