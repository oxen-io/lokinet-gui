import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { PlusDivider, MinusDivider, paddingDividers } from '../Utils/Dividers';
import { ExitPanel } from '../Exit/ExitPanel';
import { RoutersStats } from '../RouterStats';
import { SpeedStats } from '../SpeedStats';
import {
  selectNumPathBuilt,
  selectNumRoutersKnown,
  selectRatio
} from '../../../features/statusSlice';

export const MainTab = (): JSX.Element => {
  const numPathsBuilt = useSelector(selectNumPathBuilt);
  const ratio = useSelector(selectRatio);
  const numRoutersKnown = useSelector(selectNumRoutersKnown);

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
          activePaths={numPathsBuilt}
          ratio={ratio}
          numRouters={numRoutersKnown}
        />
        <SpeedStats />
      </Flex>
    </>
  );
};
