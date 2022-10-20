import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    backgroundColor: string;
    textColor: string;
    textColorSubtle: string;
    inputBackground: string;
    inputTextColor: string;
    dangerColor: string;
    connectingColor: string;
    connectedLokinetColor: string;
    connectedVpnModeColor: string;
  }
}
