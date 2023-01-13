import React from "react";
import styled from "styled-components";
import { Guess } from "../../../types/gameTypes";

export const GuessCard = ({
  guess,
  children,
}: {
  guess: Guess;
  children?: React.ReactNode;
}) => {
  return (
    <GuessWrapper>
      <PlayerMessage>
        {guess.state === "red" ? <p>🥶️</p> : null}
        {guess.state === "white" ? <p>❓️</p> : null}
        {guess.state === "green" ? <p>🤩️</p> : null}
        {guess.state === "yellow" ? <p>🥵️</p> : null}
      </PlayerMessage>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <PlayerName>{guess.playerName}:</PlayerName>
        <PlayerMessage>{guess.text}</PlayerMessage>
      </div>
      {children}
    </GuessWrapper>
  );
};

const GuessWrapper = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: space-around;
  margin: 5px;
  flex-wrap: wrap;
  min-width: content;
`;
const PlayerName = styled.h1`
  margin: 0;
  font-size: 1.7vw;
`;
const PlayerMessage = styled.p`
  margin: 0;
`;
