import express, { Application } from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { Server, Socket } from "socket.io";

const PORT = process.env.PORT || 4000;
const app: Application = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", (socket: Socket) => {
  console.log("Connected: ", socket.id);

  socket.emit("message", "HELLO!");
  socket.on("message from mahtab", (message) => {
    console.log(message);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
