import React from 'react';
import styled from 'styled-components';

const StyledHeading = styled.h3`
  font-weight: 500;
  font-size: 1.25rem;
  font-family: 'Archivo';

  align-self: start;
  padding-bottom: 5px;
  user-select: none;
`;

export const StatsSection = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
  justify-items: start;
`;

export const StatsHeading = ({ title }: { title: string }): JSX.Element => {
  return <StyledHeading>{title}</StyledHeading>;
};
