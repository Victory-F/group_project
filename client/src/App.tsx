import React, { useEffect } from "react";
import "./App.css";
import { socket } from "./socket/socket";
import { HomePage, CreateGame, JoinGame, LobbyPage, GamePage } from "./pages";
import { Routes, Route } from "react-router-dom";
function App() {
  useEffect(() => {
    socket.on("message", (message) => {
      console.log(message);
    });
    socket.emit("message from mahtab", "hello from client");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateGame />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/Lobby" element={<LobbyPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}

export default App;
