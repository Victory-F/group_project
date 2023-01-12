import styled, { keyframes } from "styled-components";
import { ButtonSpan } from "./ButtonSpan";

const ButtonAnimation = keyframes`
    0% {
      left: -100%;
    }
    50%,
    100% {
      left: 100%;
    }

`;

const ButtonAnimation2 = keyframes`
0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }

`;
const ButtonAnimation3 = keyframes`
0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
`;

const ButtonAnimation4 = keyframes`
0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }

`;
export const Button = styled.button`
  padding-right: 20px;
  margin: 20px;
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #ffffff;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  background-color: Transparent;
  border: rgb(255, 255, 255);
  letter-spacing: 4px;

  &:hover {
    background: #ffffff;
    color: rgb(0, 0, 0);
    border-radius: 5px;
    box-shadow: 0 0 5px #ffffff, 0 0 25px #ffffff, 0 0 50px #ffffff,
      0 0 100px #ffffff;
  }

  ${ButtonSpan}:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffffff);
    animation: ${ButtonAnimation} 2s linear infinite;
  }
  ${ButtonSpan}:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #ffffff);
    animation: ${ButtonAnimation2} 2s linear infinite;
    animation-delay: 0.5s;
  }
  ${ButtonSpan}:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #ffffff);
    animation: ${ButtonAnimation3} 2s linear infinite;
    animation-delay: 1s;
  }
  ${ButtonSpan}:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #ffffff);
    animation: ${ButtonAnimation4} 2s linear infinite;
    animation-delay: 1.5s;
  }
`;
