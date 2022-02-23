import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectUploadRate,
  selectDownloadRate
} from '../../features/statusSlice';
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
