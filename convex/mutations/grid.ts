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
