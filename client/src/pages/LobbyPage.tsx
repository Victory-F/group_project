import { useEffect, useState } from "react";
import { Game, Reply } from "../../../types/gameTypes";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { PlayerCard } from "../components";
import { Button } from "../styled";
import styled from "styled-components";

export const LobbyPage = () => {
  const [game, setGame] = useState<Game | null>(null);
  const thisPlayerId = localStorage.getItem("id");
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
    <LobbyP>
      <H1>
        CODE <br />
        <br />
        <Span> {game?.id}</Span>
      </H1>
      <PlayersWrapper>
        {game?.players.map((p) => (
          <PlayerCard player={p} />
        ))}
      </PlayersWrapper>
      <Round>Rounds: {game?.rounds}</Round>
      {game?.players.find((player) => player.id === thisPlayerId)?.state ===
        "explainer" &&
        game.players.length > 1 && (
          <ButtonLobby
            onClick={() => {
              socket.emit("start-game", thisPlayerId, game.id);
            }}
          >
            Start
          </ButtonLobby>
        )}
    </LobbyP>
  );
};

const Span = styled.span`
  border: solid white 1.5px;
  padding: 7px;
  box-shadow: 0 0 5px #ffffff, 0 0 25px #ffffff, 0 0 50px #ffffff,
    0 0 100px #ffffff;
  border-radius: 10px;
`;
const ButtonLobby = styled(Button)`
  margin-top: 100px;
`;

const Round = styled.h3`
  padding-top: 50px;
  color: white;
`;

const LobbyP = styled.div`
  width: 100%;
  height: 830px;
  margin-top: -30px;
  background: url("https://static.vecteezy.com/system/resources/thumbnails/001/616/361/original/clip-of-film-reel-and-classic-camera-spinning-with-right-side-light-and-warm-background-in-4k-free-video.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  font-family: Georgia, "Times New Roman", Times, serif;
`;

const PlayersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const H1 = styled.h1`
  padding-top: 40px;
  color: white;
`;
