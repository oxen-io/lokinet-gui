import React from 'react';
import styled from 'styled-components';
import { AiOutlinePlus } from 'react-icons/ai';

const StyledPlus = styled.div`
  width: 30px;
  height: 30px;
  padding: 5px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const MinusIcon = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 11H19V12H5z"></path>
    </svg>
  );
};

const BorderIcon = ({ type }: { type: 'plus' | 'minus' }): JSX.Element => {
  return (
    <StyledPlus>
      {type === 'plus' ? <AiOutlinePlus /> : <MinusIcon />}
    </StyledPlus>
  );
};

const WhiteLine = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.textColor};
  flex-grow: 1;
  flex-shrink: 100;
  margin: auto;
`;

const StyledContainer = styled.div`
  width: 100%;
  color: ${(props) => props.theme.textColor};
  height: 93px;
  display: flex;
  align-items: center;
`;

export const PlusDivider = (): JSX.Element => {
  return (
    <StyledContainer>
      <BorderIcon type="plus" />
      <WhiteLine />
      <BorderIcon type="plus" />
    </StyledContainer>
  );
};

export const MinusDivider = (): JSX.Element => {
  return (
    <StyledContainer>
      <BorderIcon type="minus" />
      <WhiteLine />
      <BorderIcon type="minus" />
    </StyledContainer>
  );
};
