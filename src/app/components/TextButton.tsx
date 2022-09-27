import React from 'react';
import styled, { useTheme } from 'styled-components';

const StyledButton = styled.button<{ disabled?: boolean }>`
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
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'default')};

  :hover {
    color: ${(props) => !props.disabled && props.theme.textColorSubtle};
    border: 1px solid
      ${(props) => !props.disabled && props.theme.textColorSubtle};
  }
`;

export const TextButton = (props: {
  text: string;
  onClick: () => void;
  textAndBorderColor?: string;
  backgroundColor?: string;
  disabled?: boolean;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <StyledButton
      onClick={props.onClick}
      theme={{
        ...theme,
        textColor: props.textAndBorderColor || theme.textColor,
        backgroundColor: props.backgroundColor || theme.backgroundColor
      }}
      disabled={props.disabled}
    >
      {props.text}
    </StyledButton>
  );
};
