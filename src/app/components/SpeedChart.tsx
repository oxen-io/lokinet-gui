import { Flex } from '@chakra-ui/react';
import React from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryArea,
  VictoryLegend
} from 'victory';

export type NumberQueue = Array<number>;
export type SpeedHistoryDataType = {
  upload: NumberQueue;
  download: NumberQueue;
  lastUploadUsage?: number;
  lastDownloadUsage?: number;
};

export const MAX_NUMBER_POINT_HISTORY = 120; // 1 minute as there is 2 points per sec currently

export const SpeedChart = ({
  speedHistory
}: {
  speedHistory: SpeedHistoryDataType;
}): JSX.Element => {
  const uploadColor = 'red';
  const downloadColor = 'blue';

  const uploadCoordinates = speedHistory.upload.map((y, index) => {
    return {
      x: index,
      y
    };
  });

  const downloadCoordinates = speedHistory.download.map((y, index) => {
    return {
      x: index,
      y
    };
  });

  return (
    <Flex flexDirection="column">
      <VictoryChart animate={false} height={200} theme={VictoryTheme.material}>
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
        data={[
          { name: 'Upload Speed (kb/s)', symbol: { fill: uploadColor } },
          { name: 'Download Speed (kb/s)', symbol: { fill: downloadColor } }
        ]}
      />
    </Flex>
  );
};
