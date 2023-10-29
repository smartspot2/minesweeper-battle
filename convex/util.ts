import { MutationCtx } from './_generated/server';

/**
 * Have the user leave any existing games.
 *
 * Utilizes the `users` table to identify which games the user is a part of.
 * This means that the users table should be deduplicated *after* running this function,
 * not before.
 */
export const leaveExistingGames = async (
  ctx: MutationCtx,
  username: string,
) => {
  const existingUsers = await ctx.db
    .query('users')
    .filter((q) => q.eq(q.field('username'), username))
    .collect();

  for (const userObject of existingUsers) {
    const gameId = userObject.game;
    const game = await ctx.db.get(gameId);

    // skip if game doesn't exist
    if (game == null) continue;

    // filter out the current user from the game
    const newUsers = game.users.filter((user) => user.username !== username);
    await ctx.db.patch(gameId, {
      ...game,
      users: newUsers,
    });
  }
};

/**
 * Check if there are any existing user objects in the database already,
 * and delete them.
 *
 * This is usually called before adding users to ensure no duplicates,
 * and to recover if there are any.
 */
export const deleteExistingUsers = async (
  ctx: MutationCtx,
  username: string,
) => {
  const existingUsers = await ctx.db
    .query('users')
    .filter((q) => q.eq(q.field('username'), username))
    .collect();

  if (existingUsers.length > 0) {
    // delete all existing users
    for (const userObject of existingUsers) {
      await ctx.db.delete(userObject._id);
    }
  }
};

/**
 * Check if there are any existing grid objects in the database already,
 * and delete them.
 *
 * This is usually called before adding grids to ensure no duplicates,
 * and to recover if there are any.
 */
export const deleteExistingGrids = async (
  ctx: MutationCtx,
  username: string,
) => {
  const existingGrids = await ctx.db
    .query('grids')
    .filter((q) => q.eq(q.field('username'), username))
    .collect();

  if (existingGrids.length > 0) {
    // delete all existing grids
    for (const gridObject of existingGrids) {
      await ctx.db.delete(gridObject._id);
    }
  }
};
