import { useState } from "react";
import { CreateGameInit, Reply } from "../../../types/gameTypes";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";

import { Button, ButtonSpan, FormWrapper, Header, Input } from "../styled";

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
    <FormWrapper>
      <Header> Create Game</Header>
      <form onSubmit={submitForm}>
        <Input
          placeholder="Name"
          value={createGameInit.player.name}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setCreateGameInit({
              ...createGameInit,
              player: { ...createGameInit.player, name: e.currentTarget.value },
            });
          }}
          maxLength={10}
          required
        />
        <Input
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
        <Input
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
        <Button type="submit">
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>Create
        </Button>
      </form>
    </FormWrapper>
  );
};
