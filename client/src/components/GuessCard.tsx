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
      <PlayerState>{guess.state}</PlayerState>
      {children}
    </GuessWrapper>
  );
};

const GuessWrapper = styled.div`
  display: flex;
  margin-left: 100px;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  line-height: 1.5rem;
  flex-direction: column;
  border: 0.3vw solid grey;
  height: 90px;
  backdrop-filter: blur(10px);
  width: 150px;
  min-width: min-content;
`;
const PlayerName = styled.h1`
  margin: 0;
  display: block;
  font-size: 1.7vw;
  margin: auto;
`;
const PlayerMessage = styled.p`
  margin: 0;
  display: block;
  margin: auto;
`;
const PlayerState = styled.p`
  margin: auto;
`;
