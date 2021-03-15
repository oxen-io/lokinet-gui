import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { AppLogs } from './AppLogs';
import { SpeedChart } from './SpeedChart';

export const GuiTabs = (): JSX.Element => {
  return (
    <Tabs maxHeight="100vh" variant="soft-rounded" padding={3}>
      <TabList>
        <Tab>Chart</Tab>
        <Tab>Logs</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SpeedChart />
        </TabPanel>
        <TabPanel>
          <AppLogs />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
