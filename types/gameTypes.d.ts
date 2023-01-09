export type GameState = "lobby" | "running" | "ended";

type Game = {
  id: string;
  rounds: number;
  players: Player[];
  state: GameState;
};

type Player = {
  id: string;
  name: string;
  imgUrl: string;
  score: Rounds;
  state: "explainer" | "guesser";
};

type Rounds = number;
type Code = string;

type PlayerInit = Omit<Player, "id" | "score" | "state">;

type CreateGameInit = {
  player: PlayerInit;
  rounds: Rounds;
};

type JoinGameInit = {
  player: PlayerInit;
  code: Code;
};

type Movie = {
  name: string;
  poster: string;
};

type Guess = {
  playerId: string;
  playerName: string;
  text: string;
  state: "red" | "yellow" | "green";
};
