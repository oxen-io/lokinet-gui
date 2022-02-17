import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  border: 1px solid ${(props) => props.theme.textColor};
  border-radius: 7px;
  color: ${(props) => props.theme.textColor};
  outline: none;
  font-family: Archivo;
  font-size: 14px;
  line-height: 15px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
  width: fit-content;
  padding: 4px 27px;
  margin-inline-start: 10px;
  margin-inline-end: 10px;

  background-color: ${(props) => props.theme.backgroundColor};

  transition: 0.25s;
  border-radius: 7px;
  :hover {
    color: ${(props) => props.theme.backgroundColor};
    background-color: ${(props) => props.theme.textColor};
  }
`;

export const TextButton = (props: {
  text: string;
  title: string;
  onClick: () => void;
}): JSX.Element => {
  return (
    <StyledButton onClick={props.onClick} title={props.title}>
      {props.text}
    </StyledButton>
  );
};
