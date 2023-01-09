import React, { useEffect } from "react";
import "./App.css";
import { socket } from "./socket/socket";

function App() {
  useEffect(() => {
    socket.on("message", (message) => {
      console.log(message);
    });
    socket.emit("message from mahtab", "hello from client");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <h1>Home!</h1>
    </div>
  );
}

export default App;
