import { useState } from "react";
import { JoinGameInit, Reply } from "../../../types/gameTypes";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import { Button, ButtonSpan, FormWrapper, Header, Input } from "../styled";

export const JoinGame = () => {
  const [joinGameInit, setJoinGameInit] = useState<JoinGameInit>({
    player: { name: "", imgUrl: "" },
    code: "",
  });
  const navigate = useNavigate();
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("join-game", joinGameInit, (response: Reply) => {
      if (!response.success) {
        console.log(response.message);
      } else {
        navigate("/lobby");
      }
    });

    console.log(joinGameInit, "this is join game init");
  };
  return (
    <FormWrapper>
      <Header> Join Game</Header>
      <form onSubmit={submitForm}>
        <Input
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
        <Input
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
        <Input
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
        <Button type="submit">
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan> Join
        </Button>
      </form>
    </FormWrapper>
  );
};
