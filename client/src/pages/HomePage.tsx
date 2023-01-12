import { useNavigate } from "react-router-dom";
import "./HomePage.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sample from "./home.mp4";
export const HomePage = () => {
  const navigate = useNavigate();
  const navigateCreate = () => {
    navigate("/create");
  };
  const navigateJoin = () => {
    navigate("/join");
  };
  return (
    <div className="home">
      <video loop autoPlay muted className="video" src={sample} />
      <div className="text">
        <h1> Guess The Emoji</h1>
        <button onClick={navigateCreate}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>Create
        </button>
        <button onClick={navigateJoin}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>Join
        </button>{" "}
      </div>
    </div>
  );
};
