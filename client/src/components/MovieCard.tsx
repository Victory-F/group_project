import styled from "styled-components";
import { Movie } from "../../../types/gameTypes";

export const MovieCard = ({
  movie,
  onClick,
}: {
  movie: Movie;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <CardWrapper>
      <MovieName>{movie.name}</MovieName>
      <MovieImage src={movie.poster} />
      {onClick && <BtoChoose onClick={onClick}>CHOOSE</BtoChoose>}
    </CardWrapper>
  );
};
const BtoChoose = styled.button`
  font-size: 10px;
  width: 55px;
  margin: 3px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;

  &:hover {
    text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff,
      0 0 42px rgb(255, 255, 255), 0 0 82px rgb(255, 255, 255),
      0 0 92px rgb(255, 255, 255), 0 0 102px rgb(255, 255, 255),
      0 0 151px rgb(255, 255, 255);
  }
`;
const CardWrapper = styled.div`
  display: flex;

  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 170px;
  height: 250px;
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
`;

const MovieName = styled.h1`
  margin: 0;
  font-size: 12px;
`;

const MovieImage = styled.img`
  max-height: 160px;
  max-width: 160px;
`;
