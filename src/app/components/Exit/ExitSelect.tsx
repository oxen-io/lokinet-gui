import { Flex, Input, Select } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { css, useTheme } from 'styled-components';
import {
  onUserExitNodeSet,
  selectExitsFromSettings,
  selectExitInputDisabled,
  selectExitNodeFromDaemon,
  selectExitNodeFromUser,
  selectHasExitTurningOn,
  selectHasExitTurningOff
} from '../../../features/statusSlice';
import { useAppDispatch } from '../../hooks';

const BookMarkSVGSelected = ({ onClick }: { onClick: () => void }) => {
  const theme = useTheme();
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      cursor="inherit"
    >
      <path
        d="M21.8737 0.998718H0V22.8959H21.8737V0.998718Z"
        fill={theme.backgroundColor}
      />
      <path
        d="M3.84421 22.8959H18.0295C20.5685 22.8959 21.8737 21.5906 21.8737 19.0901V4.82793C21.8737 2.32528 20.5685 1.02216 18.0295 1.02216H3.84421C1.31484 1.02216 0 2.31567 0 4.82793V19.0901C0 21.6003 1.31484 22.8959 3.84421 22.8959Z"
        fill={theme.textColor}
      />
      <path
        d="M7.47819 18.3663C7.01859 18.3663 6.71437 18.0291 6.71437 17.4842V7.41356C6.71437 6.2227 7.35116 5.57418 8.54202 5.57418H13.3919C14.5945 5.57418 15.2313 6.2227 15.2313 7.41356V17.4842C15.2313 18.0291 14.9271 18.3663 14.4579 18.3663C14.1246 18.3663 13.9277 18.181 13.4086 17.666L11.0224 15.3258C10.9894 15.2906 10.9446 15.2906 10.9137 15.3258L8.53921 17.666C8.01046 18.181 7.81147 18.3663 7.47819 18.3663Z"
        fill={theme.backgroundColor}
      />
    </svg>
  );
};

const BookMarkSVGNotSelected = ({ onClick }: { onClick: () => void }) => {
  const theme = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 23 23"
      fill="none"
      onClick={onClick}
      cursor="inherit"
    >
      <path
        d="M4.47067 22.4356H18.656C21.195 22.4356 22.5002 21.1303 22.5002 18.6298V4.3676C22.5002 1.86495 21.195 0.561829 18.656 0.561829H4.47067C1.9413 0.561829 0.626465 1.85534 0.626465 4.3676V18.6298C0.626465 21.1399 1.9413 22.4356 4.47067 22.4356ZM4.60379 20.1396C3.51418 20.1396 2.92238 19.5755 2.92238 18.4369V4.55838C2.92238 3.41978 3.51418 2.85775 4.60379 2.85775H18.5229C19.6029 2.85775 20.2043 3.41978 20.2043 4.55838V18.4369C20.2043 19.5755 19.6029 20.1396 18.5229 20.1396H4.60379Z"
        fill={theme.textColor}
      />
      <path
        d="M8.22701 17.6098C8.54435 17.6098 8.73911 17.4403 9.2381 16.9489L11.517 14.6967C11.5479 14.6637 11.5927 14.6637 11.6236 14.6967L13.912 16.9489C14.4035 17.4403 14.5962 17.6098 14.9114 17.6098C15.3563 17.6098 15.6382 17.2948 15.6382 16.786V7.15713C15.6382 6.0183 15.0375 5.40588 13.8912 5.40588H9.24724C8.11263 5.40588 7.50982 6.0183 7.50982 7.15713V16.786C7.50982 17.2948 7.79388 17.6098 8.22701 17.6098Z"
        fill={theme.textColor}
      />
    </svg>
  );
};

const SvgContainer = styled.div<{ disableClicks: boolean }>`
  margin-left: 10px;
  cursor: ${(props) => (props.disableClicks ? 'not-allowed' : 'pointer')};
`;

