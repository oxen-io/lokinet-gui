/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import ReactDom from 'react-dom';

import {
  IconButton,
  Heading,
  ChakraProvider,
  Switch,
  Center,
  StatLabel,
  Stat,
  StatNumber,
  StatHelpText,
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  Stack,
  useInterval
} from '@chakra-ui/react';

import { VictoryArea, VictoryGroup, VictoryChart, VictoryTheme } from 'victory';

import { MdPowerSettingsNew } from 'react-icons/md';

import { FiUploadCloud, FiDownloadCloud } from 'react-icons/fi';

import { getStatus, initializeIpcRendererSide } from '../ipc/ipc_renderer';
import _ from 'lodash';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

initializeIpcRendererSide();

const EnableExitToggle = () => {
  return <Switch colorScheme="whiteAlpha" size="lg" margin="auto" />;
};

const StopAndStart = () => {
  const [clicked, setClicked] = useState(false);
  return (
    <IconButton
      margin="auto"
      isRound
      isLoading={clicked}
      onClick={() => {
        setClicked(true);
        getStatus().then(console.warn);
      }}
      size="lg"
      icon={<MdPowerSettingsNew />}
      aria-label="stop and start"
    />
  );
};

const StatsBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    maxW="sm"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    shadow="xs"
  >
    {children}
  </Box>
);

const ActivePathStats = () => (
  <StatsBox>
    <Stat padding="5px">
      <StatLabel>Active Paths</StatLabel>
      <StatNumber>3</StatNumber>
      <StatHelpText>(50% success)</StatHelpText>
    </Stat>
  </StatsBox>
);

const LokinetRoutersStats = () => (
  <StatsBox>
    <Stat padding="5px">
      <StatLabel>Lokinet Routers</StatLabel>
      <StatNumber>1294</StatNumber>
    </Stat>
  </StatsBox>
);

const UpSpeedStats = () => (
  <Box>
    <HStack>
      <Icon margin="5px" as={FiUploadCloud} />
      <Text>7.44 KB/s</Text>
    </HStack>
  </Box>
);

const DownSpeedStats = () => (
  <Box>
    <HStack>
      <Icon margin="5px" as={FiDownloadCloud} />
      <Text>5.33 KB/s</Text>
    </HStack>
  </Box>
);

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

const SpeedChart = () => {
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

const App = () => {
  return (
    <ChakraProvider resetCSS={true}>
      <Center height="100vh">
        <Stack padding="20px">
          <Heading size="4xl">Lokinet</Heading>
          <Flex>
            <StopAndStart />
          </Flex>
          <Flex>
            <EnableExitToggle />
          </Flex>
          <ActivePathStats />
          <LokinetRoutersStats />
          <HStack justify="space-between">
            <UpSpeedStats />
            <DownSpeedStats />
          </HStack>
          <SpeedChart />
        </Stack>
      </Center>
    </ChakraProvider>
  );
};

ReactDom.render(<App />, mainElement);
