import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../features/statusSlice';
import { AppTitle } from './AppTitle';
import { ExitPanel } from './ExitPanel';
import { GeneralInfos } from './GeneralInfos';
import { GuiTabs } from './GuiTabs';
import { LokinetAddress } from './LokinetAdress';
import { RoutersStats } from './RouterStats';
import { SpeedStats } from './SpeedStats';
import { StopAndStart } from './StopAndStartButton';

export const AppLayout = (): JSX.Element => {
  // Select (i.e. extract the daemon status from our global redux state)
  const daemonStatus = useSelector(selectStatus);
  return (
    <Flex width="100%" height="100%">
      <Stack padding="20px" textAlign="center" width="400px">
        <AppTitle />
        <GeneralInfos />
        <LokinetAddress />
        <StopAndStart />
        <Flex>
          <ExitPanel />
        </Flex>
        <RoutersStats
          activePaths={daemonStatus.numPathsBuilt}
          ratio={daemonStatus.ratio}
          numRouters={daemonStatus.numRoutersKnown}
        />
        <SpeedStats />
      </Stack>
      <GuiTabs />
    </Flex>
  );
};
