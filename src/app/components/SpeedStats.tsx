import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../features/statusSlice';
import { StatsHeading, StatsSection } from './CommonStats';
import { LabelSubtleWithValue } from './LabelSubtleWithValue';

function makeRate(value: number): string {
  let unit_idx = 0;
  const units = ['B', 'KB', 'MB'];
  while (value > 1024.0 && unit_idx + 1 < units.length) {
    value /= 1024.0;
    unit_idx += 1;
  }
  const unitSpeed = ` ${units[unit_idx]}/s`;
  return (
    (value < 10
      ? Math.round(value * 100) / 100
      : value < 100
      ? Math.round(value * 10) / 10
      : Math.round(value)) + unitSpeed
  );
}

export const SpeedStats = (): JSX.Element => {
  const daemonStatus = useSelector(selectStatus);
  const upSpeed = makeRate(daemonStatus.uploadUsage);
  const downSpeed = makeRate(daemonStatus.downloadUsage);

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
      {/*             <Icon margin="5px" as={FiDownloadCloud} />
                  <Icon margin="5px" as={FiUploadCloud} />

       */}
    </StatsSection>
  );
};
