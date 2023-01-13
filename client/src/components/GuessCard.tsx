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
      <PlayerName>{guess.playerName}:</PlayerName>
      <PlayerMessage>{guess.text}</PlayerMessage>
      <PlayerMessage>
        {guess.state === "red" ? <p>🥶️</p> : null}
        {guess.state === "white" ? <p>❓️</p> : null}
        {guess.state === "green" ? <p>🤩️</p> : null}
        {guess.state === "yellow" ? <p>🥵️</p> : null}
      </PlayerMessage>

      {children}
    </GuessWrapper>
  );
};

const GuessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: hsla(34, 100%, 19%, 0.5);
  margin: 4px;
  flex-wrap: wrap;
  height: 50px;
  min-width: content;
`;
const PlayerName = styled.h1`
  margin: 0;
  font-size: 1.7vw;
`;
const PlayerMessage = styled.p`
  margin: 0;
`;
