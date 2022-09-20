import React from 'react';
import { useUpdate } from 'react-use';
import styled from 'styled-components';
import { OnExitStopSetting } from '../../../../types';
import { getOnStopSetting, setOnStopSetting } from '../../config';
import { PlusDivider, MinusDivider } from '../Utils/Dividers';

const options: Array<{ id: OnExitStopSetting; title: string; label: string }> =
  [
    {
      id: 'stop_everything',
      label: 'Stop Lokinet completely',
      title: 'Stop the exit mode set and the Lokinet daemon.'
    },
    {
      id: 'keep_daemon_only',
      label: 'Stop exit mode only',
      title: 'Keep the Lokinet daemon running but stop exit mode'
    },
    {
      id: 'keep_everything',
      label: 'Keep Lokinet & exit mode',
      title:
        'Keep Lokinet and the current exit status running even when the app is fully stopped.'
    }
  ];

const RadioInput = styled.input`
  appearance: none;
  border: 2px solid ${(props) => props.theme.backgroundColor};
  box-shadow: 0 0 0 1px ${(props) => props.theme.textColor};
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background-color: none;
  transition: all 0.25s;
  margin-right: 5px;

  :checked {
    background-color: ${(props) => props.theme.textColor};
  }
`;

const RadioInputLabel = styled.label``;
const RadioContainer = styled.div``;

const RadioGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: 300px;
`;

const SettingsTabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SettingsText = styled.div`
  font-family: 'Archivo';
  font-size: 15px;
  margin-bottom: 10px;
`;

export const SettingsTab = (): JSX.Element => {
  const selectedOnStopSetting = getOnStopSetting();

  const forceUdate = useUpdate();

  return (
    <SettingsTabContainer>
      <PlusDivider />

      <SettingsText>When the app is completely exited, do:</SettingsText>
      <RadioGroupContainer>
        {options.map((m) => {
          const selected = m.id === selectedOnStopSetting;
          return (
            <RadioContainer key={m.id} title={m.title}>
              <RadioInput
                type="radio"
                id={m.id}
                name="What to stop on exit"
                value={m.id}
                checked={selected}
                defaultChecked={selected}
                onChange={() => {
                  if (m.id) {
                    setOnStopSetting(m.id);
                    forceUdate();
                  }
                }}
              />
              <RadioInputLabel htmlFor={m.id}>{m.label}</RadioInputLabel>
            </RadioContainer>
          );
        })}
      </RadioGroupContainer>
      <MinusDivider />
    </SettingsTabContainer>
  );
};
