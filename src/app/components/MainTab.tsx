import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../features/statusSlice';
import { ExitPanel } from './ExitPanel';
import { GeneralInfos } from './GeneralInfos';
import { LokinetAddress } from './LokinetAddress';
import { RoutersStats } from './RouterStats';
import { SpeedStats } from './SpeedStats';
import { StopAndStart } from './StopAndStartButton';

export const MainTab = (): JSX.Element => {
  // Select (i.e. extract the daemon status from our global redux state)
  const daemonStatus = useSelector(selectStatus);
  return (
    <>
      <StopAndStart />
      <GeneralInfos />
      <LokinetAddress />
      <ExitPanel />
      <RoutersStats
        activePaths={daemonStatus.numPathsBuilt}
        ratio={daemonStatus.ratio}
        numRouters={daemonStatus.numRoutersKnown}
      />
      <SpeedStats />
    </>
  );
};
