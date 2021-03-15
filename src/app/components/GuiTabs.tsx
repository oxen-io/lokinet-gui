import {
  Code,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import React from 'react';
import { SpeedChart } from './SpeedChart';

export const GuiTabs = (): JSX.Element => {
  return (
    <Tabs flex="1" variant="soft-rounded" padding={3}>
      <TabList>
        <Tab>Chart</Tab>
        <Tab>Logs</Tab>
      </TabList>
      <TabPanels>
        <TabPanel height="100%">
          <SpeedChart />
        </TabPanel>
        <TabPanel>
          <Stack direction="row">
            <Code children="console.log(welcome)" />
          </Stack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
