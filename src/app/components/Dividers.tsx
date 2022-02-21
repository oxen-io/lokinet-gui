import React from 'react';
import styled from 'styled-components';
import { AiOutlinePlus } from 'react-icons/ai';

export const paddingDividers = '30px';

const StyledBorderIcon = styled.div`
  width: ${paddingDividers};
  height: ${paddingDividers};
  padding: 5px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const BorderPLusIcon = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <AiOutlinePlus />
    </StyledBorderIcon>
  );
};

const WhiteLine = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.textColor};
  flex-grow: 1;
  flex-shrink: 100;
  margin: auto;
`;

const StyledMinusBorderIcon = styled.div`
  height: 1px;
  width: 12px;
  background-color: ${(props) => props.theme.textColor};
  flex-grow: 0;
  flex-shrink: 0;
  margin: 10px;
`;

const StyledContainer = styled.div`
  width: 100%;
  color: ${(props) => props.theme.textColor};
  height: 75px;
  display: flex;
  align-items: center;
`;

export const PlusDivider = (): JSX.Element => {
  return (
    <StyledContainer>
      <BorderPLusIcon />
      <WhiteLine />
      <BorderPLusIcon />
    </StyledContainer>
  );
};

export const MinusDivider = (): JSX.Element => {
  return (
    <StyledContainer>
      <StyledMinusBorderIcon />
      <WhiteLine />
      <StyledMinusBorderIcon />
    </StyledContainer>
  );
};
