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
      {onClick && <BtoChoose onClick={onClick}>choose</BtoChoose>}
    </CardWrapper>
  );
};
const BtoChoose = styled.button`
  font-size: 15px;
  width: 55px;
  margin: auto;
  background: transparent;
  border: none;
  color: white;
`;
const CardWrapper = styled.div`
  display: flex;

  flex-direction: column;
  flex-wrap: wrap;
  width: 15vw;
  height: 21vw;
  border: solid gray 1px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  &:hover {
    background: rgba(200, 200, 200, 0.4);
    color: black;
  }
`;

const MovieName = styled.h1`
  margin: 0;
  font-size: 1.5vw;
`;

const MovieImage = styled.img`
  max-height: 13vw;
  max-width: 13vw;
  margin: auto;
`;
