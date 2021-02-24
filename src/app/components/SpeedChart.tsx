import { Flex } from '@chakra-ui/react';
import React from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryGroup,
  VictoryArea,
  VictoryLegend
} from 'victory';

export type SpeedHistoryCoordinates = { x: number; y: number };
type SpeedHistoryRowDataType = Array<SpeedHistoryCoordinates>;
export type SpeedHistoryDataType = {
  upload: SpeedHistoryRowDataType;
  download: SpeedHistoryRowDataType;
};

export const MAX_NUMBER_POINT_HISTORY = 120; // 1 minute as there is 2 points per sec currently

export const SpeedChart = ({
  speedHistory
}: {
  speedHistory: SpeedHistoryDataType;
}): JSX.Element => {
  const uploadColor = 'red';
  const downloadColor = 'blue';
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
            data={speedHistory.download}
          />
          <VictoryArea
            style={{
              data: { stroke: uploadColor }
            }}
            data={speedHistory.upload}
          />
        </VictoryGroup>
      </VictoryChart>
      <VictoryLegend
        orientation="vertical"
        width={200}
        data={[
          { name: 'Upload Speed', symbol: { fill: uploadColor } },
          { name: 'Download Speed', symbol: { fill: downloadColor } }
        ]}
      />
    </Flex>
  );
};
