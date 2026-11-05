import ReactFlow, {
  Background,
  Handle,
  Position,
  ReactFlowProvider,
  type NodeTypes,
} from 'reactflow';
import { RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import 'reactflow/dist/style.css';

import SplitPanel from './components/split';
import GraphStraightEdge from './components/straight-edge';
import { panelEmptyTextClass } from '@/pages/home/demo/components/canva/utils/panel-empty-state';
import { useGraph, symmetricOffsets, type EntrypointNodeData, type HostNodeData } from './components/logic';
import {
  classes,
  colors,
  handleStyle,
  layout,
  node,
  styles,
} from './style';

const HostNode = ({ data }: { data: HostNodeData }) => {
  const iconCenter = node.iconSize / 2;
  const srcOffsets = symmetricOffsets(data.srcCount ?? 0, layout.handleStep);
  const tgtOffsets = symmetricOffsets(data.tgtCount ?? 0, layout.handleStep);

  return (
  <div style={styles.hostNodeBox}>
    {srcOffsets.map((offset, i) => (
      <Handle
        key={`src-${i}`}
        id={`src-${i}`}
        type="source"
        position={Position.Left}
        isConnectable={false}
        style={handleStyle('left', iconCenter + offset)}
      />
    ))}
    {tgtOffsets.map((offset, i) => (
      <Handle
        key={`tgt-${i}`}
        id={`tgt-${i}`}
        type="target"
        position={Position.Right}
        isConnectable={false}
        style={handleStyle('right', iconCenter + offset)}
      />
    ))}
    <div style={styles.nodeIcon}>
      <img src={data.icon} style={styles.nodeIconImg} />
    </div>
    <div style={styles.nodeLabel}>
      <div style={styles.nodeMetaBold}>{data.ip}</div>
      <div style={styles.nodeTag}>[ {data.tag} ]</div>
    </div>
  </div>
  );
};

const EntrypointNode = ({ data }: { data: EntrypointNodeData }) => {
  const iconCenter = node.entrypointIconMarginTop + node.entrypointIconSize / 2;
  const tgtOffsets = symmetricOffsets(data.tgtCount ?? 0, layout.handleStep);

  return (
  <div style={styles.nodeBox}>
    {tgtOffsets.map((offset, i) => (
      <Handle
        key={`tgt-${i}`}
        id={`tgt-${i}`}
        type="target"
        position={Position.Right}
        isConnectable={false}
        style={handleStyle('right', iconCenter + offset)}
      />
    ))}
    <div style={styles.entrypointNodeIcon}>
      <img src={data.icon} style={styles.entrypointIconImg} />
    </div>
    <div style={styles.nodeLabel}>
      <div style={styles.entrypointRole}>SERVER</div>
      <div style={styles.nodeMetaBold}>{data.label}</div>
    </div>
  </div>
  );
};

const nodeTypes: NodeTypes = { host: HostNode, entrypoint: EntrypointNode };
const edgeTypes = { graphStraight: GraphStraightEdge };

const CustomControls = () => (
  <div style={styles.ctrl}>
    <button type="button" className="button-default" style={styles.btn}>
      <RefreshCw size={14} />
    </button>
    <button type="button" className="button-default" style={styles.btn}>
      <ZoomIn size={14} />
    </button>
    <button type="button" className="button-default" style={styles.btn}>
      <ZoomOut size={14} />
    </button>
  </div>
);

const GraphInner = () => {
  const {
    nodes,
    edges,
    overlayMessage,
    panelOpen,
    selected,
    panelStyle,
  } = useGraph();

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.flowWrap} style={styles.container}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            nodesConnectable={false}
            edgesUpdatable={false}
            connectOnClick={false}
          >
            <Background color={colors.grid} gap={24} />
            <CustomControls />
          </ReactFlow>
          {overlayMessage && (
            <div className={classes.overlay}>
              <span className={panelEmptyTextClass}>{overlayMessage}</span>
            </div>
          )}
        </div>

        {panelOpen && (
          <div style={styles.resizeHandle} className={classes.resize} />
        )}

        <div className={classes.panel(panelOpen)} style={panelStyle}>
          {panelOpen && selected && <SplitPanel host={selected} />}
        </div>
      </div>
    </div>
  );
};

const GraphWindow = () => (
  <ReactFlowProvider>
    <GraphInner />
  </ReactFlowProvider>
);

export default GraphWindow;
