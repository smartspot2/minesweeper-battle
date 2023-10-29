import 'react';
import React from 'react';
import { Doc } from '../../../convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import './Preview.css';

interface CellProps {
  cover: number;
}

interface GridProps {
  covers: number[][];
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
const Grid = ({ covers }: GridProps) => {
  return (
    <div className="preview-grid">
      {covers.map((row, row_index) => (
        <div className="preview-grid-row" key={row_index}>
          {row.map((cell, col_index) => (
            <Cell cover={cell} key={col_index} />
          ))}
        </div>
      ))}
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
      gridElements.push(<Grid covers={grid.state.covers} key={grid._id} />);
    }
  }

  return <div className="preview-game-container">{gridElements}</div>;
};
