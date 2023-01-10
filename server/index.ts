import express, { Application } from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { Server, Socket } from "socket.io";
import {
  Callback,
  CreateGameInit,
  Game,
  JoinGameInit,
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
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
