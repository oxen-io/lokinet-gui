import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import { AppTitle } from './AppTitle';
import { GuiTabs } from './GuiTabs';

export const AppLayout = (): JSX.Element => {
  return (
    <Flex width="100%" height="100%">
      <Stack padding="10px" textAlign="center" minWidth="400px">
        <AppTitle />
        <GuiTabs />
      </Stack>
    </Flex>
  );
};
