import 'react';
import { Doc } from '../../../convex/_generated/dataModel';

import './Leaderboard.css';

interface LeaderboardProps {
  game: Doc<'games'>;
}

export const Leaderboard = ({ game }: LeaderboardProps) => {
  // find users
  const winners = game.winners;
  const losers = game.losers;
  const unknownUsers = game.users
    .map((user) => user.username)
    .filter(
      (username) => !winners.includes(username) && !losers.includes(username),
    );

  // set rankings
  const ranking = new Map();
  let curRank = 1;
  for (const user of winners) {
    ranking.set(user, curRank);
    curRank++;
  }
  for (const user of unknownUsers) {
    ranking.set(user, '?');
    curRank++;
  }
  for (const user of losers.reverse()) {
    ranking.set(user, curRank);
    curRank++;
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="leaderboard-top-header">Leaderboard</div>
        <div className="leaderboard-item">
          <div className="leaderboard-rank">Rank</div>
          <div className="leaderboard-user">User</div>
        </div>
      </div>
      <div className="leaderboard-winner-container">
        {winners.map((winner) => (
          <div className="leaderboard-item">
            <div className="leaderboard-rank">{ranking.get(winner)}</div>
            <div className="leaderboard-user winner">{winner}</div>
          </div>
        ))}
      </div>
      <div className="leaderboard-unknown-container">
        {unknownUsers.map((unknownUser) => (
          <div className="leaderboard-item">
            <div className="leaderboard-rank">?</div>
            <div className="leaderboard-user unknown">{unknownUser}</div>
          </div>
        ))}
      </div>
      <div className="leaderboard-loser-container">
        {losers.map((loser) => (
          <div className="leaderboard-item">
            <div className="leaderboard-rank">{ranking.get(loser)}</div>
            <div className="leaderboard-user loser">{loser}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
