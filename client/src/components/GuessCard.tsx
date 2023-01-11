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
      {children}
    </GuessWrapper>
  );
};

const GuessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.3vw solid grey;
`;
const PlayerName = styled.h1`
  margin: 0;
  font-size: 1.7vw;
`;
const PlayerMessage = styled.p`
  margin: 0;
`;
