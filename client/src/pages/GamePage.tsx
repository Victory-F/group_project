import { useEffect, useState } from "react";
import { Game } from "../../../types/gameTypes";
import { socket } from "../socket/socket";

export const GamePage = () => {
  const [game, setGame] = useState<Game | null>(null);

  const thisPlayerId = socket.id;

  useEffect(() => {
    socket.emit("game-playerId", thisPlayerId);
    socket.on("game", (gameFromServer: Game) => {
      setGame(gameFromServer);
    });
  }, []);
  return (
    <div>
      <h2> this is the game page</h2>
      <h2>Code: {game?.id}</h2>
      {game?.players.find((player) => player.id === thisPlayerId)?.state ===
        "explainer" && (
        <form>
          <input placeholder="for explainer" />
          <button> send the emojies</button>
        </form>
      )}
      {game?.players.find((player) => player.id === thisPlayerId)?.state ===
        "guesser" && (
        <form>
          <input placeholder="for guesser" />
          <button> write your guess</button>
        </form>
      )}
      {game?.players.map((p) => (
        <div>
          {" "}
          <div>name:{p.name}</div>
          <div> score: {p.score} </div>
          <div>state: {p.state} </div>
        </div>
      ))}
    </div>
  );
};
