import { useState } from "react";
import { CreateGameInit, Reply } from "../../../types/gameTypes";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import "./CreateGame.css";
export const CreateGame = () => {
  const [createGameInit, setCreateGameInit] = useState<CreateGameInit>({
    player: { name: "", imgUrl: "" },
    rounds: 1,
  });
  const navigate = useNavigate();
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("create-game", createGameInit, (response: Reply) => {
      if (!response.success) {
        console.log(response.message);
      } else {
        navigate("/lobby");
      }
    });
  };
  return (
    <div className="formCreate">
      <h1 className="headerA"> Create Game</h1>
      <form onSubmit={submitForm} className="form">
        <input
          placeholder="Name"
          value={createGameInit.player.name}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setCreateGameInit({
              ...createGameInit,
              player: { ...createGameInit.player, name: e.currentTarget.value },
            });
          }}
          maxLength={15}
          required
        />
        <input
          placeholder="Image Url"
          value={createGameInit.player.imgUrl}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setCreateGameInit({
              ...createGameInit,
              player: {
                ...createGameInit.player,
                imgUrl: e.currentTarget.value,
              },
            });
          }}
          required
        />
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Rounds"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setCreateGameInit({
              ...createGameInit,
              rounds: parseInt(e.currentTarget.value),
            });
          }}
          required
        />
        <button type="submit" className="b">
          <span></span>
          <span></span>
          <span></span>
          <span></span>Create
        </button>
      </form>
    </div>
  );
};
