import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, ButtonSpan, Text } from "../styled";
export const HomePage = () => {
  const navigate = useNavigate();
  const navigateCreate = () => {
    navigate("/create");
  };
  const navigateJoin = () => {
    navigate("/join");
  };
  return (
    <HomeWrapper>
      <Video loop autoPlay muted>
        <source src="home.mp4" type="video/mp4" />
      </Video>
      <Text>
        <h1>MoviEmoji</h1>
        <Button onClick={navigateCreate}>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>Create
        </Button>
        <Button onClick={navigateJoin}>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>
          <ButtonSpan></ButtonSpan>Join
        </Button>
      </Text>
    </HomeWrapper>
  );
};
const Video = styled.video`
  opacity: 0.4;
  position: relative;
  z-index: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  justify-content: center;
`;
const HomeWrapper = styled.div`
  display: flex;
  position: absolute;
  background-color: black;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
`;
