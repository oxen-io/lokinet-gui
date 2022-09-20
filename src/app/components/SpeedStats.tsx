import React from 'react';

import { StatsHeading, StatsSection } from './CommonStats';
import { DownSpeedWithIcon, UpSpeedWithIcon } from './LabelSubtleWithValue';

export const SpeedStats = (): JSX.Element => {
  return (
    <StatsSection>
      <StatsHeading title="SPEEDS" />
      <UpSpeedWithIcon />
      <DownSpeedWithIcon />
    </StatsSection>
  );
};
