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
        <div>
          <label>
            Username:
            <input
              className="username-input"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <button className="username-submit" onClick={doConfirmUsername}>
            Submit
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="login-container">
        <button className="create-game-button" onClick={createGame}>
          Create Game
        </button>
        <div className="join-game-container">
          {games != null && games.length > 0 ? (
            <div className="join-game-list">
              <div className="join-game-item">
                <span></span>
                <div className="join-game-id">
                  <b>ID</b>
                </div>
                <div className="join-game-users">
                  <b>Users</b>
                </div>
              </div>
              {games.map((game) => (
                <div className="join-game-item" key={game._id}>
                  <button
                    className="join-game-button"
                    onClick={() => joinGame(game._id)}
                  >
                    Join
                  </button>
                  <div className="join-game-id">{game._id}</div>
                  <div className="join-game-users">
                    {game.users.map((user) => user.username).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="join-game-item">
              <span></span>
              <span>No current games!</span>
              <span></span>
            </div>
          )}
        </div>
      </div>
    );
  }
};
