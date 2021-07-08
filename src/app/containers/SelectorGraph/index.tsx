import React, { useCallback, useEffect, useRef } from 'react';

import {
  Core,
  ElementDefinition,
  EventHandler as CytosEventHandler,
  NodeSingular,
} from 'cytoscape';
import { Layout, usePlugin, useValue } from 'flipper-plugin';
import isEmpty from 'lodash.isempty';

import { plugin } from '../../../index';
import LegendItem from '../../components/LegendItem';
import Colors from '../../styles/colors';
import { defaultEdgeStyle, defaultNodeStyle, selectedNodeStyle } from '../../styles/cytosParticles';
import {
  createCytoElements,
  drawCytoscapeSelectorsGraph,
  paintDependencies,
  paintDependents,
} from '../../utils/cytos';

type SelectorGraphProps = {
  selectedSelectorId?: string;
  onSelectCytosNode?: (nodeId: string) => void;
  numberOfMostRecomputed?: number;
};

const SelectorGraph: React.FC<SelectorGraphProps> = ({
  selectedSelectorId,
  onSelectCytosNode,
  numberOfMostRecomputed,
}) => {
  const instance = usePlugin(plugin);
  const selectorsGraphs = useValue(instance.selectorsGraphState);

  const cytosCore = useRef<Core | null>(null);
  const cyContainer = useRef<HTMLDivElement | null>(null);
  const cyLayoutWasMounted = useRef(false);

  const resetCollectionStyles = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label, ...nodeStyle } = defaultNodeStyle;

    if (cytosCore.current) {
      cytosCore.current.nodes().style(nodeStyle);
      cytosCore.current.edges().style(defaultEdgeStyle);
    }
  }, []);

  const paintNodeSelection = useCallback(
    (nodeId?: string, animate = false) => {
      resetCollectionStyles();

      if (!nodeId) {
        if (cytosCore.current) {
          // pan and zooms the graph to fit to a collection
          cytosCore.current.fit();
        }

        return;
      }

      if (cytosCore.current) {
        const selectedNode = cytosCore.current.nodes(
          // @ts-expect-error can't search with selectors because special chars, i.e. $ interfere
          (node: ElementDefinition) => node.data('id') === nodeId,
        );

        const selectedNodeSuccessors = selectedNode.successors();
        const selectedNodePredecessors = selectedNode.predecessors();

        selectedNode.style(selectedNodeStyle);
        paintDependencies(selectedNodeSuccessors);
        paintDependents(selectedNodePredecessors);

        if (animate) {
          const connectedEdges = selectedNode.connectedEdges();

          cytosCore.current.animate({
            fit: {
              eles: connectedEdges,
              padding: 150,
            },
          });
        }
      }
    },
    [resetCollectionStyles],
  );

  const handleSelectCytosNode: CytosEventHandler = useCallback(
    (event) => {
      const nodeId = event.target.id();

      paintNodeSelection(nodeId);

      if (onSelectCytosNode) {
        onSelectCytosNode(nodeId);
      }
    },
    [onSelectCytosNode],
  );

  const highlightNMostRecomputed = useCallback((n?: number) => {
    if (!n && n !== 0) {
      return;
    }

    resetCollectionStyles();

    if (cytosCore.current) {
      const recomputationBuckets = new Map();
      const nodes = cytosCore.current.nodes();

      nodes.forEach((node) => {
        const recomputations = node.data().recomputations;

        if (recomputations !== null) {
          if (!recomputationBuckets.get(recomputations)) {
            recomputationBuckets.set(recomputations, []);
          }

          recomputationBuckets.get(recomputations).push(node);
        }
      });

      const nMostRecomputed = [...recomputationBuckets.keys()].sort((x, y) => x - y).slice(-n);

      const highlighted: NodeSingular[] = nMostRecomputed.reduce(
        (acc, key) => acc.concat(recomputationBuckets.get(key)),
        [],
      );

      highlighted.forEach((node) =>
        node.style({
          'background-color': Colors.recomputed,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(selectorsGraphs.nodes) && !isEmpty(selectorsGraphs.edges)) {
      if (cyLayoutWasMounted.current === false) {
        cytosCore.current = drawCytoscapeSelectorsGraph(cyContainer.current, selectorsGraphs);

        if (cytosCore.current) {
          const pan = cytosCore.current.pan();
          const height = cytosCore.current.height();

          // move the graph to the center of view
          cytosCore.current.pan({ ...pan, y: height / 2 });

          cytosCore.current.on('tap', 'node', handleSelectCytosNode);
          cytosCore.current.ready(() => {
            cyLayoutWasMounted.current = true;
          });
        }
      } else {
        if (cytosCore.current) {
          cytosCore.current.json({
            elements: createCytoElements(selectorsGraphs),
          });
        }
      }
    }
  }, [selectorsGraphs]);

  useEffect(() => {
    paintNodeSelection(selectedSelectorId, true);
  }, [selectedSelectorId]);

  useEffect(() => {
    highlightNMostRecomputed(numberOfMostRecomputed);
  }, [numberOfMostRecomputed]);

  return (
    <Layout.Container grow padh="medium">
      <Layout.Horizontal padv="medium" gap>
        <LegendItem name="dependency" color={Colors.dependency} />
        <LegendItem name="selected" color={Colors.selectedNode} />
        <LegendItem name="dependent" color={Colors.dependent} />
        <LegendItem name="recomputed" color={Colors.recomputed} />
      </Layout.Horizontal>

      <Layout.Container grow padh="medium" ref={cyContainer} />
    </Layout.Container>
  );
};

export default React.memo(SelectorGraph);
