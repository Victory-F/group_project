import { useEffect, useState } from "react";
import { Game, Reply } from "../../../types/gameTypes";
import { socket } from "../socket/socket";

export const LobbyPage = () => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    socket.emit("player-id", socket.id, (response: Reply) => {
      if (!response.success) {
        console.log(response.message);
      } else {
        socket.on("lobby", (gameFromServer: Game) => {
          setGame(gameFromServer);
        });
      }
    });
  }, []);

  return (
    <div>
      <h1> this is Lobby</h1>
      <h2>Code: {game?.id}</h2>
      {game?.players.map((p) => (
        <div>{p.name}</div>
      ))}
      <h3>Rounds: {game?.rounds}</h3>
    </div>
  );
};
