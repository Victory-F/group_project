import { useEffect, useState } from "react";
import { Game } from "../../../types/gameTypes";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { Button, Header } from "../styled";
import styled from "styled-components";
import { PlayerCard } from "../components";

export const EndGame = () => {
  const [game, setGame] = useState<Game | null>(null);
  const playerId = socket.id;
  const navigate = useNavigate();
  useEffect(() => {
    socket.emit("game-playerId", playerId);
    socket.on("game", (gameFromServer: Game) => {
      setGame(gameFromServer);
    });
  }, []);

  return (
    <End>
      <Header>🏆 CONGRATULATION 🏆 </Header>

      {game?.players.map((p) => (
        <PlayerCard player={p} style={{ backgroundColor: "#6e2411" }} />
      ))}
      <Button onClick={() => navigate("/")}>New Game</Button>
    </End>
  );
};

const End = styled.div`
  display: flex;
  font-size: 20px;
  flex-direction: column;
  align-items: center;
  min-height: 850px;
  padding-buttom: 40px;
  width: 100%;
  background: url("https://static.vecteezy.com/system/resources/thumbnails/001/616/361/original/clip-of-film-reel-and-classic-camera-spinning-with-right-side-light-and-warm-background-in-4k-free-video.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow-x: hidden;
  text-align: center;
  color: white;
  font-family: Georgia, "Times New Roman", Times, serif;
`;
