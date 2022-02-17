import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../features/statusSlice';
import { MinusDivider, PlusDivider } from './Dividers';
import { ExitPanel } from './ExitPanel';
import { RoutersStats } from './RouterStats';
import { SpeedStats } from './SpeedStats';
// import { StopAndStart } from './StopAndStartButton';

export const MainTab = (): JSX.Element => {
  // Select (i.e. extract the daemon status from our global redux state)
  const daemonStatus = useSelector(selectStatus);
  return (
    <>
      {/* <StopAndStart /> */}
      <PlusDivider />

      <ExitPanel />
      <MinusDivider />

      <Flex flexDirection="row" justifyContent="space-around">
        <RoutersStats
          activePaths={daemonStatus.numPathsBuilt}
          ratio={daemonStatus.ratio}
          numRouters={daemonStatus.numRoutersKnown}
        />
        <SpeedStats />
      </Flex>
    </>
  );
};
