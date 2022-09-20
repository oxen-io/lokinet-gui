import React from 'react';
import styled, { useTheme } from 'styled-components';

const StyledButton = styled.button`
  border: 1px solid ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.backgroundColor};
  border-radius: 7px;
  outline: none;
  font-family: Archivo;
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
  width: fit-content;
  padding: 4px 27px;
  margin-inline-start: 10px;
  margin-inline-end: 10px;
  transition: 0.25s;
  border-radius: 7px;
  align-self: center;

  :hover {
    color: ${(props) => props.theme.textColorSubtle};
    border: 1px solid ${(props) => props.theme.textColorSubtle};
  }
`;

export const TextButton = (props: {
  text: string;
  title: string;
  onClick: () => void;
  buttonColor?: string;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <StyledButton
      onClick={props.onClick}
      title={props.title}
      theme={{ ...theme, textColor: props.buttonColor || theme.textColor }}
    >
      {props.text}
    </StyledButton>
  );
};
