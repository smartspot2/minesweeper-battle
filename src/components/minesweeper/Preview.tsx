import 'react';
import React from 'react';
import { Doc } from '../../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import './Preview.css';

enum Status {
  NONE,
  WINNER,
  LOSER,
}

interface CellProps {
  cover: number;
}

interface GridProps {
  covers: number[][];
  username: string;
  status: Status;
}

interface GameProps {
  username: string;
  game: Doc<'games'>;
}

/**
 * Preview cell
 */
const Cell = ({ cover }: CellProps) => {
  let cellClass = 'preview-cell';
  if (cover === 0) {
    cellClass += ' ' + 'preview-visible';
  } else if (cover === 1) {
    cellClass += ' ' + 'preview-hidden';
  } else if (cover === 2) {
    cellClass += ' ' + 'preview-flag';
  }

  return <div className={cellClass}></div>;
};

/**
 * Preview grid
 */
const Grid = ({ covers, username, status }: GridProps) => {
  let statusClass = '';
  if (status == Status.WINNER) {
    statusClass = 'preview-winner';
  } else if (status == Status.LOSER) {
    statusClass = 'preview-loser';
  }
  return (
    <div className="preview-grid-wrapper">
      <div className="preview-header">{username}</div>
      <div className="preview-overlay-container">
        <div className="preview-grid">
          {covers.map((row, row_index) => (
            <div className="preview-grid-row" key={row_index}>
              {row.map((cell, col_index) => (
                <Cell cover={cell} key={col_index} />
              ))}
            </div>
          ))}
        </div>
        <div className={`preview-overlay ${statusClass}`}></div>
      </div>
    </div>
  );
};

/**
 * Preview game: view all grids except for username's
 */
export const Preview = ({ username, game }: GameProps) => {
  const gridElements: Array<React.ReactNode> = [];
  const grids = useQuery(api.queries.grid.getOpponentGridsFromGame, {
    game_id: game._id,
    username: username,
  });

  if (grids == null) return;

  for (const grid of grids) {
    if (grid.state != null) {
      let status = Status.NONE;
      if (game.winners.includes(grid.username)) {
        status = Status.WINNER;
      } else if (game.losers.includes(grid.username)) {
        status = Status.LOSER;
      }

      gridElements.push(
        <Grid
          status={status}
          covers={grid.state.covers}
          username={grid.username}
          key={grid._id}
        />,
      );
    }
  }

  return <div className="preview-game-container">{gridElements}</div>;
};
