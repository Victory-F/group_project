import styled from "styled-components";

export const Input = styled.input`
  display: block;
  width: 20%;
  margin: auto;
  height: 40px;
  padding: 0 10px;
  margin-bottom: 20px;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 4px;
  font-size: 16px;
  background-color: unset;

  &:focus {
    outline: none;
  }
`;
