import axios from "axios";
import cluster from "cluster";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Game, Movie } from "../../../types/gameTypes";
import { GuessCard, MovieCard, PlayerCard } from "../components";
import { socket } from "../socket/socket";

export const GamePage = () => {
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [message, setMessage] = useState<string>("");

  const thisPlayerId = socket.id;

  const explainer =
    game?.players.find((player) => player.id === thisPlayerId)?.state ===
    "explainer";

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
    socket.emit("game-playerId", thisPlayerId);
    socket.on("game", (gameFromServer: Game) => {
      setGame(gameFromServer);

      if (!gameFromServer.currentMovie) {
        getMovies();
      }

      if (gameFromServer.state === "ended") {
        navigate("/end");
      }
    });
  }, []);
  console.log(game?.currentMovie);
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("game-playerId", thisPlayerId, "", message);
    setMessage("");
  };

  return (
    <GamePageWrapper>
      {movies.length === 1 || (game && game?.clues.length > 0) ? (
        <form onSubmit={submitForm}>
          <input
            placeholder={
              game?.players.find((player) => player.id === thisPlayerId)
                ?.state === "explainer"
                ? "Type Your Clue"
                : "Type Your Guess"
            }
            value={message}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setMessage(e.currentTarget.value)
            }
          />
          <button type="submit"> send</button>
        </form>
      ) : explainer ? (
        <p>Choose a Movie To Explain</p>
      ) : (
        <p>Wait For The Clue</p>
      )}
      <GameWrapper>
        <GuessesWrapper>
          {game?.guesses.map((g) => (
            <GuessCard guess={g}>
              <div>
                {explainer &&
                  !game.guesses.find((g) => g.state === "green") && (
                    <div>
                      <button
                        onClick={() => {
                          socket.emit(
                            "game-playerId",
                            thisPlayerId,
                            movies[0],
                            "green",
                            g.id
                          );
                        }}
                      >
                        True!
                      </button>
                      <button
                        onClick={() =>
                          socket.emit(
                            "game-playerId",
                            thisPlayerId,
                            "",
                            "yellow",
                            g.id
                          )
                        }
                      >
                        Warm
                      </button>
                      <button
                        onClick={() =>
                          socket.emit(
                            "game-playerId",
                            thisPlayerId,
                            "",
                            "red",
                            g.id
                          )
                        }
                      >
                        Cold
                      </button>
                    </div>
                  )}
              </div>
            </GuessCard>
          ))}
        </GuessesWrapper>

        {/* Movies */}
        <MoviesWrapper>
          {explainer && movies && movies.length > 1
            ? movies.map((movie) => (
                <MovieCard
                  movie={movie}
                  onClick={() => {
                    socket.emit(
                      "game-playerId",
                      thisPlayerId,
                      movies.filter((m) => m.id === movie.id)
                    );
                    setMovies(movies.filter((m) => m.id === movie.id));
                  }}
                />
              ))
            : explainer
            ? movies[0] && <MovieCard movie={movies[0]} />
            : game &&
              game.guesses.find((g) => g.state === "green") &&
              game.currentMovie && <MovieCard movie={game.currentMovie} />}

          {/* Clue */}
          <div>
            {game?.clues.map((c) => (
              <p>Clue: {c}</p>
            ))}
          </div>
        </MoviesWrapper>
        {/* PLAYERS */}
        <PlayersWrapper>
          {game?.players.map((p) => (
            <PlayerCard player={p} />
          ))}
        </PlayersWrapper>
      </GameWrapper>
      {explainer && game.guesses.find((g) => g.state === "green") && (
        <button
          onClick={() =>
            socket.emit("game-playerId", thisPlayerId, "", "", "", true)
          }
        >
          Continue
        </button>
      )}
    </GamePageWrapper>
  );
};

const MoviesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5vw;
  width: 60vw;
`;

const GameWrapper = styled.div`
  display: flex;
  gap: 5vw;
`;
const PlayersWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const GuessesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const GamePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3vw;
  height: 99vh;
  width: 99vw;
  padding: 1vw;
`;
