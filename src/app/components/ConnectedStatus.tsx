import React from 'react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import { selectedTheme } from '../../features/uiStatusSlice';
import {
  isGlobalStatusError,
  useGlobalConnectingStatus
} from '../hooks/connectingStatus';

const ConnectedStatusContainer = styled.div`
  height: 40px;
  display: flex;
  line-height: 25px;
  margin-top: 0;

  justify-content: center;
  align-items: center;
`;

const ConnectedStatusContainerWithLogo = styled(ConnectedStatusContainer)`
  display: block;
  margin-top: 0 !important;
  height: 40px;
`;

const ConnectedStatusTitle = styled.span<{ textShadow: string }>`
  font-family: Archivo;
  font-style: normal;
  font-weight: bold;
  font-size: 1.4rem;
  text-align: center;
  text-shadow: ${(props) => props.textShadow};
`;

const ConnectedStatusLED = styled.span<{ ledColor: string }>`
  width: 1rem;
  height: 1em;
  border-radius: 50%;
  margin-left: 1rem;
  background-color: ${(props) => props.ledColor};
`;

const StyledLogoAndTitle = styled.svg`
  height: 100%;
  margin-bottom: 0;
  fill: ${(props) => props.theme.textColor};
`;

export const ConnectedStatus = (): JSX.Element => {
  const globalStatus = useGlobalConnectingStatus();
  const themeType = useSelector(selectedTheme);

  const theme = useTheme();

  let ledColor = '';
  let textShadow = '';
  let statusText = '';

  if (isGlobalStatusError(globalStatus)) {
    statusText =
      globalStatus === 'error-start-stop'
        ? 'FAILED TO START LOKINET'
        : 'UNABLE TO CONNECT';
    ledColor = theme.dangerColor;
  }

  switch (globalStatus) {
    case 'daemon-connecting':
      textShadow = '';
      statusText = 'DAEMON CONNECTING';
      ledColor = theme.connectedColor;
      break;
    case 'daemon-connected':
      textShadow = '';
      statusText = 'DAEMON CONNECTED';
      ledColor = theme.connectedColor;
      break;
    case 'exit-connecting':
      textShadow = '';
      statusText = 'EXIT CONNECTING';
      ledColor = theme.connectedColor;
      break;
    case 'exit-connected':
      textShadow = themeType == 'light' ? '' : '0px 0px 3px #FFFFFF';
      statusText = 'EXITG CONNECTED';
      ledColor = theme.connectedColor;
      break;

    default: {
      if (!globalStatus.startsWith('error')) {
        throw new Error('Missing case error');
      }
    }
  }

  if (globalStatus !== 'default') {
    return (
      <ConnectedStatusContainer>
        <ConnectedStatusTitle textShadow={textShadow}>
          \ {statusText}
        </ConnectedStatusTitle>
        <ConnectedStatusLED ledColor={ledColor} />
      </ConnectedStatusContainer>
    );
  }
  return (
    <ConnectedStatusContainerWithLogo>
      <StyledLogoAndTitle
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 243.8 50.5"
      >
        <path d="M15 10.1C18.6 6.6 21.9 3.3 25.2 0c3.3 3.3 6.6 6.7 10.1 10.2-1.6 1.5-3.3 3.1-4.9 4.6l5.2 5.2c1.5-1.6 3.1-3.3 4.6-4.9l10.3 10.3c-3.2 3.2-6.6 6.6-10.1 10-1.5-1.6-3.1-3.3-4.7-5l-5.1 5.1 4.8 4.8c-3.6 3.5-7 6.9-10.3 10.2-3.1-3.2-6.5-6.6-9.9-10 1.5-1.4 3.3-3.1 5-4.7l-5.3-5.3c-1.6 1.7-3.2 3.4-4.7 5C6.7 32 3.3 28.6 0 25.2c3.2-3.2 6.6-6.5 10.1-10 1.4 1.6 3 3.3 4.5 5 2-1.9 3.6-3.6 5.5-5.4-1.7-1.5-3.4-3.1-5.1-4.7zm10.4 10.4c-1.7 1.6-3.3 3.3-4.9 4.8 1.6 1.6 3.2 3.2 4.7 4.8 1.7-1.6 3.3-3.2 5-4.9-1.7-1.6-3.3-3.2-4.8-4.7zm4.7-5.4c-1.7-1.6-3.3-3.3-4.9-4.8-1.6 1.6-3.3 3.2-4.7 4.7 1.5 1.6 3.1 3.3 4.6 4.9 1.8-1.6 3.4-3.2 5-4.8zm-15 5.4c-1.6 1.6-3.2 3.3-4.7 4.7 1.5 1.6 3.1 3.3 4.6 4.9l4.9-4.9c-1.6-1.5-3.3-3.1-4.8-4.7zm20.4.1c-1.5 1.5-3.2 3.1-4.8 4.6 1.6 1.7 3.3 3.3 4.7 4.8 1.6-1.6 3.2-3.2 4.9-4.8-1.6-1.5-3.3-3.1-4.8-4.6zM20.6 35.3c1.5 1.6 3.2 3.4 4.7 5l4.8-4.8c-1.6-1.6-3.3-3.3-4.8-4.9l-4.7 4.7zm148.2 5.1h-7.5V9.7c1.7 0 3.3-.1 5 0 .4 0 .8.5 1.1.8 4 5.2 7.9 10.3 11.9 15.5.2.3.4.5.8 1V9.7h7.5v30.6c-1.7 0-3.4.1-5.1-.1-.4 0-.8-.7-1.2-1.1-3.9-5-7.8-10.1-11.7-15.1-.2-.2-.4-.4-.7-.9-.1 6.1-.1 11.6-.1 17.3zM113.7 25c0 9-6.7 15.8-15.5 15.8S82.7 34 82.7 25c0-8.9 6.7-15.7 15.5-15.7 8.9-.1 15.5 6.6 15.5 15.7zm-23.4-.2c.1.8.1 1.4.1 2 .5 3.1 1.9 5.5 4.9 6.5 3 1 6 .7 8.4-1.6 2.6-2.6 2.9-5.9 2.2-9.3-.8-3.9-3.7-6.2-7.7-6.2s-6.8 2.3-7.6 6.3c-.2.8-.2 1.6-.3 2.3zm35.1 2.1v13.5H118V9.9h7.3v12.9c.1 0 .2.1.3.1 1.6-2 3.1-4 4.7-6 1.6-2.1 3.3-4.2 4.9-6.3.3-.3.7-.7 1.1-.7 2.7-.1 5.3 0 8.4 0-4.2 5.1-8.3 10-12.4 15 4 5.1 8.1 10.3 12.3 15.7h-2.4c-1.7 0-3.4-.1-5.2 0-1.1.1-1.7-.4-2.3-1.2-2.8-3.9-5.7-7.7-8.6-11.5-.1-.4-.3-.6-.7-1zm74.9 7.6h13.4v5.9h-20.9V9.9h20.9v5.8h-13.4v6.4h12.1v5.6h-12.1v6.8zm26.8-18.8h-9.2V9.8h25.8v5.8h-9.2v24.7H227c.1-8.1.1-16.3.1-24.6zM68.4 33.8h12.7v6.6H61V9.8h7.4v24zm87.7 6.6h-7.3V9.8h7.3v30.6z"></path>
      </StyledLogoAndTitle>
    </ConnectedStatusContainerWithLogo>
  );
};
