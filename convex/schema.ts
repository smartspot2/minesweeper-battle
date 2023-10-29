import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // table of current games
  games: defineTable({
    users: v.array(
      v.object({
        username: v.string(),
        disruptions: v.number(),
      }),
    ),
    winners: v.array(v.string()),
    losers: v.array(v.string()),
  }),
  users: defineTable({
    username: v.string(),
    game: v.id('games'),
  }),
  // table of current grid states
  grids: defineTable({
    // game associated with the grid
    game: v.id('games'),
    // user associated with the grid
    username: v.string(),
    // grid state
    state: v.optional(
      v.object({
        // mine reference numbers (9 for mine)
        values: v.array(v.array(v.number())),
        // whether the user has clicked, flagged, or not touched the cell
        covers: v.array(v.array(v.number())),
      }),
    ),
  }),
});
