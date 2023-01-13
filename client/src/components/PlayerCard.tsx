import styled from "styled-components";
import { Player } from "../../../types/gameTypes";

export const PlayerCard = ({ player }: { player: Player }) => {
  return (
    <PlayerWrapper
      style={
        player.state === "explainer"
          ? { background: "rgba(0,0,0,0.7)" }
          : { background: "rgba(255,255,255,0.7)", color: "black" }
      }
    >
      <NameScore>
        <PlayerName>{player.name}</PlayerName>
        <PlayerScore>⭐ {player.score}</PlayerScore>
      </NameScore>
      <ImageWrapper>
        <PlayerImage src={player.imgUrl} />
      </ImageWrapper>
    </PlayerWrapper>
  );
};

const PlayerWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 18vw;
  margin: 5px;
  flex-wrap: wrap;
  min-width: content;

  min-height: content;
`;

const PlayerName = styled.h1`
  margin: 0;
  color: white;
  font-size: 1.7vw;
`;
const PlayerImage = styled.img`
  max-height: 70px;
  max-width: 70px;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75px;
  width: 75px;
  padding: 3px;
`;

const NameScore = styled.div`
  display: flex;
  flex-direction: column;
  padding: 7px;
`;
const PlayerScore = styled.p`
  margin: 0;
  color: white;
`;
