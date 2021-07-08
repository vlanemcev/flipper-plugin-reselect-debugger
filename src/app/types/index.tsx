import { CytoscapeOptions, Position } from 'cytoscape';

export type GraphRepresentation = {
  nodes: Record<
    string,
    {
      isNamed: boolean;
      name: string;
      recomputations: number | null;
      lastRecomputationReasone: string;
      selectorInputs: unknown[];
      outputIsStateDependentOnly: boolean | null;
      selectorOutput: unknown;
      analyzingError: string;
    }
  >;
  edges: {
    from: string;
    to: string;
  }[];
};

export type CytoscapeDefaultOptions = Omit<CytoscapeOptions, 'container' | 'elements'> & {
  layout: CytoscapeOptions['layout'] & {
    name: string;
    rankDir?: 'TB' | 'BT' | 'LR' | 'RL';
    ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
    nodeSep?: number;
    edgeSep?: number;
    ranksep?: number;
    minLen?: () => number;
    transform?: (node: unknown, pos: Position) => Position;
    spacingFactor?: number;
    nodeDimensionsIncludeLabels?: boolean;
  };
};
