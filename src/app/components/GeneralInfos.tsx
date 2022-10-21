import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectDaemonRunning,
  selectLokinetAddress,
  selectUptime,
  selectVersion
} from '../../features/statusSlice';
import { LabelSubtleWithValue } from './LabelSubtleWithValue';
import styled from 'styled-components';

const formatUptimeItem = (
  value: number,
  singular: string,
  plural: string
): string => {
  if (value <= 0) {
    return '';
  }

  if (value > 1) {
    return `${value} ${plural}`;
  }

  return `${value} ${singular}`;
};

const formatUptime = (uptimeInMs: number) => {
  if (!uptimeInMs || uptimeInMs <= 0) {
    return '';
  }
  const seconds = uptimeInMs / 1000;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = formatUptimeItem(d, ' day, ', ' days, ');
  d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = formatUptimeItem(h, ' hour, ', 'hours, ');
  h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = formatUptimeItem(m, ' min, ', ' mins, ');
  m > 0 ? m + (m === 1 ? ' min, ' : ' mins, ') : '';
  const sDisplay = formatUptimeItem(s, ' sec', ' secs');
  s > 0 ? s + (s === 1 ? ' sec' : ' secs') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

const GeneralInfosContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin: auto !important;
`;

export const GeneralInfos = (): JSX.Element => {
  const uptime = useSelector(selectUptime);
  const daemonIsRunning = useSelector(selectDaemonRunning);
  const version = useSelector(selectVersion);
  const lokinetAddress = useSelector(selectLokinetAddress);

  const formattedUptime = daemonIsRunning ? formatUptime(uptime) : '';
  return (
    <GeneralInfosContainer>
      <LabelSubtleWithValue label="Uptime" value={formattedUptime} />
      <LabelSubtleWithValue
        label="Version"
        value={version}
        showCopyToClipBoard={true}
      />
      <LabelSubtleWithValue
        label="Lokinet address"
        value={lokinetAddress}
        showCopyToClipBoard={true}
      />
    </GeneralInfosContainer>
  );
};
