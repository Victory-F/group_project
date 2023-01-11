import styled from "styled-components";
import { Player } from "../../../types/gameTypes";

export const PlayerCard = ({ player }: { player: Player }) => {
  return (
    <PlayerWrapper
      style={
        player.state === "explainer"
          ? { border: "0.3vw solid green" }
          : { border: "0.3vw solid black" }
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
  justify-content: space-between;
  align-items: center;
  width: 15vw;
  margin: 1vw;
`;

const PlayerName = styled.h1`
  margin: 0;
  font-size: 1.7vw;
`;
const PlayerImage = styled.img`
  max-height: 4.7vw;
  max-width: 4.7vw;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5vw;
  width: 5vw;
  padding: 0.3vw;
`;

const NameScore = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1vw;
`;
const PlayerScore = styled.p`
  margin: 0;
`;
