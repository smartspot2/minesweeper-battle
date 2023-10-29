import 'react';
import { Game } from './minesweeper/Game';

export const App = () => {
  const initial_values = [
    [1, 2, 2, 1, 0], 
    [1, 9, 9, 1, 0],
    [1, 2, 2, 2, 1], 
    [0, 0, 0, 1, 9],
];
  const initial_covers = [
    [1, 1, 1, 1, 1], 
    [1, 1, 1, 1, 1], 
    [1, 1, 1, 1, 1], 
    [1, 1, 1, 1, 1],
];

  return (
    <>
      <Game 
        initial_values={initial_values} 
        initial_covers={initial_covers} 
      />
    </>
  );
};
