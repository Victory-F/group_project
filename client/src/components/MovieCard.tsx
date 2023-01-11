import styled from "styled-components";
import { Movie } from "../../../types/gameTypes";

export const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <div>
      <h3>{movie.name}</h3>
      <MovieImage src={movie.poster} />
    </div>
  );
};

const MovieImage = styled.img`
  max-height: 17vw;
  max-width: 17vw;
`;
