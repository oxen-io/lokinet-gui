import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectDaemonOrExitIsLoading } from '../../../features/statusSlice';
import { usePowerButtonColor } from './PowerButtonIcon';

export const PowerButtonContainerBorder = ({
  isHovered,
  children
}: {
  children: React.ReactNode;
  isHovered: boolean;
}): JSX.Element => {
  const borderColor = usePowerButtonColor(isHovered);
  const loading = useSelector(selectDaemonOrExitIsLoading);

  if (loading) {
    // display the spinner only when starting lokinet daemon or connecting to an exit
    return (
      <>
        {children}
        <PowerButtonSpinner />
      </>
    );
  }

  return (
    <StyledBorderContainer borderColor={borderColor}>
      {children}
    </StyledBorderContainer>
  );
};

const StyledBorderContainer = styled.div<{
  borderColor: string;
}>`
  width: 100%;
  height: 100%;
  transition: 0.25s;

  border: 2px solid ${(props) => props.borderColor};
  border-radius: 50%;
`;

const PowerButtonSpinner = (): JSX.Element => {
  return <StyledSpinner>{svgLoadingSpinner}</StyledSpinner>;
};

const StyledSpinner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  top: -50%;
  left: 0%;
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
    width="178"
    height="177"
    viewBox="0 0 178 177"
    fill="none"
  >
    <path
      d="M88.62 173.167C65.9203 173.141 44.1579 164.112 28.1068 148.061C12.0557 132.01 3.02647 110.247 3 87.5474C3 40.3274 45.69 -0.452586 88.62 0.0874143C46.35 -2.14259 0 38.5974 0 87.5474C0 111.051 9.3367 133.592 25.9562 150.211C42.5757 166.831 65.1165 176.167 88.62 176.167C112.123 176.167 134.664 166.831 151.284 150.211C167.903 133.592 177.24 111.051 177.24 87.5474H174.24C174.214 110.247 165.184 132.01 149.133 148.061C133.082 164.112 111.32 173.141 88.62 173.167Z"
      fill="currentColor"
    />
  </svg>
);
