import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectUploadRate,
  selectDownloadRate
} from '../../features/statusSlice';
import { StatsHeading, StatsSection } from './CommonStats';
import { LabelSubtleWithValue } from './LabelSubtleWithValue';

export const SpeedStats = (): JSX.Element => {
  const upSpeed = useSelector(selectUploadRate);
  const downSpeed = useSelector(selectDownloadRate);

  return (
    <StatsSection>
      <StatsHeading title="SPEEDS" />
      <LabelSubtleWithValue
        label="Upload"
        value={`${upSpeed}`}
        center={false}
      />
      <LabelSubtleWithValue
        label="Download"
        value={`${downSpeed}`}
        center={false}
      />
    </StatsSection>
  );
};
