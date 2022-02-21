import React from 'react';
import styled from 'styled-components';

export const PowerButtonSpinner = (): JSX.Element => {
  return <StyledSpinner>{svgLoadingSpinner}</StyledSpinner>;
};

const StyledSpinner = styled.div`
  width: 100%;
  height: 100%;
  animation-name: rotating-spinner;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  cursor: auto;

  svg {
    width: 100%;
    height: 100%;
  }

  @keyframes rotating-spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const svgLoadingSpinner = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 177 177"
    fill="currentColor"
  >
    <g>
      <path d="M173.5,105.3c-8.5,38.5-43,67.3-84,67.3c-47.5,0-86.1-38.6-86.1-86c0-43.4,32.4-79.4,74.3-85.1C34.2,7.3,0.5,41.7,0.5,86.6   c0,49,39.9,88.9,89,88.9c42.7,0,78.4-30.2,87-70.2H173.5z" />
    </g>
  </svg>
);
