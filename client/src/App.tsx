import "./App.css";
import { socket } from "./socket/socket";
import {
  HomePage,
  CreateGame,
  JoinGame,
  LobbyPage,
  GamePage,
  EndGame,
} from "./pages";

import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateGame />} />
      <Route path="/join" element={<JoinGame />} />
      <Route path="/Lobby" element={<LobbyPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/end" element={<EndGame />} />
    </Routes>
  );
}

export default App;
