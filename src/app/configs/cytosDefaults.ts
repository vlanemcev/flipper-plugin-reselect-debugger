import { defaultEdgeStyle, defaultNodeStyle } from '../styles/cytosParticles';
import { CytoscapeDefaultOptions } from '../types';

const Y_SPACING = 2;

export const cytoDefaults: CytoscapeDefaultOptions = {
  style: [
    {
      selector: 'edge',
      style: defaultEdgeStyle,
    },
    {
      selector: 'node',
      style: defaultNodeStyle,
    },
  ],
  layout: {
    name: 'dagre',
    rankDir: 'BT',
    ranker: 'longest-path',
    nodeDimensionsIncludeLabels: true,
    minLen: () => 3,
    ranksep: 200,
    transform: (node, { x, y }) => ({ x, y: y + y * Y_SPACING }),
  },
};
