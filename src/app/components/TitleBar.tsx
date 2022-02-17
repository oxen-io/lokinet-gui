import { IconButton, theme } from '@chakra-ui/react';
import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { HiMoon } from 'react-icons/hi';
import styled, { useTheme } from 'styled-components';

import { ipcRenderer } from 'electron';
import { MINIMIZE_TO_TRAY } from '../../../sharedIpc';
import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import { useDispatch, useSelector } from 'react-redux';

const Container = styled.div`
  display: flex;
  font-size: 1.4rem;
  -webkit-app-region: drag;
  padding-inline-start: 0.6rem;
  padding-inline-end: 0.6rem;
`;

const StyledIconButton = styled(IconButton)`
  font-size: 1.4rem;
  color: ${(props) => props.theme.textColor};
  border: none;
  cursor: pointer;
  background: none;
  -webkit-app-region: no-drag;
`;

export const TitleBar = (): JSX.Element => {
  const theme = useTheme();
  const themeSelected = useSelector(selectedTheme);
  const dispatch = useDispatch();
  return (
    <Container>
      <StyledIconButton
        variant="unstyled"
        aria-label="Copy"
        marginRight="auto"
        icon={<HiMoon />}
        onClick={() => {
          dispatch(setTheme(themeSelected === 'light' ? 'dark' : 'light'));
        }}
      />
      <StyledIconButton
        variant="unstyled"
        aria-label="Copy"
        color={theme.textColor}
        border="none"
        cursor="pointer"
        fontSize={'1.4rem'}
        background="none"
        icon={<RiCloseFill />}
        onClick={() => {
          ipcRenderer.send(MINIMIZE_TO_TRAY);
        }}
      />
    </Container>
  );
};
