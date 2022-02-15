/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGlobalStyle } from 'styled-components';
import { ThemeType } from './theme';

const fontArchivo = 'Archivo';
const fontIbmPlexMono = 'IBM Plex Mono';

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  body {
    background-color:  ${({ theme }) => theme.backgroundColor};
    color:  ${({ theme }) => theme.textColor};
    height: 100%;
    width: 100vw;
    font-family: "IBM Plex Mono";
  }

  html {
    height: 100%;
  }

  ::selection {
    background: lightGrey;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  @font-face {
    font-family: ${fontArchivo};
    font-style: normal;
    font-weight: 400;
    src: url('/fonts/Archivo-Regular.ttf') format('ttf');
  }
  @font-face {
    font-family: ${fontArchivo};
    font-style: normal;
    font-weight: 500;
    src: url('/fonts/Archivo-Medium.ttf') format('ttf');
  }
  @font-face {
    font-family: ${fontArchivo};
    font-style: normal;
    font-weight: 700;
    src: url('/fonts/Archivo-Bold.ttf') format('ttf');
  }
  @font-face {
    font-family: ${fontIbmPlexMono};
    font-style: normal;
    font-weight: 400;
    src: url('/fonts/IBMPlexMono.ttf') format('ttf');
  }
`;
