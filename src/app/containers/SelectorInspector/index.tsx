import React, { useMemo } from 'react';

import { Divider, Empty, Typography } from 'antd';
import { DataInspector, Layout, usePlugin, useValue } from 'flipper-plugin';

import { plugin } from '../../../index';
import Colors from '../../styles/colors';

type SelectorInspectorProps = {
  selectedSelectorID?: string;
};

const SelectorInspector: React.FC<SelectorInspectorProps> = ({ selectedSelectorID }) => {
  const instance = usePlugin(plugin);
  const selectorsGraph = useValue(instance.selectorsGraphState);

  const selectorData = useMemo(() => {
    if (selectedSelectorID) {
      return selectorsGraph.nodes[selectedSelectorID];
    }
  }, [selectedSelectorID, selectorsGraph]);

  return (
    <Layout.Container pad="medium">
      <Typography.Title
        level={3}
        style={{ color: Colors.defaultNode }}
        title={selectedSelectorID || undefined}
      >
        {selectedSelectorID ? selectedSelectorID : 'Choose Selector'}
      </Typography.Title>

      {selectorData && selectorData.recomputations === null ? (
        <Typography.Text style={{ color: Colors.selectedNode }}>Not Memoized</Typography.Text>
      ) : null}

      <Divider />

      {selectorData ? (
        <DataInspector data={selectorData} expandRoot={true} collapsed={true} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Layout.Container>
  );
};

export default React.memo(SelectorInspector);
