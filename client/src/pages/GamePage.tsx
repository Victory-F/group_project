import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Game, Movie } from "../../../types/gameTypes";
import { GuessCard, MovieCard, PlayerCard } from "../components";
import { socket } from "../socket/socket";
import { Button, Header } from "../styled";

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
          <Typing
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
          <Button type="submit"> send</Button>
        </form>
      ) : explainer ? (
        <Header>Choose a Movie To Explain</Header>
      ) : (
        <Header>Wait For The Clue</Header>
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
                        style={{ display: "block" }}
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
                        style={{ display: "block" }}
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
                        style={{ display: "block" }}
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
              <Clue>Clue: {c}</Clue>
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
        <Button
          onClick={() =>
            socket.emit("game-playerId", thisPlayerId, "", "", "", true)
          }
        >
          Continue
        </Button>
      )}
    </GamePageWrapper>
  );
};

const Clue = styled.p`
  font-size: 28px;
  background: rgba(200, 200, 200, 0.4);
`;
const MoviesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  width: 60vw;
  margin: 60px;
  margin-left: 500px;
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
  min-height: 850px;
  padding-buttom: 40px;
  width: 100%;
  background: url("https://static.vecteezy.com/system/resources/thumbnails/001/616/361/original/clip-of-film-reel-and-classic-camera-spinning-with-right-side-light-and-warm-background-in-4k-free-video.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow-x: hidden;

  text-align: center;
  font-family: Georgia, "Times New Roman", Times, serif;
`;
const Typing = styled.input`
  margin-top: 60px;
  display: block;
  width: 170px;
  height: 40px;
  padding: 0 10px;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 4px;
  font-size: 16px;
  background-color: unset;

  &:focus {
    outline: none;
  }
`;
