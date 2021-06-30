import Colors from './colors';

export const defaultEdgeStyle = {
  width: 10,
  'target-arrow-shape': 'triangle',
  'line-color': Colors.defaultEdge,
  'target-arrow-color': Colors.defaultEdge,
  'curve-style': 'bezier',
  'z-index': 1,
};

export const defaultNodeStyle = {
  label: 'data(label)',
  'font-size': 32,
  color: Colors.defaultNodeLabel,
  width: 100,
  height: 100,
  'background-color': Colors.defaultNode,
};

export const selectedNodeStyle = {
  'background-color': Colors.selectedNode,
};
