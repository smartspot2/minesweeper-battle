import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // table of current games
  games: defineTable({
    users: v.array(v.object({
      username: v.string(),
      disruptions: v.number()
    })),
    winners: v.array(v.string()),
    losers: v.array(v.string())
  }),
  // table of current grid states
  grids: defineTable({
    // user associated with the grid
    user: v.string(),
    // grid state
    state: v.object({
      // mine reference numbers (9 for mine)
      numbers: v.array(v.array(v.number())),
      // whether the user has clicked, flagged, or not touched the cell
      covers: v.array(v.array(v.number())),
    }),
  }),
});
