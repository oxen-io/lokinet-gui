import React from 'react';
import styled from 'styled-components';
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

const StyledSvgPlusIcon = styled.svg`
  padding: 4px;
`;

const BorderPLusIcon = (): JSX.Element => {
  return (
    <StyledBorderIcon>
      <StyledSvgPlusIcon
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.45834 16V0H9.45834V16H8.45834Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.921997 7.50262H17V8.50262H0.921997V7.50262Z"
          fill="currentColor"
        />
      </StyledSvgPlusIcon>
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
