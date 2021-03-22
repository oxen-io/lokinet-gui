import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { AppLogs } from './AppLogs';
import { SpeedChart } from './SpeedChart';

export const GuiTabs = (): JSX.Element => {
  return (
    <Tabs
      maxHeight="100vh"
      width="70vw"
      variant="soft-rounded"
      colorScheme="green"
      padding={3}
    >
      <TabList>
        <Tab>Chart</Tab>
        <Tab>Logs</Tab>
      </TabList>
      <TabPanels maxHeight="100%">
        <TabPanel maxHeight="100%">
          <SpeedChart />
        </TabPanel>
        <TabPanel maxHeight="100%">
          <AppLogs />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
