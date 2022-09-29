import { Stack } from '@chakra-ui/react';
import React from 'react';
import styled from 'styled-components';
import { ConnectedStatus } from './ConnectedStatus';
import { GeneralInfos } from './GeneralInfos';
import { GuiTabs } from './tabs/GuiTabs';
import { PowerButton } from './PowerButton/PowerButton';
import { TitleBar } from './TitleBar';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const AppLayout = (): JSX.Element => {
  return (
    <Container>
      <TitleBar />
      <Stack
        padding="0px 10px 0 10px"
        textAlign="center"
        width="100%"
        height="0px"
        flexGrow={1}
      >
        <ConnectedStatus />
        <PowerButton />
        <GeneralInfos />

        <GuiTabs />
      </Stack>
    </Container>
  );
};
