import { Flex, theme } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import {
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryArea,
  VictoryLegend,
  VictoryContainer
} from 'victory';
import { selectStatus } from '../../features/statusSlice';
import { PlusDivider } from './Dividers';

export type NumberQueue = Array<number>;
export type SpeedHistoryDataType = {
  upload: NumberQueue;
  download: NumberQueue;
  lastUploadUsage: number | null;
  lastDownloadUsage: number | null;
};

export const MAX_NUMBER_POINT_HISTORY = 60; // 1 minute as there is 2 points per sec currently

export const SpeedChart = (): JSX.Element => {
  const uploadColor = '#37EB19';
  const downloadColor = '#F33232';
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
        margin="auto"
      >
        <VictoryChart
          animate={false}
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
        >
          <VictoryGroup
            style={{
              data: { fillOpacity: 0 }
            }}
          >
            <VictoryArea
              style={{
                data: { stroke: downloadColor, fill: downloadColor }
              }}
              data={downloadCoordinates}
            />
            <VictoryArea
              style={{
                data: { stroke: uploadColor, fill: uploadColor }
              }}
              data={uploadCoordinates}
            />
          </VictoryGroup>
        </VictoryChart>

        <VictoryLegend
          orientation="horizontal"
          height={60}
          style={{ labels: { fill: theme.textColor } }}
          // containerComponent={<VictoryContainer responsive={false} />}
          data={[
            { name: 'Upload (kb/s)', symbol: { fill: uploadColor } },
            { name: 'Download (kb/s)', symbol: { fill: downloadColor } }
          ]}
        />
      </Flex>
    </Flex>
  );
};
