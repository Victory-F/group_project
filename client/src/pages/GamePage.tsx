import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Game, Movie } from "../../../types/gameTypes";
import { GuessCard, MovieCard, PlayerCard } from "../components";
import { socket } from "../socket/socket";
import EmojiPicker, {
  EmojiStyle,
  EmojiClickData,
  Emoji,
} from "emoji-picker-react";
import { Button } from "../styled";

export const GamePage = () => {
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [message, setMessage] = useState<string>("");

  const thisPlayerId = socket.id;

  const explainer =
    game?.players.find((player) => player.id === thisPlayerId)?.state ===
    "explainer";

  const guesser =
    game?.players.find((player) => player.id === thisPlayerId)?.state ===
    "guesser";

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

  const submitFormExplainer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("game-playerId", thisPlayerId, "", message);
    explainer && setEmojiOpen(false);
    setMessage("");
  };
  const submitFormGuesser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("game-playerId", thisPlayerId, "", message);
    setMessage("");
  };
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
  const onClick = (emojiData: EmojiClickData) => {
    setMessage(message + emojiData.emoji);
  };

  return (
    <GamePageWrapper>
      {movies.length === 1 || (game && game?.clues.length > 0)
        ? (explainer && (
            <form onSubmit={submitFormExplainer}>
              <EmojiInput
                onClick={() => setEmojiOpen(!emojiOpen)}
                placeholder="Enter the Emojis"
                value={message}
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setMessage(e.currentTarget.value)
                }
              />
              {emojiOpen && (
                <EmojiPickerWrapper>
                  <EmojiPicker onEmojiClick={onClick} autoFocusSearch={false} />
                </EmojiPickerWrapper>
              )}
              <Emoji unified={message} emojiStyle={EmojiStyle.APPLE} />
              <SendButton type="submit"> send</SendButton>
            </form>
          )) ||
          (guesser && (
            <form onSubmit={submitFormGuesser}>
              <input
                placeholder="Type Your Guess"
                value={message}
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setMessage(e.currentTarget.value)
                }
              />
              <button type="submit"> send</button>
            </form>
          ))
        : (explainer && <p>Choose a Movie To Explain</p>) ||
          (guesser && <p>Wait For The Clue</p>)}

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
          <ClueWrapper>
            {game?.clues.map((c) => (
              <Clue key={c}>{c}</Clue>
            ))}
          </ClueWrapper>
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
          style={{ position: "relative", top: "50%" }}
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

  z-index: 2;
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
  background: url("https://static.vecteezy.com/system/resources/thumbnails/001/616/361/original/clip-of-film-reel-and-classic-camera-spinning-with-right-side-light-and-warm-background-in-4k-free-video.jpg");
  background-size: cover;
`;

const EmojiInput = styled.input`
  outline: none;
  border: 1px solid black;
  width: 450px;
  height: 50px;
  font-size: 25px;
  padding-left: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 10px;
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  top: 12%;
  left: 33.5%;
  z-index: 3;
`;

const ClueWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  left: 20%;
  height: 70%;
  width: 60%;
  background: rgb(255, 255, 255, 0.5);
  z-index: -1;
  padding: 30px;
`;

const Clue = styled.h2`
  margin: 0;
  font-size: 40px;
  align-self: center;
  padding: 3px;
`;

const SendButton = styled.button`
  background: none;
  border: solid white;
  border-radius: 5px;
  color: white;
  font-size: 20px;
  text-transform: uppercase;
  padding: 12px;
  margin: 3px;
  cursor: pointer;
  &:hover {
    background: #ffffff;
    color: rgb(0, 0, 0, 0.5);
    border-radius: 5px;
    box-shadow: 0 0 5px #ffffff, 0 0 25px #ffffff, 0 0 50px #ffffff,
      0 0 100px #ffffff;
  }
`;
