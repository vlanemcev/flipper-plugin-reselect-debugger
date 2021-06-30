import React from 'react';

const circleStyle = {
  borderRadius: '50%',
  width: '1em',
  height: '1em',
  display: 'inline-block',
  margin: '0 0.5em',
  marginTop: '0.2em',
};

type CirclePropsType = {
  color: string;
};

const Circle: React.FC<CirclePropsType> = ({ color }) => (
  <div style={{ ...circleStyle, background: color }} />
);

export default React.memo(Circle);
