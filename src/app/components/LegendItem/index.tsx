import React from 'react';

import { styled } from 'flipper-plugin';

import Circle from '../Circle';

type LegendItemProps = {
  name: string;
  color: string;
};

export const LegendItemWrapper = styled.div`
  dispay: flex;
  align-items: center;
`;

const LegendItem: React.FC<LegendItemProps> = ({ name, color }) => (
  <LegendItemWrapper>
    <Circle color={color} />
    <span>{name}</span>
  </LegendItemWrapper>
);

export default React.memo(LegendItem);