const BookmarkSvg = ({
  isSelected,
  setIsSelected,
  disableClicks
}: {
  isSelected: boolean;
  setIsSelected: (isSelected: boolean) => void;
  disableClicks: boolean;
}) => {
  const toggleSelected = () => {
    if (!disableClicks) {
      setIsSelected(!isSelected);
    }
  };
  return (
    <SvgContainer
      disableClicks={disableClicks}
      title="Toggle connection history"
    >
      {isSelected ? (
        <BookMarkSVGSelected onClick={toggleSelected} />
      ) : (
        <BookMarkSVGNotSelected onClick={toggleSelected} />
      )}
    </SvgContainer>
  );
};

const useExitToUse = () => {
  const exitIsTurningOn = useSelector(selectHasExitTurningOn);
  const exitIsTurningOff = useSelector(selectHasExitTurningOff);
  const exitNodeFromUser = useSelector(selectExitNodeFromUser);
  const exitNodeFromDaemon = useSelector(selectExitNodeFromDaemon);
  const disableInputEdits = useSelector(selectExitInputDisabled);

  // if edits are not disabled, we render whatever the user typed
  if (!disableInputEdits) {
    return exitNodeFromUser;
  }

  // while the exit is turning ON, we usually get a summaryStatus from the daemon with the exit already set. But we do want the addExit call to be finished before updating the exitNodeFromDaemon.
  if (exitIsTurningOn) {
    return exitNodeFromUser;
  }

  // When the exit is turning off,  we want to show the user entered value because the value from the daemon might be removed before the deleteExit call is run
  if (exitIsTurningOff) {
    return exitNodeFromUser;
  }
  return exitNodeFromDaemon;
};

export const ExitSelector = () => {
  const dispatch = useAppDispatch();

  const exitsNodesFromSettings = useSelector(selectExitsFromSettings);

  const [bookmarkIsOpened, setBookmarkIsOpened] = useState(false);

  // if the exit is loading (awaiting answer from daemon)
  // or if the exit node is set, we cannot edit the input fields.
  // We first need to disable the exit node mode
  const disableInputEdits = useSelector(selectExitInputDisabled);
  const exitToUse = useExitToUse();

  const sharedOptions = {
    disabled: disableInputEdits,
    onChange: (e: any) => dispatch(onUserExitNodeSet(e?.currentTarget?.value)),
    size: 'sm',
    variant: 'flushed',
    spellCheck: false,
    noOfLines: 1
  };

  return (
    <Flex flexDirection={'row'} alignItems="center" marginBottom={2}>
      {bookmarkIsOpened && !disableInputEdits ? (
        <ExitSelect {...sharedOptions} width="100%">
          {exitsNodesFromSettings.map((exitNode) => {
            return (
              <option
                key={exitNode}
                value={exitNode}
                selected={exitNode === exitToUse}
              >
                {exitNode}
              </option>
            );
          })}
        </ExitSelect>
      ) : (
        <ExitInput
          {...sharedOptions}
          width="100%"
          height="30px"
          style={{ textIndent: '4px' }}
          onPaste={(e: any) =>
            dispatch(onUserExitNodeSet(e?.currentTarget?.value))
          }
          value={exitToUse || ''}
        />
      )}
      <BookmarkSvg
        isSelected={bookmarkIsOpened}
        setIsSelected={setBookmarkIsOpened}
        disableClicks={disableInputEdits}
      />
    </Flex>
  );
};

const sharedStyleOverride = css<{ disabled: boolean }>`
  background-color: ${(props) => props.theme.inputBackground};
  color: ${(props) => props.theme.textColor};
  outline-color: transparent;
  font-family: 'IBM Plex Mono';
  font-weight: 400;
  border-radius: 3px;
  border: none;
  font-size: 1.1rem;
  padding: 5px;
  outline: none;
  transition: 0.25s;
  width: 100%;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'auto')};
`;

export const ExitInput = styled(Input)`
  ${sharedStyleOverride}
`;

const ExitSelect = styled(Select)`
  ${sharedStyleOverride};
`;
