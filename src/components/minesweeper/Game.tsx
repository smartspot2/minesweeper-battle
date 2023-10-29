import 'react';

import { Grid } from './Grid';
import './Game.css';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';
import { disruptBoard } from './util/disrupt';
import { Doc } from '../../../convex/_generated/dataModel';
import { fillValues, generateMines } from './util/values';
import CONFIG from '../../util/config';
import { Leaderboard } from './Leaderboard';

interface GameProps {
  username: string;
  // current game state
  game: Doc<'games'>;
  // current grid state (only used for id retrieval)
  grid: Doc<'grids'>;

  // initial values and covers for the game
  initialValues: number[][];
  initialCovers: number[][];
}

/**
 * Main component for the minesweeper game.
 */
export const Game = ({
  username,
  game,
  grid,
  initialValues: initial_values,
  initialCovers: initial_covers,
}: GameProps) => {
  // board state
  const [values, setValues] = useState(initial_values);
  const [covers, setCovers] = useState(initial_covers);
  const [mined, setMined] = useState(
    initial_covers.map((row) => Array(row.length).fill(false)),
  );

  const [death, setDeath] = useState(false);
  const [win, setWin] = useState(false);

  const [disruptDelta, setDisruptDelta] = useState(
    initial_covers.map((row) => Array(row.length).fill(0)),
  );
  const [resolvingDisruption, setResolvingDisruption] = useState(false);

  const [hasGenerated, setHasGenerated] = useState(grid?.state != null);

  // mutations
  const resolveDisruption = useMutation(api.mutations.game.resolveDisruption);
  const addLoser = useMutation(api.mutations.game.addLoser);
  const addWinner = useMutation(api.mutations.game.addWinner);
  const disruptUser = useMutation(api.mutations.game.disruptUser);
  const updateGrid = useMutation(api.mutations.grid.mutateGrid);
  const leaveGame = useMutation(api.mutations.game.leaveGame);

  const goBack = () => {
    // go back to the main page and delete the current user's associated objects
    leaveGame({ username: username });
  };

  let num_disruptions = 0;
  for (let i = 0; i < game.users.length; i++) {
    if (game.users[i].username === username) {
      num_disruptions = game.users[i].disruptions;
    }
  }

  if (num_disruptions > 0 && !resolvingDisruption) {
    const new_values = values.map((row) => [...row]);
    const new_covers = covers.map((row) => [...row]);
    disruptBoard(new_values, new_covers);

    const foundDelta = findDisruptDelta(covers, new_covers);
    const changeByDelta = (disrupt: number[][], delta: boolean[][], amount: number) => {
      const newDisruptDelta = disrupt.map((row) => [...row]);
      for (let i = 0; i < disruptDelta.length; i++) {
        for (let j = 0; j < disruptDelta[i].length; j++) {
          if (delta[i][j]) {
            newDisruptDelta[i][j] += amount;
            if (newDisruptDelta[i][j] < 0) {
              newDisruptDelta[i][j] = 0;
            }
          }
        }
      }
      setDisruptDelta(newDisruptDelta);
    }
    changeByDelta(disruptDelta, foundDelta, 10);
    setTimeout(changeByDelta, 500, disruptDelta, foundDelta, -1);

    setValues(new_values);
    setCovers(new_covers);

    setResolvingDisruption(true);
    resolveDisruption({
      game_id: game._id,
      username: username,
      new_disruption_count: num_disruptions - 1,
    }).then(() => setResolvingDisruption(false));
  }

  if (!win) {
    const checkedWin = checkWin(values, covers);
    if (checkedWin) {
      addWinner({ game_id: game._id, username: username });
      setWin(true);
    }
  }

  const onClick = (row: number, col: number) => {
    if (death || win) {
      return;
    }

    let cur_values = values;
    if (!hasGenerated) {
      // generate the board
      cur_values = generateMines(
        CONFIG.numRows,
        CONFIG.numCols,
        CONFIG.numMines,
        row,
        col,
      );
      fillValues(cur_values);
      setHasGenerated(true);
      setValues(cur_values);
    }

    const new_covers = covers.map((row) => [...row]);

    const cover = covers[row][col];
    if (cover === 0) {
      // TODO -- middle mouse click
      return;
    } else if (cover === 1) {
      expand(cur_values, new_covers, row, col);
      if (cur_values[row][col] === 9) {
        // hit mine -- death
        setDeath(true);
        addLoser({ game_id: game._id, username: username });
      }
    } else if (cover === 2) {
      // flag -- no change
      return;
    }

    setCovers(new_covers);

    // update the server state as well
    updateGrid({
      grid_id: grid._id,
      state: { values: cur_values, covers: new_covers },
    });
  };

  const onFlag = (row: number, col: number) => {
    if (death || win) {
      return;
    }

    const cover = covers[row][col];
    const new_covers = covers.map((row) => [...row]);
    if (cover === 1) {
      new_covers[row][col] = 2;

      // send disruption upon finding mine in new spot
      if (!mined[row][col] && values[row][col] == 9) {
        const new_mined = mined.map((row) => [...row]);
        new_mined[row][col] = true;

        disruptUser({ game_id: game._id, username: username });

        setMined(new_mined);
      }
    } else if (cover === 2) {
      new_covers[row][col] = 1;
    }

    setCovers(new_covers);

    // update the server state as well
    updateGrid({
      grid_id: grid._id,
      state: { values: values, covers: new_covers },
    });
  };

  return (
    <div className="minesweeper-container">
      <Grid values={values} covers={covers} disrupts={disruptDelta} onClick={onClick} onFlag={onFlag} />
      {game.winners.indexOf(username) > -1 && (
        <div className="result-modal win-screen">
          <div className="result-text">
            <b>You win!</b>
          </div>
          <Leaderboard game={game} />
          <button className="result-button" onClick={goBack}>
            Back
          </button>
        </div>
      )}
      {game.losers.indexOf(username) > -1 && (
        <div className="result-modal lose-screen">
          <div className="result-text">
            <b>You lose!</b>
          </div>
          <Leaderboard game={game} />
          <button className="result-button" onClick={goBack}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

const expand = (
  values: number[][],
  covers: number[][],
  row: number,
  col: number,
): void => {
  const N = values.length;
  const M = values[0].length;

  if (row < 0 || row >= N || col < 0 || col >= M) {
    return; // out of bounds
  }

  const cover = covers[row][col];
  const value = values[row][col];

  if (cover === 1) {
    covers[row][col] = 0;

    if (value === 0) {
      expand(values, covers, row - 1, col);
      expand(values, covers, row + 1, col);
      expand(values, covers, row, col + 1);
      expand(values, covers, row, col - 1);

      expand(values, covers, row - 1, col - 1);
      expand(values, covers, row + 1, col - 1);
      expand(values, covers, row - 1, col + 1);
      expand(values, covers, row + 1, col + 1);
    }
  }
};

const checkWin = (values: number[][], covers: number[][]): boolean => {
  let checkedWin = true;
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      if (covers[i][j] !== 0 && values[i][j] !== 9) {
        checkedWin = false;
      }
    }
  }
  return checkedWin;
};

const findDisruptDelta = (covers: number[][], new_covers: number[][]): boolean[][] => {
  const delta = covers.map((row) => Array(row.length).fill(false));
  for (let i = 0; i < covers.length; i++) {
    for (let j = 0; j < covers[i].length; j++) {
      if (covers[i][j] !== new_covers[i][j]) {
        delta[i][j] = true;
      }
    }
  }
  return delta;
}