import { mutation } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import {
  deleteExistingGrids,
  deleteExistingUsers,
  leaveExistingGames,
} from '../util';

/**
 * Create a new game in the database.
 */
export const createGame = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    leaveExistingGames(ctx, args.username);
    deleteExistingUsers(ctx, args.username);
    deleteExistingGrids(ctx, args.username);

    // create new game
    const new_game = {
      users: [{ username: args.username, disruptions: 0 }],
      winners: [],
      losers: [],
    };
    const game_id = await ctx.db.insert('games', new_game);

    // create new user in the game
    await ctx.db.insert('users', {
      username: args.username,
      game: game_id,
    });

    // create new grid for the user
    await ctx.db.insert('grids', {
      username: args.username,
      game: game_id,
      // no defined grid yet
    });
    return new_game;
  },
});

export const joinGame = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    leaveExistingGames(ctx, args.username);
    deleteExistingUsers(ctx, args.username);
    deleteExistingGrids(ctx, args.username);

    // add new user
    await ctx.db.insert('users', {
      username: args.username,
      game: args.game_id,
    });

    // get the game object
    const game = await ctx.db.get(args.game_id);
    if (game == null) {
      throw new ConvexError("attempting to join game that doesn't exist");
    }

    // add user to the game; don't add twice though
    const oldUsers = game.users.filter(
      (user) => user.username !== args.username,
    );
    await ctx.db.replace(args.game_id, {
      ...game,
      users: [...oldUsers, { username: args.username, disruptions: 0 }],
    });

    // create new grid for the user
    await ctx.db.insert('grids', {
      username: args.username,
      game: args.game_id,
      // no defined grid yet
    });
  },
});

export const addWinner = mutation({
  args: {
    game_id: v.id('games'),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.game_id);
    if (game != null && !game.winners.includes(args.username)) {
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
    if (game != null && !game.losers.includes(args.username)) {
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
      const diff1 = users.filter(function (x) {
        return game.winners.indexOf(x) < 0;
      });

      const diff = diff1.filter(function (x) {
        return game.losers.indexOf(x) < 0;
      });
      if (diff.indexOf(args.username) > -1) {
        diff.splice(diff.indexOf(args.username), 1);
      }
      const disruptedUser = diff[Math.floor(Math.random() * diff.length)];
      const found = game.users.find(function (element) {
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

export const leaveGame = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    leaveExistingGames(ctx, args.username);
    deleteExistingGrids(ctx, args.username);
    deleteExistingUsers(ctx, args.username);
  },
});

