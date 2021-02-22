import React, { useState } from 'react';
import _ from 'lodash';

import { useInterval } from '@chakra-ui/react';
import { VictoryChart, VictoryTheme, VictoryGroup, VictoryArea } from 'victory';

function getData(): Array<Array<{ x: number; y: number }>> {
  return _.range(2).map(() => {
    return [
      { x: 1, y: _.random(1, 5) },
      { x: 2, y: _.random(1, 10) },
      { x: 3, y: _.random(2, 10) },
      { x: 4, y: _.random(2, 10) },
      { x: 5, y: _.random(2, 15) }
    ];
  });
}

export const SpeedChart = (): JSX.Element => {
  const [data, setData] = useState([[]]);

  useInterval(() => {
    setData(getData() as any);
  }, 4000);

  return (
    <VictoryChart
      animate={{
        duration: 400
      }}
      height={200}
      theme={VictoryTheme.material}
    >
      <VictoryGroup
        colorScale="grayscale"
        style={{
          data: { fillOpacity: 0.4 }
        }}
      >
        {data.map((data, i) => {
          return <VictoryArea key={i} data={data} interpolation="basis" />;
        })}
      </VictoryGroup>
    </VictoryChart>
  );
};
