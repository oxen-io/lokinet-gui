import React from 'react';
import { LabelSubtleWithValue } from './LabelSubtleWithValue';
import { StatsHeading, StatsSection } from './CommonStats';

const RoutersStatsInner = ({
  numRouters,
  activePaths,
  ratio
}: {
  numRouters: number;
  activePaths: number;
  ratio: string;
}): JSX.Element => (
  <StatsSection>
    <StatsHeading title="ROUTERS" />
    <LabelSubtleWithValue
      label="Total count"
      value={`${numRouters || ''}`}
      center={false}
    />
    <LabelSubtleWithValue
      label="Active paths"
      value={`${activePaths || ''}`}
      center={false}
    />
    <LabelSubtleWithValue
      label="Success"
      value={`${ratio || ''}`}
      center={false}
    />
  </StatsSection>
);

export const RoutersStats = React.memo(RoutersStatsInner);
