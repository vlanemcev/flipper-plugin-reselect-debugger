import React, { useCallback } from 'react';

import { Button, Select, Typography } from 'antd';
import { Layout, Toolbar as FlipperToolbar, usePlugin, useValue } from 'flipper-plugin';

import { AimOutlined, ReloadOutlined } from '@ant-design/icons';

import { plugin } from '../../../index';

const { Option } = Select;
const { Text } = Typography;

const numbersOptions = [
  { label: 'None', value: 0 },
  { label: 1, value: 1 },
  { label: 3, value: 3 },
  { label: 5, value: 5 },
  { label: 10, value: 10 },
];

type ToolbarProps = {
  selectedSelectorId?: string;
  numberOfMostRecomputed?: number;
  onSelectSelector?: (selector: string) => void;
  onSelectMostRecomputed?: (numberOfNodes: number) => void;
  onRefreshSelectorsGraph?: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  selectedSelectorId,
  numberOfMostRecomputed,
  onSelectSelector,
  onSelectMostRecomputed,
  onRefreshSelectorsGraph,
}) => {
  const instance = usePlugin(plugin);
  const selectorsGraph = useValue(instance.selectorsGraphState);

  const renderRightContent = useCallback(
    () => (
      <Layout.Horizontal gap={30}>
        <Layout.Horizontal gap={10} center>
          <Text>Most Recomputed</Text>
          <Select
            value={numberOfMostRecomputed}
            suffixIcon={<AimOutlined width={20} height={20} />}
            style={{ width: 100 }}
            placeholder="Nodes"
            onSelect={onSelectMostRecomputed}
            options={numbersOptions}
          />
        </Layout.Horizontal>

        <Button icon={<ReloadOutlined width={15} height={15} />} onClick={onRefreshSelectorsGraph}>
          Refresh Selectors Graph
        </Button>
      </Layout.Horizontal>
    ),
    [],
  );

  return (
    <FlipperToolbar right={renderRightContent()}>
      {
        <Select
          value={selectedSelectorId}
          showSearch
          style={{ width: 250 }}
          placeholder="Select a selector"
          onSelect={onSelectSelector}
        >
          {Object.values(selectorsGraph.nodes).map((node) => (
            <Option key={node.name} value={node.name}>
              {node.name}
            </Option>
          ))}
        </Select>
      }
    </FlipperToolbar>
  );
};

export default React.memo(Toolbar);
