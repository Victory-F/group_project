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
  console.log("Connected: ", socket.id);

  // socket.emit("message", "HELLO!");
  // socket.on("message from mahtab", (message) => {
  //   console.log(message);
  // });

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

  socket.on("join-game", (joinGameInit: JoinGameInit, callback: Callback) => {
    //check the code
    //create player
    //add player to the game with this code
    //send true or false back
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
