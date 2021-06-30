import cytoscape, { CollectionReturnValue, Core, ElementsDefinition } from 'cytoscape';
import dagre from 'cytoscape-dagre';

import { cytoDefaults } from '../../configs/cytosDefaults';
import Colors from '../../styles/colors';
import { defaultNodeStyle } from '../../styles/cytosParticles';
import { GraphRepresentation } from '../../types';
import { getGraphLabelText } from '../index';

cytoscape.use(dagre);

export const createCytoElements = ({ nodes, edges }: GraphRepresentation): ElementsDefinition => {
  const { label, ...nodeStyle } = defaultNodeStyle;

  const cytoNodes = Object.entries(nodes).map(([name, node]) => ({
    data: {
      ...node,
      ...{
        id: name,
        label: getGraphLabelText(name, node.recomputations),
      },
    },
  }));

  const cytoEdges = edges.map((edge, index) => ({
    data: {
      id: index.toString(),
      source: edge.from,
      target: edge.to,
    },
  }));

  return { nodes: cytoNodes, edges: cytoEdges };
};

export const drawCytoscapeSelectorsGraph = (
  container: HTMLElement | null,
  selectorsGraph: GraphRepresentation,
): Core => {
  const elements = createCytoElements(selectorsGraph);

  return cytoscape({ ...cytoDefaults, container, elements });
};

export function paintDependencies(elts: CollectionReturnValue) {
  elts.forEach((elt) => {
    if (elt.isNode()) {
      elt.style({
        'background-color': Colors.dependency,
      });
    }

    if (elt.isEdge()) {
      elt.style({
        'line-color': Colors.dependency,
        'z-index': 99,
        'target-arrow-color': Colors.dependency,
      });
    }
  });
}

export function paintDependents(elts: CollectionReturnValue) {
  elts.forEach((elt) => {
    if (elt.isNode()) {
      elt.style({
        'background-color': Colors.dependent,
      });
    }

    if (elt.isEdge()) {
      elt.style({
        'line-color': Colors.dependent,
        'z-index': 99,
        'target-arrow-color': Colors.dependent,
      });
    }
  });
}
