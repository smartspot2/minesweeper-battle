import { mutation } from '../_generated/server';
import { v } from 'convex/values';

/**
 * Create a new game in the database.
 */
export const createGame = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('games', {
      users: [{ username: args.username, disruptions: 0 }],
      winners: [],
      losers: [],
    });
  },
});

export const addWinner = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query('games')
      .filter((q) => q.eq(q.field('_id'), args.game_id))
      // there should only be one, but fetch just one
      .first();
    if (game != null) {
      game.winners.push(args.username);
      ctx.db.patch(args.game_id, {
        winners: game.winners,
      });
    }
  },
});

export const addLoser = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query('games')
      .filter((q) => q.eq(q.field('_id'), args.game_id))
      // there should only be one, but fetch just one
      .first();
    if (game != null) {
      game.losers.push(args.username);
      ctx.db.patch(args.game_id, {
        losers: game.losers,
      });
    }
  },
});

export const disruptUser = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query('games')
      .filter((q) => q.eq(q.field('_id'), args.game_id))
      // there should only be one, but fetch just one
      .first();

    if (game) {
      const users = game.users.map((x) => {
        return x.username;
      });
      const diff1 = users.filter(function(x) {
        return game.winners.indexOf(x) < 0;
      });

      const diff = diff1.filter(function(x) {
        return game.losers.indexOf(x) < 0;
      });
      if (diff.indexOf(args.username) > -1) {
        diff.splice(diff.indexOf(args.username), 1);
      }
      const disruptedUser = diff[Math.floor(Math.random() * diff.length)];
      const found = game.users.find(function(element) {
        return element.username == disruptedUser;
      });
      if (found) {
        game.users[game.users.indexOf(found)].disruptions++;

        ctx.db.patch(args.game_id, {
          users: game.users,
        });
      }
    }
  },
});

export const resolveDisruption = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string(),
    new_disruption_count: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db
      .query('games')
      .filter((q) => q.eq(q.field('_id'), args.game_id))
      // there should only be one, but fetch just one
      .first();

    if (game) {
      const usernames = game.users.map((x) => {
        return x.username;
      });
      const userIndex = usernames.indexOf(args.username);
      // if the target user is in the game
      if (userIndex != -1) {
        game.users[userIndex].disruptions = args.new_disruption_count;

        ctx.db.patch(args.game_id, {
          users: game.users,
        });
      }
    }
  },
});
