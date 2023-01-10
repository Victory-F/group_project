import { useState } from "react";
import { JoinGameInit, Reply } from "../../../types/gameTypes";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
export const JoinGame = () => {
  const [joinGameInit, setJoinGameInit] = useState<JoinGameInit>({
    player: { name: "", imgUrl: "" },
    code: "",
  });
  const navigate = useNavigate();
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("join-game", joinGameInit, (response: Reply) => {
      if (response) {
        navigate("/lobby");
      }
    });

    console.log(joinGameInit, "this is join game init");
  };
  return (
    <div>
      <h1> Join game page</h1>
      <form onSubmit={submitForm}>
        <input
          placeholder="Name"
          value={joinGameInit.player.name}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setJoinGameInit({
              ...joinGameInit,
              player: { ...joinGameInit.player, name: e.currentTarget.value },
            });
          }}
          maxLength={15}
          required
        />
        <input
          placeholder="Image Url"
          value={joinGameInit.player.imgUrl}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setJoinGameInit({
              ...joinGameInit,
              player: {
                ...joinGameInit.player,
                imgUrl: e.currentTarget.value,
              },
            });
          }}
          required
        />
        <input
          type="text"
          placeholder="Room Code"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setJoinGameInit({
              ...joinGameInit,
              code: e.currentTarget.value,
            });
          }}
          required
        />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};
