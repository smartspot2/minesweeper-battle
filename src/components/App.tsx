import 'react';
import { Game } from './minesweeper/Game';
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

const NUM_ROWS = 15;
const NUM_COLS = 15;
const NUM_MINES = 50;

export const App = () => {
  const [username, setUsername] = useState<string>('');
  const userGame = useQuery(api.queries.game.getGameFromUsername, { username });

  const initialValues = generateMines(NUM_ROWS, NUM_COLS, NUM_MINES);
  fillValues(initialValues);
  const initialCovers = [...Array(NUM_ROWS)].map(() => Array(NUM_COLS).fill(1));

  console.log(userGame);

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
        ) : (
          <Game
            game={userGame!}
            username={username}
            initialValues={initialValues}
            initialCovers={initialCovers}
          />
        ),
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};
