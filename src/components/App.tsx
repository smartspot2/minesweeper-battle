import 'react';
import { Game } from './minesweeper/Game';
import { Preview } from './minesweeper/Preview';
import { fillValues, generateMines } from './minesweeper/util/values';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
} from 'react-router-dom';
import { Login } from './Login';
import { useState } from 'react';
import CONFIG from '../util/config';

export const App = () => {
  const [username, setUsername] = useState<string>('');
  const userGame = useQuery(api.queries.game.getGameFromUsername, { username });
  const userGrid = useQuery(api.queries.grid.getGridFromUsername, { username });

  const initialValues = generateMines(
    CONFIG.numRows,
    CONFIG.numCols,
    CONFIG.numMines,
  );
  fillValues(initialValues);
  const initialCovers = [...Array(CONFIG.numRows)].map(() =>
    Array(CONFIG.numCols).fill(1),
  );

  const router = createBrowserRouter([
    {
      path: '/',
      element:
        userGame == null ? (
          <Login setUsername={setUsername} />
        ) : (
          <Navigate to="/play" />
        ),
    },
    {
      path: '/play',
      element:
        userGame == null ? (
          <Navigate to="/" />
        ) : userGrid == null ? (
          // grid not done loading yet, but game exists
          <div>Loading grid...</div>
        ) : (
          <div className="game-wrapper">
            <Game
              game={userGame}
              grid={userGrid}
              username={username}
              initialValues={
                userGrid.state == null ? initialValues : userGrid.state.values
              }
              initialCovers={
                userGrid.state == null ? initialCovers : userGrid.state.covers
              }
            />
            <Preview username={username} game={userGame} />
          </div>
        ),
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};
