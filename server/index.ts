import express, { Application } from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { Server, Socket } from "socket.io";

import {
  Callback,
  CreateGameInit,
  Game,
  Guess,
  JoinGameInit,
  Movie,
  Player,
} from "../types/gameTypes";

const PORT = process.env.PORT || 4000;
const app: Application = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let games: Game[] = [];

io.on("connection", (socket: Socket) => {
  console.log("connected", socket.id); // true

  socket.on("disconnect", () => {
    console.log("disconected", socket.id); // false
  });

  //create game
  socket.on(
    "create-game",
    (createGameInit: CreateGameInit, callback: Callback) => {
      try {
        //check the data from the client
        if (
          !createGameInit ||
          createGameInit.rounds <= 0 ||
          createGameInit.rounds > 10 ||
          !createGameInit.rounds ||
          !createGameInit.player.name ||
          !createGameInit.player.imgUrl
        ) {
          callback({ success: false, message: "access denied" });
        } else {
          //create player
          const player: Player = {
            id: socket.id,
            name: createGameInit.player.name,
            imgUrl: createGameInit.player.imgUrl,
            score: 0,
            state: "explainer",
          };
          //create a Game
          const game: Game = {
            id:
              (Math.random() * 1000).toString().slice(0, 3) +
              socket.id.toString().slice(0, 3),
            rounds: createGameInit.rounds,
            players: [player],
            state: "lobby",
            clues: [],
            guesses: [],
          };
          games = [...games, game];
          callback({ success: true, message: "" });
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

  //join game
  socket.on("join-game", (joinGameInit: JoinGameInit, callback: Callback) => {
    try {
      //check the code
      const canJoin: boolean = games.find(
        (g) =>
          g.id === joinGameInit.code &&
          g.players.length < 10 &&
          g.state === "lobby"
      )
        ? true
        : false;

      if (
        !joinGameInit ||
        !joinGameInit.player ||
        !joinGameInit.player.name ||
        !joinGameInit.player.imgUrl ||
        !canJoin
      ) {
        callback({ success: false, message: "access denied" });
      } else {
        //create player
        const player: Player = {
          id: socket.id,
          name: joinGameInit.player.name,
          imgUrl: joinGameInit.player.imgUrl,
          score: 0,
          state: "guesser",
        };
        //add player to the game with this code
        games = games.map((g) =>
          g.id === joinGameInit.code
            ? { ...g, players: [...g.players, player] }
            : g
        );
        callback({ success: true, message: "" });
      }
    } catch (e) {
      console.log(e);
    }
  });

  //lobby
  socket.on("player-id", (playerId: string, callback: Callback) => {
    try {
      const game: Game | undefined = games.find(
        (g) => g.players.find((p) => p.id === playerId) && g.state === "lobby"
      );
      if (game) {
        callback({ success: true, message: "" });
        socket.join(game.id);
        io.to(game.id).emit("lobby", game);
      } else {
        callback({ success: false, message: "access denied" });
      }
    } catch (e) {
      console.log(e);
    }
  });
  //start game
  socket.on("start-game", (playerId: string, gameId: string) => {
    try {
      const game: Game | undefined = games.find(
        (game) =>
          game.id === gameId &&
          game.players.find(
            (player) => player.id === playerId && player.state === "explainer"
          )
      );
      if (game) {
        games = games.map((g) =>
          g.id === gameId ? { ...g, state: "running" } : g
        );
        socket.join(gameId);
        io.to(gameId).emit("send-started", true);
      }
    } catch (e) {
      console.log(e);
    }
  });

  //game

  socket.on(
    "game-playerId",
    (
      playerId: string,
      movie: Movie,
      message: string,
      guessId: string,
      next: boolean
    ) => {
      try {
        const gameId: string | undefined = games.find(
          (g) =>
            g.players.find((p) => p.id === playerId) && g.state === "running"
        )?.id;

        const playerState = games
          .find((game) => game.id === gameId)
          ?.players.find((player) => player.id === playerId)?.state;

        const playerName =
          games
            .find((game) => game.id === gameId)
            ?.players.find((player) => player.id === playerId)?.name || "";

        if (gameId) {
          if (playerState === "explainer") {
            if (movie && message && guessId) {
              const playerGuessedId = games
                .find((g) => g.id === gameId)
                ?.guesses.find((g) => g.id === guessId)?.playerId;
              games = games.map((g) =>
                g.id === gameId
                  ? {
                      ...g,
                      guesses: g.guesses.map((guess) =>
                        guess.id === guessId
                          ? { ...guess, state: message }
                          : guess
                      ),
                      players: g.players.map((p) =>
                        p.id === playerGuessedId
                          ? { ...p, score: p.score + 1 }
                          : p
                      ),
                      currentMovie: movie,
                    }
                  : g
              );
            } else if (movie && !message && !guessId) {
              games = games.map((g) =>
                g.id === gameId
                  ? {
                      ...g,
                      currentMovie: movie,
                    }
                  : g
              );
            } else if (!movie && message && !guessId) {
              games = games.map((g) =>
                g.id === gameId ? { ...g, clues: [...g.clues, message] } : g
              );
            } else if (!movie && message && guessId) {
              games = games.map((g) =>
                g.id === gameId
                  ? {
                      ...g,
                      guesses: g.guesses.map((guess) =>
                        guess.id === guessId
                          ? { ...guess, state: message }
                          : guess
                      ),
                    }
                  : g
              );
            } else if (!movie && !message && !guessId && next) {
              const indexOfThisPlayer = games
                .find((g) => g.id === gameId)
                ?.players.findIndex((p) => p.id === playerId);

              const playersLength = games.find((g) => g.id === gameId)?.players
                .length;

              const rounds = games.find((g) => g.id === gameId)?.rounds;

              if (
                playersLength !== undefined &&
                indexOfThisPlayer !== playersLength - 1
              ) {
                let playersArr: Player[] =
                  games.find((g) => g.id)?.players || [];

                playersArr[
                  indexOfThisPlayer !== undefined ? indexOfThisPlayer : -1
                ] = {
                  ...playersArr[
                    indexOfThisPlayer !== undefined ? indexOfThisPlayer : -1
                  ],
                  state: "guesser",
                };
                playersArr[
                  indexOfThisPlayer !== undefined ? indexOfThisPlayer + 1 : -1
                ] = {
                  ...playersArr[
                    indexOfThisPlayer !== undefined ? indexOfThisPlayer + 1 : -1
                  ],
                  state: "explainer",
                };

                games = games.map((game) =>
                  game.id === gameId
                    ? {
                        ...game,
                        players: playersArr,
                        clues: [],
                        guesses: [],
                        currentMovie: null,
                      }
                    : game
                );
              } else if (
                playersLength !== undefined &&
                indexOfThisPlayer === playersLength - 1
              ) {
                if (rounds === 1) {
                  games = games.map((g) =>
                    g.id === gameId ? { ...g, state: "ended" } : g
                  );
                } else if (rounds !== undefined && rounds > 1) {
                  let playersArr: Player[] =
                    games.find((g) => g.id)?.players || [];
                  playersArr[
                    indexOfThisPlayer !== undefined ? indexOfThisPlayer : -1
                  ] = {
                    ...playersArr[
                      indexOfThisPlayer !== undefined ? indexOfThisPlayer : -1
                    ],
                    state: "guesser",
                  };
                  playersArr[0] = {
                    ...playersArr[0],
                    state: "explainer",
                  };

                  games = games.map((game) =>
                    game.id === gameId
                      ? {
                          ...game,
                          rounds: rounds !== undefined ? rounds - 1 : 0,
                          players: playersArr,
                          clues: [],
                          guesses: [],
                          currentMovie: null,
                        }
                      : game
                  );
                }
              }
            }
          } else if (playerState === "guesser") {
            if (message) {
              const guess: Guess = {
                id: Math.random().toString().slice(2, 8),
                playerId: playerId,
                playerName: playerName,
                text: message,
                state: "white",
              };
              games = games.map((g) =>
                g.id === gameId ? { ...g, guesses: [...g.guesses, guess] } : g
              );
            }
          }
          socket.join(gameId);
          io.to(gameId).emit(
            "game",
            games.find((g) => g.id === gameId)
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  );

  //end game
  socket.on("end-game", (playerId: string) => {
    try {
      const game: Game | undefined = games.find(
        (g) => g.players.find((p) => p.id === playerId) && g.state === "ended"
      );
      if (game) {
        const sortedPlayersByScore = game.players.sort(function (a, b) {
          return b.score - a.score;
        });
        socket.emit("game-result", { ...game, players: sortedPlayersByScore });
      }
    } catch (e) {
      console.log(e);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
