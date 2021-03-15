import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryArea,
  VictoryLegend,
  VictoryContainer
} from 'victory';
import { selectStatus } from '../../features/statusSlice';

export type NumberQueue = Array<number>;
export type SpeedHistoryDataType = {
  upload: NumberQueue;
  download: NumberQueue;
  lastUploadUsage?: number;
  lastDownloadUsage?: number;
};

export const MAX_NUMBER_POINT_HISTORY = 120; // 1 minute as there is 2 points per sec currently

export const SpeedChart = (): JSX.Element => {
  const uploadColor = 'red';
  const downloadColor = 'blue';
  const daemonStatus = useSelector(selectStatus);

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
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="left"
        marginLeft={10}
      >
        <VictoryChart
          animate={false}
          theme={VictoryTheme.material}
          containerComponent={<VictoryContainer responsive={false} />}
        >
          <VictoryGroup
            style={{
              data: { fillOpacity: 0 }
            }}
          >
            <VictoryArea
              style={{
                data: { stroke: downloadColor }
              }}
              data={downloadCoordinates}
            />
            <VictoryArea
              style={{
                data: { stroke: uploadColor }
              }}
              data={uploadCoordinates}
            />
          </VictoryGroup>
        </VictoryChart>

        <VictoryLegend
          orientation="vertical"
          width={200}
          height={50}
          containerComponent={<VictoryContainer responsive={false} />}
          data={[
            { name: 'Upload Speed (kb/s)', symbol: { fill: uploadColor } },
            { name: 'Download Speed (kb/s)', symbol: { fill: downloadColor } }
          ]}
        />
      </Flex>
    </Flex>
  );
};
