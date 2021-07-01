import React, { useCallback, useState } from 'react';

import { DetailSidebar, Layout, usePlugin } from 'flipper-plugin';

import { plugin } from '../index';
import SelectorGraph from './containers/SelectorGraph';
import SelectorInspector from './containers/SelectorInspector';
import Toolbar from './containers/ToolBar';

const App = () => {
  const instance = usePlugin(plugin);

  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [numberOfMostRecomputed, setNumberOfMostRecomputed] = useState<number>();

  const onResetSelectorsRecomputation = useCallback(async () => {
    setNumberOfMostRecomputed(0);

    await instance.resetSelectorsRecomputation();
  }, []);

  const onRefreshSelectorsGraph = useCallback(async () => {
    setSelectedNodeId('');
    setNumberOfMostRecomputed(0);

    await instance.refreshSelectorsGraph();
  }, []);

  const onSelectCytosNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  return (
    <Layout.Container grow>
      <Toolbar
        selectedSelectorId={selectedNodeId}
        numberOfMostRecomputed={numberOfMostRecomputed}
        onSelectSelector={setSelectedNodeId}
        onSelectMostRecomputed={setNumberOfMostRecomputed}
        onResetSelectorsRecomputation={onResetSelectorsRecomputation}
        onRefreshSelectorsGraph={onRefreshSelectorsGraph}
      />
      <SelectorGraph
        selectedSelectorId={selectedNodeId}
        numberOfMostRecomputed={numberOfMostRecomputed}
        onSelectCytosNode={onSelectCytosNode}
      />
      <DetailSidebar minWidth={250}>
        <SelectorInspector selectedSelectorID={selectedNodeId} />
      </DetailSidebar>
    </Layout.Container>
  );
};

export default React.memo(App);
