import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import {
  VictoryChart,
  VictoryGroup,
  VictoryArea,
  VictoryAxis,
  VictoryLabel
} from 'victory';
import { makeRate, selectStatus } from '../../features/statusSlice';
import { PlusDivider } from './Dividers';
import {
  DownSpeedWithPillAndIcon,
  UpSpeedWithPillAndIcon
} from './LabelSubtleWithValue';

export type NumberQueue = Array<number>;
export type SpeedHistoryDataType = {
  upload: NumberQueue;
  download: NumberQueue;
  lastUploadUsage: number | null;
  lastDownloadUsage: number | null;
};

export const MAX_NUMBER_POINT_HISTORY = 60; // 1 minute as there is 2 points per sec currently

export const uploadColorChart = '#37EB19';
export const downloadColorChart = '#F33232';

export const SpeedChart = (): JSX.Element => {
  const daemonStatus = useSelector(selectStatus);
  const theme = useTheme();
  const uploadCoordinates = daemonStatus.speedHistory.upload.map((y, index) => {
    return {
      x: index,
      y
    };
  });

  const downloadCoordinates = daemonStatus.speedHistory.download.map(
    (y, index) => {
      return {
        x: index,
        y
      };
    }
  );

  return (
    <Flex flexDirection="column" height="100%">
      <PlusDivider />
      <Flex
        flexDirection="column"
        width="90%"
        alignItems="center"
        margin="0 auto"
        maxWidth="500px"
      >
        <VictoryChart
          animate={false}
          domainPadding={20}
          theme={{
            axis: {
              style: {
                axis: { stroke: theme.textColor },
                axisLabel: { stroke: theme.textColor },
                tickLabels: { fill: theme.textColor },
                grid: { stroke: 'none' }
              }
            }
          }}
          minDomain={{ x: 0, y: 1 }}
          width={500}
          height={300}
        >
          <VictoryAxis
            dependentAxis={true}
            tickLabelComponent={<VictoryLabel dx={-10} />}
            tickFormat={(t) => makeRate(t, true)}
            label="MB/s"
            axisLabelComponent={<VictoryLabel angle={0} dx={-20} />}
            fixLabelOverlap={true}
          />

          <VictoryAxis
            domain={[-60, 0]}
            padding={30}
            dependentAxis={false}
            tickLabelComponent={<VictoryLabel dy={10} />}
            tickFormat={(t) => {
              return t === 60 ? 'now' : t === 10 ? 'a minute ago' : '';
            }}
          />
          <VictoryGroup
            style={{
              data: { fillOpacity: 0 }
            }}
          >
            <VictoryArea
              style={{
                data: { stroke: downloadColorChart, fill: downloadColorChart }
              }}
              data={downloadCoordinates}
            />
            <VictoryArea
              style={{
                data: { stroke: uploadColorChart, fill: uploadColorChart }
              }}
              data={uploadCoordinates}
            />
          </VictoryGroup>
        </VictoryChart>
        <Flex
          direction="row"
          width="100%"
          alignSelf="center"
          padding="0 0 15px 0"
          justifyContent="space-evenly"
        >
          <UpSpeedWithPillAndIcon />
          <DownSpeedWithPillAndIcon />
        </Flex>
      </Flex>
    </Flex>
  );
};
