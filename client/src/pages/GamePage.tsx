import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Game, Movie } from "../../../types/gameTypes";
import { MovieCard } from "../components";
import { socket } from "../socket/socket";

export const GamePage = () => {
  const [game, setGame] = useState<Game | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);

  const thisPlayerId = socket.id;

  const explainer =
    game?.players.find((player) => player.id === thisPlayerId)?.state ===
    "explainer";

  useEffect(() => {
    socket.emit("game-playerId", thisPlayerId);
    socket.on("game", (gameFromServer: Game) => {
      setGame(gameFromServer);
    });
  }, []);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=a0fdd7d682edade22bbce21b7ecf4554&language=en-US&page=${
            Math.floor(Math.random() * 500) + 1
          }`
        );
        const randomMoviesArr = [...response.data.results]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        const randomMovies = randomMoviesArr.map((m) => {
          return {
            id: m.id,
            name: m.title,
            poster: `https://image.tmdb.org/t/p/w1280${m.poster_path}`,
          };
        });
        setMovies(randomMovies);
      } catch (error) {
        console.error(error);
      }
    };
    getMovies();
  }, []);

  return (
    <div>
      <h2> this is the game page </h2>
      <h2>Code: {game?.id}</h2>
      {game?.players.find((player) => player.id === thisPlayerId)?.state ===
        "explainer" && (
        <form>
          <input placeholder="for explainer" />
          <button> send the emojies</button>
        </form>
      )}
      {game?.players.find((player) => player.id === thisPlayerId)?.state ===
        "guesser" && (
        <form>
          <input placeholder="for guesser" />
          <button> write your guess</button>
        </form>
      )}
      {game?.players.map((p) => (
        <div>
          {" "}
          <div>name:{p.name}</div>
          <div> score: {p.score} </div>
          <div>state: {p.state} </div>
        </div>
      ))}
      <MoviesWrapper>
        {explainer &&
          movies &&
          movies.map((movie) => (
            <div>
              <MovieCard movie={movie} />{" "}
              {movies.length > 1 && (
                <button
                  onClick={() =>
                    setMovies(movies.filter((m) => m.id === movie.id))
                  }
                >
                  choose
                </button>
              )}
            </div>
          ))}
      </MoviesWrapper>
    </div>
  );
};

const MoviesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5vw;
`;
