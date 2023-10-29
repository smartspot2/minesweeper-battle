import 'react';

import { Grid } from './Grid';
import './Game.css';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';
import { disruptBoard } from './util/disrupt';
import { Doc } from '../../../convex/_generated/dataModel';

interface GameProps {
  username: string;
  game: Doc<'games'>;
  initialValues: number[][];
  initialCovers: number[][];
}

/**
 * Main component for the minesweeper game.
 */
export const Game = ({username, game, initialValues: initial_values, initialCovers: initial_covers}: GameProps) => {
  const [values, setValues] = useState(initial_values);
  const [covers, setCovers] = useState(initial_covers);
  const [mined, setMined] = useState(initial_covers.map((row) => Array(row.length).fill(false)));

  const [death, setDeath] = useState(false);
  const [win, setWin] = useState(false);

  const resolveDisruption = useMutation(api.mutations.game.resolveDisruption);
  const addLoser = useMutation(api.mutations.game.addLoser);
  const addWinner = useMutation(api.mutations.game.addWinner);
  const disruptUser = useMutation(api.mutations.game.disruptUser);

  let num_disruptions = 0;
  for (let i = 0; i < game.users.length; i++) {
    if (game.users[i].username === username) {
      num_disruptions = game.users[i].disruptions;
    }
  }

  if (num_disruptions > 0) {
    let new_values = values.map((row) => [...row]);
    let new_covers = covers.map((row) => [...row]);
    disruptBoard(new_values, new_covers);

    setValues(new_values);
    setCovers(new_covers);
    resolveDisruption({
      game_id: game._id, 
      username: username, 
      new_disruption_count: num_disruptions - 1
    });
  }

  if (!win) {
    const checkedWin = checkWin(values, covers);
    if (checkedWin) {
      addWinner({game_id: game._id, username: username});
      setWin(true);
    }
  }

  const onClick = (row: number, col: number) => {
    if (death || win) {
      return;
    }

    let new_covers = covers.map((row) => [...row]);

    const cover = covers[row][col];
    if (cover === 0) {
      // TODO -- middle mouse click
      return;
    } else if (cover === 1) {
      expand(values, new_covers, row, col);
      if (values[row][col] === 9) {
        // hit mine -- death
        setDeath(true);
        addLoser({game_id: game._id, username: username});
      }
    } else if (cover === 2) {
      // flag -- no change
      return;
    }

    setCovers(new_covers);
  };

  const onFlag = (row: number, col: number) => {
    if (death || win) {
      return;
    }

    const cover = covers[row][col];
    let new_covers = covers.map((row) => [...row]);
    if (cover === 1) {
      new_covers[row][col] = 2;
      
      // send disruption upon finding mine in new spot
      if (!mined[row][col] && values[row][col] == 9) {
        let new_mined = mined.map((row) => [...row]);
        new_mined[row][col] = true;

        disruptUser({game_id: game._id, username: username});

        setMined(new_mined);
      }
    } else if (cover === 2) {
      new_covers[row][col] = 1;
    }
    setCovers(new_covers);
  };

  return (
    <div className="minesweeper-container">
      <Grid
        values={values}
        covers={covers}
        onClick={onClick}
        onFlag={onFlag}
      />
      {game.winners.indexOf(username)>-1 ? 
      <div className="win-screen">
        <b>You win!</b>
      </div>
      : <p></p>}
      {game.losers.indexOf(username)>-1 ? 
      <div className="lose-screen">
        <b>You lose!</b>
      </div>
      : <p></p>}
    </div>
  );
};


const expand = (values: number[][], covers: number[][], row: number, col: number) : void => {
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


const checkWin = (values: number[][], covers: number[][]) : boolean => {
  let checkedWin = true;
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      if (covers[i][j] !== 0 && values[i][j] !== 9) {
        checkedWin = false;
      }
    }
  }
  return checkedWin;
}