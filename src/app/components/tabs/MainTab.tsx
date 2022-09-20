import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../../features/statusSlice';
import { PlusDivider, MinusDivider, paddingDividers } from '../Utils/Dividers';
import { ExitPanel } from '../ExitPanel';
import { RoutersStats } from '../RouterStats';
import { SpeedStats } from '../SpeedStats';

export const MainTab = (): JSX.Element => {
  // Select (i.e. extract the daemon status from our global redux state)
  const daemonStatus = useSelector(selectStatus);
  return (
    <>
      <PlusDivider />

      <ExitPanel />
      <MinusDivider />

      <Flex
        flexDirection="row"
        justifyContent="space-between"
        paddingLeft={paddingDividers}
        paddingRight={paddingDividers}
        minWidth="300px"
      >
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
