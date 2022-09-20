import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import {
  selectSelectedTab,
  setTabSelected,
  TabIndex,
  toTabName
} from '../../../features/uiStatusSlice';
import { AppLogs } from './AppLogs';
import { MainTab } from './MainTab';
import { SettingsTab } from './SettingsTab';
import { SpeedChart } from './SpeedChart';

export const GuiTabs = (): JSX.Element => {
  const selectedTab = useSelector(selectSelectedTab);
  const dispatch = useDispatch();

  const theme = useTheme();
  const fgSelected = theme.textColor;

  const selectedStyle = {
    color: fgSelected,
    borderBottom: `3px solid ${fgSelected}}`,
    fontWeight: 700
  };

  return (
    <Tabs
      height="0px"
      width="100%"
      padding="20px 5px 0 5px"
      display="flex"
      flexDir="column"
      flexGrow={1}
      index={selectedTab}
      onChange={(index: number) => {
        dispatch(setTabSelected(toTabName(index as TabIndex)));
      }}
      isLazy={false}
      variant="unstyled"
    >
      <TabList justifyContent="space-evenly">
        <Tab _selected={selectedStyle}>MAIN</Tab>
        <Tab _selected={selectedStyle}>CHART</Tab>
        <Tab _selected={selectedStyle}>LOGS</Tab>
        <Tab _selected={selectedStyle}>OPTS</Tab>
      </TabList>
      <TabPanels flexGrow={1} padding={1} height="0px">
        <TabPanel flexGrow={1} padding={2}>
          <MainTab />
        </TabPanel>
        <TabPanel flexGrow={1} padding={2}>
          <SpeedChart />
        </TabPanel>
        <TabPanel flexGrow={1} padding={2} height="100%">
          <AppLogs />
        </TabPanel>
        <TabPanel flexGrow={1} padding={2} >
          <SettingsTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
