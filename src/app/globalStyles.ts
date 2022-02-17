/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const GlobalStyle = createGlobalStyle<{ theme: DefaultTheme }>`
  body {
    background-color:  ${({ theme }) => theme.backgroundColor};
    color:  ${({ theme }) => theme.textColor};
    height: 100%;
    width: 100vw;
    font-family: "IBM Plex Mono";
    font-weight: 400;

    transition: 0.5s;
  }

  html {
    height: 100%;
  }

  ::selection {
    background: lightGrey;
  }

  #root {
    height: 100%;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  @font-face {
    font-family: Archivo;
    font-style: normal;
    font-weight: 400;
    src: url('../fonts/Archivo-Regular.ttf') format('truetype');
  }
  @font-face {
    font-family: Archivo;
    font-style: normal;
    font-weight: 500;
    src: url('../fonts/Archivo-Medium.ttf') format('truetype');
  }
  @font-face {
    font-family: Archivo;
    font-style: normal;
    font-weight: 700;
    src: url('../fonts/Archivo-Bold.ttf') format('truetype');
  }
  @font-face {
    font-family: "IBM Plex Mono";
    font-style: normal;
    font-weight: 400;
    src: url('../fonts/IBMPlexMono-Medium.ttf') format('truetype');
  }
`;
