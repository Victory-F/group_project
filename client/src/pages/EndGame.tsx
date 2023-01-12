import { useEffect, useState } from "react";
import { Game } from "../../../types/gameTypes";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

export const EndGame = () => {
  const [game, setGame] = useState<Game | null>(null);
  const playerId = socket.id;
  const navigate = useNavigate();
  useEffect(() => {
    socket.emit("end-game", playerId);
    socket.on("game-result", (gameFromServer: Game) => {
      setGame(gameFromServer);
    });
  }, []);
  return (
    <div>
      <h1> this is end page</h1>
      <h2>Code: {game?.id}</h2>

      {game?.players.map((p) => (
        <div>
          <img src={p.imgUrl} alt="player" />
          <p>Player name:{p.name}</p>
          <p>Score:{p.score}</p>
        </div>
      ))}
      <button onClick={() => navigate("/")}>New Game</button>
    </div>
  );
};
