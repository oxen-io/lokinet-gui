import React from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { HiMoon } from 'react-icons/hi';
import styled from 'styled-components';

import { ipcRenderer } from 'electron';
import { MINIMIZE_TO_TRAY } from '../../../sharedIpc';
import { selectedTheme, setTheme } from '../../features/uiStatusSlice';
import { useDispatch, useSelector } from 'react-redux';

const Container = styled.div`
  background: ${(props) => props.theme.backgroundColor};

  position: sticky;
  top: 0;
  overflow-y: auto;
  display: flex;
  font-size: 2rem;
  -webkit-app-region: drag;
  padding: 0.2rem 1rem;
`;

const StyledIconButton = styled.button`
  font-size: 2rem;
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
