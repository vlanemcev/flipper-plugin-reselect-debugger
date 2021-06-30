import React from 'react';

import { createState, PluginClient } from 'flipper-plugin';

import App from './app/App';
import { GraphRepresentation } from './app/types';

type Events = {
  setSelectorsGraph: GraphRepresentation;
  updateSelectorsGraph: GraphRepresentation;
};

type Methods = {
  refreshSelectorsGraph: () => Promise<GraphRepresentation>;
};

export function plugin(client: PluginClient<Events, Methods>) {
  const selectorsGraphState = createState<GraphRepresentation>(
    { nodes: {}, edges: [] },
    { persist: 'selectorsGraph' },
  );

  const refreshSelectorsGraph = async () => {
    try {
      if (client.isConnected) {
        const refreshedSelectrorsGraph = await client.send('refreshSelectorsGraph', undefined);
        selectorsGraphState.set(refreshedSelectrorsGraph);
      }
    } catch (error) {
      console.error('Failed to retrieve refreshed selectors graphs: \n', error);
    }
  };

  client.onMessage('setSelectorsGraph', (selectorsGraph) => {
    selectorsGraphState.set(selectorsGraph);
  });

  return {
    selectorsGraphState,
    refreshSelectorsGraph,
  };
}

export function Component() {
  return <App />;
}
