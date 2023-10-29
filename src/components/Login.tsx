import React, { useState } from 'react';
import './Login.css';
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Id } from '../../convex/_generated/dataModel';

enum LoginStage {
  USERNAME,
  JOIN_OR_CREATE,
}

interface LoginProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const Login = ({ setUsername: confirmUsername }: LoginProps) => {
  const games = useQuery(api.queries.game.listGames, {});
  const createGameMutation = useMutation(api.mutations.game.createGame);
  const joinGameMutation = useMutation(api.mutations.game.joinGame);
  const [username, setUsername] = useState<string>('');

  const [loginStage, setLoginStage] = useState<LoginStage>(LoginStage.USERNAME);

  const joinGame = (game_id: Id<'games'>) => {
    joinGameMutation({ game_id, username });
  };

  const createGame = () => {
    createGameMutation({ username: username });
  };

  const doConfirmUsername = () => {
    if (username) {
      confirmUsername(username);
      setLoginStage(LoginStage.JOIN_OR_CREATE);
    } else {
      alert('Input username!');
    }
  };

  if (loginStage === LoginStage.USERNAME) {
    return (
      <div className="login-container">
        <input
          className="username-input"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={doConfirmUsername}>Submit</button>
      </div>
    );
  } else {
    return (
      <div className="login-container">
        <div className="create-game-button" onClick={createGame}>
          Create Game
        </div>
        <div className="join-game-container">
          <div className="join-game-list">
            {games != null &&
              games.map((game) => (
                <div
                  key={game._id}
                  className="join-game-button"
                  onClick={() => joinGame(game._id)}
                >
                  {game._id}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
};
