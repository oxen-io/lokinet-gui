import React from 'react';

import { StatsHeading, StatsSection } from './CommonStats';
import { DownSpeedWithIcon, UpSpeedWithIcon } from './LabelSubtleWithValue';

const SpeedStatsInner = (): JSX.Element => {
  return (
    <StatsSection>
      <StatsHeading title="SPEEDS" />
      <UpSpeedWithIcon />
      <DownSpeedWithIcon />
    </StatsSection>
  );
};

export const SpeedStats = React.memo(SpeedStatsInner);
