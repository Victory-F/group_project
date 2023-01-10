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

  socket.on("create-game", (createGameInit: CreateGameInit) => {
    //create a Game
    //create and add player to this game
  });

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
