import React from 'react';
import { VictoryChart, VictoryTheme, VictoryGroup, VictoryArea } from 'victory';

export type SpeedHistoryCoordinates = { x: number; y: number };
type SpeedHistoryRowDataType = Array<SpeedHistoryCoordinates>;
export type SpeedHistoryDataType = Array<SpeedHistoryRowDataType>;

export const SpeedChart = ({
  speedHistory
}: {
  speedHistory: SpeedHistoryDataType;
}): JSX.Element => {
  return (
    <VictoryChart animate={false} height={200} theme={VictoryTheme.material}>
      <VictoryGroup
        colorScale="grayscale"
        style={{
          data: { fillOpacity: 0.5 }
        }}
      >
        {speedHistory.map((data, i) => {
          return <VictoryArea key={i} data={data} interpolation="basis" />;
        })}
      </VictoryGroup>
    </VictoryChart>
  );
};
