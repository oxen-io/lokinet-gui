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

const StyledIconButton = styled.button`
  font-size: 1.4rem;
  color: ${(props) => props.theme.textColor};
  border: none;
  cursor: pointer;
  background: none;
  -webkit-app-region: no-drag;

  transition: 0.25s;
  :hover {
    color: ${(props) => props.theme.textColorSubtle};
  }
`;

export const TitleBar = (): JSX.Element => {
  const themeSelected = useSelector(selectedTheme);
  const dispatch = useDispatch();
  return (
    <Container>
      <StyledIconButton
        title="Switch theme dark/white"
        onClick={() => {
          dispatch(setTheme(themeSelected === 'light' ? 'dark' : 'light'));
        }}
        style={{ marginRight: 'auto' }}
      >
        <HiMoon />
      </StyledIconButton>

      <StyledIconButton
        title="Switch theme dark/white"
        onClick={() => {
          ipcRenderer.send(MINIMIZE_TO_TRAY);
        }}
      >
        <RiCloseFill />
      </StyledIconButton>
    </Container>
  );
};
