import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import { AppTitle } from './AppTitle';
import { GeneralInfos } from './GeneralInfos';
import { GuiTabs } from './GuiTabs';
import { TitleBar } from './TitleBar';

export const AppLayout = (): JSX.Element => {
  return (
    <Flex width="100%" height="100%">
      <Stack
        padding="10px 10px 0 10px"
        textAlign="center"
        minWidth="400px"
        width="100%"
      >
        <TitleBar />
        <AppTitle />
        <GeneralInfos />

        <GuiTabs />
      </Stack>
    </Flex>
  );
};
