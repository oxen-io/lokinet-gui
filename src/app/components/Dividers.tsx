import React from 'react';
import styled from 'styled-components';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiMinus } from 'react-icons/bi';

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

const BorderIcon = ({ type }: { type: 'plus' | 'minus' }): JSX.Element => {
  return (
    <StyledPlus>{type === 'plus' ? <AiOutlinePlus /> : <BiMinus />}</StyledPlus>
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
