import { useEffect, useState } from "react";
import { Game, Reply } from "../../../types/gameTypes";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

export const LobbyPage = () => {
  const [game, setGame] = useState<Game | null>(null);
  const thisPlayerId = socket.id;
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("player-id", thisPlayerId, (response: Reply) => {
      if (!response.success) {
        console.log(response.message);
      } else {
        socket.on("lobby", (gameFromServer: Game) => {
          setGame(gameFromServer);
        });
      }
    });
    socket.on("send-started", (started: boolean) => {
      if (started) {
        navigate("/game");
      }
    });
  }, []);

  return (
    <div>
      <h1> this is Lobby</h1>
      <h2>Code: {game?.id}</h2>

      {game?.players.map((p) => (
        <div>
          {" "}
          <div>{p.name}</div>
        </div>
      ))}
      <h3>Rounds: {game?.rounds}</h3>
      {game?.players.find((player) => player.id === thisPlayerId)?.state ===
        "explainer" &&
        game.players.length > 1 && (
          <button
            onClick={() => {
              socket.emit("start-game", thisPlayerId, game.id);
            }}
          >
            Start
          </button>
        )}
    </div>
  );
};
