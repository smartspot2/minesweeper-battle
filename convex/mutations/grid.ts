import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { deleteExistingGrids } from '../util';

export const mutateGrid = mutation({
  args: {
    grid_id: v.id('grids'),
    state: v.optional(
      v.object({
        values: v.array(v.array(v.number())),
        covers: v.array(v.array(v.number())),
      }),
    ),
  },
  handler: async (ctx, args) => {
    ctx.db.patch(args.grid_id, {
      state: args.state,
    });
  },
});

export const createGrid = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    deleteExistingGrids(ctx, args.username);

    ctx.db.insert('grids', {
      game: args.game_id,
      username: args.username,
    });
  },
});
