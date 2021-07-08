import React, { useCallback } from 'react';

import { Button, Select, Typography } from 'antd';
import { Layout, Toolbar as FlipperToolbar, usePlugin, useValue } from 'flipper-plugin';

import { AimOutlined, HistoryOutlined, ReloadOutlined } from '@ant-design/icons';

import { plugin } from '../../../index';

const { Option } = Select;
const { Text } = Typography;

const numbersOptions = [0, 1, 2, 3, 5, 10];

type ToolbarProps = {
  selectedSelectorId?: string;
  numberOfMostRecomputed?: number;
  onSelectSelector?: (selector: string) => void;
  onSelectMostRecomputed?: (numberOfNodes: number) => void;
  onResetSelectorsRecomputation?: () => void;
  onRefreshSelectorsGraph?: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  selectedSelectorId,
  numberOfMostRecomputed,
  onSelectSelector,
  onSelectMostRecomputed,
  onResetSelectorsRecomputation,
  onRefreshSelectorsGraph,
}) => {
  const instance = usePlugin(plugin);
  const selectorsGraph = useValue(instance.selectorsGraphState);

  const renderRightContent = useCallback(
    () => (
      <Layout.Horizontal gap={30}>
        <Layout.Horizontal gap={20} center>
          <Text>Most Recomputed</Text>
          <Select
            value={numberOfMostRecomputed}
            suffixIcon={<AimOutlined width={20} height={20} />}
            style={{ width: 100 }}
            placeholder="Nodes"
            onSelect={onSelectMostRecomputed}
          >
            {Object.values(numbersOptions).map((num) => (
              <Option key={num} value={num}>
                {num}
              </Option>
            ))}
          </Select>
        </Layout.Horizontal>

        <Button
          icon={<HistoryOutlined width={15} height={15} />}
          onClick={onResetSelectorsRecomputation}
        >
          Reset Recomputations
        </Button>

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
