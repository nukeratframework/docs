import { useMemo, useState, type CSSProperties } from 'react';
import { MarkerType, type Edge, type Node } from 'reactflow';

import type { GraphHost, GraphServerData } from '@/pages/home/demo/types';
import { edge, layout } from '../style';

import entrypointSvg from '@/pages/home/demo/assets/icons/graphs/entrypoint.svg';
import linuxHostRootSvg from '@/pages/home/demo/assets/icons/graphs/linux_host_root.svg';
import linuxHostSvg from '@/pages/home/demo/assets/icons/graphs/linux_host.svg';
import macHostRootSvg from '@/pages/home/demo/assets/icons/graphs/mac_host_root.svg';
import macHostSvg from '@/pages/home/demo/assets/icons/graphs/mac_host.svg';
import unknownHostRootSvg from '@/pages/home/demo/assets/icons/graphs/unknown_host_root.svg';
import unknownHostSvg from '@/pages/home/demo/assets/icons/graphs/unknown_host.svg';
import windowsHostRootSvg from '@/pages/home/demo/assets/icons/graphs/windows_host_root.svg';
import windowsHostSvg from '@/pages/home/demo/assets/icons/graphs/windows_host.svg';


const DEMO_GRAPHS: GraphServerData[] = [
  {
    server: '192.168.15.10:9090',
    chains: [
      'server<27e7a',
      'server<47334',
      'server<47334<tcp<246bd',
      'server<47334<smb<600d4',
    ],
    data: {
      '47334': {
        id: 8,
        tag: '47334',
        ip: '192.168.15.72',
        host_server: '192.168.15.10',
        host_port: '9090',
        internal: '192.168.15.72',
        external_ip: '',
        listener: 'http',
        privilege: 'user',
        process: null,
        pid: 6692,
        arch: 'x64',
        os: 'Windows 10 Pro',
        user: 'Lab',
        hostname: 'DESKTOP-B08TFNF',
        first_seen: '2026-09-06 06:18:26.066639',
        last_seen: '2026-09-06 07:27:51.917054',
        last_activity: '9h',
        delay: 2,
        implant_config: '{"channel":"http","host":"192.168.15.10","port":"9090","host_tag":"47334","delay":2,"syscall_method":"indirect"}',
        _server: '192.168.15.10:9090',
      },
      '27e7a': {
        id: 12,
        tag: '27e7a',
        ip: '10.0.2.15',
        host_server: '192.168.15.10',
        host_port: '9090',
        internal: '10.0.2.15',
        external_ip: '',
        listener: 'http',
        privilege: 'user',
        process: null,
        pid: 811,
        arch: 'x64',
        os: 'macOS 10.16',
        user: 'lab',
        hostname: 'Labs-iMac-Pro.local',
        first_seen: '2026-09-06 06:40:44.255209',
        last_seen: '2026-09-06 06:48:09.939776',
        last_activity: '10h',
        delay: 2,
        implant_config: '{"channel":"http","delay":2,"host":"192.168.15.10","host_tag":"27e7a","port":"9090"}',
        _server: '192.168.15.10:9090',
      },
      '246bd': {
        id: 10,
        tag: '246bd',
        ip: '192.168.15.81',
        host_server: '192.168.15.72',
        host_port: '8888',
        internal: '192.168.15.81',
        external_ip: '',
        listener: 'tcp',
        privilege: 'user',
        process: null,
        pid: 623094,
        arch: 'x64',
        os: 'Kali GNU/Linux Rolling',
        user: 'root',
        hostname: 'kali',
        first_seen: '2026-09-06 06:23:41.852676',
        last_seen: '2026-09-06 06:48:25.781908',
        last_activity: '10h',
        delay: 2,
        implant_config: '{"channel":"tcp","host":"192.168.15.72","port":"8888","host_tag":"246bd","delay":2}',
        _server: '192.168.15.10:9090',
      },
      '600d4': {
        id: 11,
        tag: '600d4',
        ip: '192.168.15.74',
        host_server: '192.168.15.72',
        host_port: '445',
        internal: '192.168.15.74',
        external_ip: '',
        listener: 'smb',
        privilege: 'admin',
        process: null,
        pid: 688,
        arch: 'x64',
        os: 'Windows 10 Pro',
        user: 'Lab',
        hostname: 'DESKTOP-B08TFNF',
        first_seen: '2026-09-06 06:38:21.270636',
        last_seen: '2026-09-06 07:27:51.407361',
        last_activity: '9h',
        delay: 2,
        implant_config: '{"channel":"smb","host":"192.168.15.72","port":"445","host_tag":"600d4","delay":2,"syscall_method":"indirect"}',
        _server: '192.168.15.10:9090',
      },
    },
  },
];

type OsFamily = 'windows' | 'linux' | 'mac' | 'unknown';

const iconMap: Record<OsFamily, { default: string; root: string }> = {
  windows: { default: windowsHostSvg, root: windowsHostRootSvg },
  linux:   { default: linuxHostSvg,   root: linuxHostRootSvg   },
  mac:     { default: macHostSvg,     root: macHostRootSvg     },
  unknown: { default: unknownHostSvg, root: unknownHostRootSvg },
};

const osPatterns: Array<[RegExp, OsFamily]> = [
  [/\b(win|windows|microsoft)\b/i, 'windows'],
  [/\b(mac|macos|osx|os\s*x|darwin)\b/i, 'mac'],
  [/\b(linux|gnu|ubuntu|debian|fedora|arch|centos|kali|gentoo|alpine|redhat|rhel|suse|mint|manjaro|raspbian|busybox|android)\b/i, 'linux'],
];

const detectOsFamily = (os: string | null | undefined): OsFamily => {
  const v = (os ?? '').toString();
  if (!v) return 'unknown';
  for (const [re, family] of osPatterns) {
    if (re.test(v)) return family;
  }
  return 'unknown';
};

const maxIpLength = '000.000.000.000'.length;

export const truncateIp = (value: string | null | undefined): string => {
  const v = (value ?? '').trim();
  if (!v) return '-';
  if (v.length <= maxIpLength) return v;
  return `${v.slice(0, maxIpLength)}...`;
};

const maxOsLength = 15;

export const truncateOs = (value: string | null | undefined): string => {
  const v = (value ?? '').trim();
  if (!v) return 'unknown';
  if (v.length <= maxOsLength) return v;
  return `${v.slice(0, maxOsLength)}...`;
};

const maxEntrypointLength = 16;

export const truncateEntrypoint = (value: string | null | undefined): string => {
  const v = (value ?? '').trim().replace('https://', '').replace('http://', '');
  if (!v) return '-';
  if (v.length <= maxEntrypointLength) return v;
  return `${v.slice(0, maxEntrypointLength)}...`;
};

const elevatedPrivileges = new Set(['root', 'admin', 'system']);

export const isElevatedPrivilege = (value?: string | null): boolean => {
  const v = (value ?? '').toLowerCase();
  return [...elevatedPrivileges].some((p) => v.includes(p));
};

const pickHostIcon = (host: GraphHost): string => {
  const family = detectOsFamily(host.os);
  return isElevatedPrivilege(host.privilege) ? iconMap[family].root : iconMap[family].default;
};

export const formatDate = (raw?: string | null): string => {
  if (!raw) return '-';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(2);
  return `${hh}:${mm} ${dd}/${mo}/${yy}`;
};

export interface HostNodeData {
  icon: string;
  ip: string;
  os: string;
  tag: string;
  privilege?: string | null;
  host: GraphHost;
  srcCount?: number;
  tgtCount?: number;
}

export interface EntrypointNodeData {
  icon: string;
  label: string;
  hostTag: string;
  tgtCount?: number;
}

export const symmetricOffsets = (count: number, step: number): number[] => {
  if (count <= 0) return [];
  const mid = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => (i - mid) * step);
};

const makeEdge = (id: string, source: string, target: string, label?: string, direct = false): Edge => {
  const stroke = direct ? edge.channelColor : edge.color;
  const labelFill = direct ? edge.channelLabel : edge.colorLabel;
  return {
    id,
    source,
    target,
    type: 'graphStraight',
    label,
    labelShowBg: edge.labelShowBg,
    labelBgStyle: { fill: edge.labelBg },
    labelBgPadding: edge.labelBgPadding,
    labelStyle: {
      fill: labelFill,
      fontSize: edge.labelSize,
      fontFamily: 'monospace',
      fontWeight: edge.labelWeight,
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: edge.markerW, height: edge.markerH },
    style: { stroke, strokeWidth: edge.strokeWidth },
    animated: false,
  };
};

const channelLabel = (host?: GraphHost) => (host?.listener || 'http').trim().toUpperCase();
const relayLabel = (via: string) => `${via.toUpperCase()}`;

const slug = (value: string) => value.replace(/[^a-zA-Z0-9]+/g, '-') || 'default';

const hostNode = (id: string, host: GraphHost, x: number, y: number): Node => ({
  id,
  type: 'host',
  position: { x, y },
  data: {
    icon: pickHostIcon(host),
    ip: truncateIp(host.internal ?? host.ip),
    os: truncateOs(host.os),
    tag: host.tag ?? '-',
    privilege: host.privilege,
    host,
  } satisfies HostNodeData,
});

const isLink = (part: string) => part === 'tcp' || part === 'smb';

const resolveEntryHostTag = (chains: string[]): string => {
  const tags = new Set<string>();
  for (const chain of chains) {
    const parts = chain.split('<');
    if (parts[0] !== 'server') continue;
    const tag = parts[1]?.trim();
    if (tag && !isLink(tag)) tags.add(tag);
  }
  if (tags.size === 0) return '-';
  return [...tags].join(', ');
};

type LayoutHop = { id: string; tag?: string; via?: string };

const parseChainHops = (
  chain: string,
  entryId: string,
  sid: string,
  data: GraphServerData['data'],
): LayoutHop[] => {
  const hops: LayoutHop[] = [];
  let via: string | undefined;

  for (const part of chain.split('<')) {
    if (isLink(part)) {
      via = part;
      continue;
    }
    if (part === 'server') {
      hops.push({ id: entryId });
      continue;
    }
    const host = data[part];
    if (!host) continue;
    hops.push({ id: `host-${sid}-${part}`, tag: part, via });
    via = undefined;
  }

  return hops;
};

const layoutTrident = (
  entryId: string,
  childrenMap: Map<string, LayoutHop[]>,
  startY: number,
): Map<string, { x: number; y: number }> => {
  const positions = new Map<string, { x: number; y: number }>();

  const layoutSubtree = (nodeId: string, depth: number, y: number): number => {
    if (positions.has(nodeId)) return layout.rowGapY / 2;

    positions.set(nodeId, { x: depth * layout.columnGapX, y });
    const kids = childrenMap.get(nodeId) ?? [];

    if (kids.length === 0) return layout.rowGapY / 2;
    if (kids.length === 1) return layoutSubtree(kids[0].id, depth + 1, y);

    const offsets = symmetricOffsets(kids.length, layout.rowGapY);
    let extent = layout.rowGapY / 2;
    for (let i = 0; i < kids.length; i++) {
      const branchExtent = layoutSubtree(kids[i].id, depth + 1, y + offsets[i]);
      extent = Math.max(extent, Math.abs(offsets[i]) + branchExtent);
    }
    return extent;
  };

  layoutSubtree(entryId, 0, startY);
  return positions;
};

const buildServerGraph = (
  graph: GraphServerData,
  offsetY: number,
): { nodes: Node[]; edges: Edge[]; blockHeight: number } => {
  const server = graph.server?.trim() || 'unknown';
  const sid = slug(server);
  const entryId = `entrypoint-${sid}`;
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const childrenMap = new Map<string, LayoutHop[]>();
  const childKeys = new Map<string, Set<string>>();
  const chainHops: LayoutHop[][] = [];

  const addChild = (parentId: string, child: LayoutHop) => {
    const keys = childKeys.get(parentId) ?? new Set<string>();
    if (keys.has(child.id)) return;
    keys.add(child.id);
    childKeys.set(parentId, keys);
    const list = childrenMap.get(parentId) ?? [];
    list.push(child);
    childrenMap.set(parentId, list);
  };

  for (const chain of graph.chains) {
    const hops = parseChainHops(chain, entryId, sid, graph.data);
    if (hops.length < 2) continue;
    chainHops.push(hops);

    for (let i = 0; i < hops.length - 1; i++) {
      const from = hops[i + 1];
      const to = hops[i];
      addChild(to.id, from);
    }
  }

  const positions = layoutTrident(entryId, childrenMap, offsetY);
  const entryPos = positions.get(entryId) ?? { x: 0, y: offsetY };

  nodes.push({
    id: entryId,
    type: 'entrypoint',
    position: { x: entryPos.x, y: entryPos.y },
    data: {
      label: truncateEntrypoint(server),
      icon: entrypointSvg,
      hostTag: resolveEntryHostTag(graph.chains),
    } satisfies EntrypointNodeData,
  });

  for (const [id, pos] of positions) {
    if (id === entryId) continue;
    const tag = id.slice(`host-${sid}-`.length);
    const host = graph.data[tag];
    if (!host) continue;
    nodes.push(hostNode(id, host, pos.x, pos.y));
  }

  const edgeKeys = new Set<string>();

  for (const hops of chainHops) {
    for (let i = 0; i < hops.length - 1; i++) {
      const from = hops[i + 1];
      const to = hops[i];
      const key = `${from.id}|${to.id}`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      const label = from.via
        ? relayLabel(from.via)
        : channelLabel(from.tag ? graph.data[from.tag] : undefined);
      edges.push(makeEdge(`edge-${from.id}-${to.id}`, from.id, to.id, label, to.id === entryId));
    }
  }

  const ys = [...positions.values()].map((p) => p.y);
  const spread = ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
  const blockHeight = spread + layout.blockPad;

  return { nodes, edges, blockHeight };
};

const assignEdgeHandles = (nodes: Node[], edges: Edge[]) => {
  const srcBuckets = new Map<string, string[]>();
  const tgtBuckets = new Map<string, string[]>();

  for (const e of edges) {
    const srcList = srcBuckets.get(e.source) ?? [];
    srcList.push(e.id);
    srcBuckets.set(e.source, srcList);

    const tgtList = tgtBuckets.get(e.target) ?? [];
    tgtList.push(e.id);
    tgtBuckets.set(e.target, tgtList);
  }

  const srcIndex = new Map<string, Map<string, number>>();
  const tgtIndex = new Map<string, Map<string, number>>();

  for (const [nodeId, ids] of srcBuckets) {
    const m = new Map<string, number>();
    ids.forEach((id, i) => m.set(id, i));
    srcIndex.set(nodeId, m);
  }
  for (const [nodeId, ids] of tgtBuckets) {
    const m = new Map<string, number>();
    ids.forEach((id, i) => m.set(id, i));
    tgtIndex.set(nodeId, m);
  }

  for (const e of edges) {
    const si = srcIndex.get(e.source)?.get(e.id);
    const ti = tgtIndex.get(e.target)?.get(e.id);
    if (si !== undefined) e.sourceHandle = `src-${si}`;
    if (ti !== undefined) e.targetHandle = `tgt-${ti}`;
  }

  for (const node of nodes) {
    node.data = {
      ...node.data,
      srcCount: srcBuckets.get(node.id)?.length ?? 0,
      tgtCount: tgtBuckets.get(node.id)?.length ?? 0,
    };
  }
};

const buildGraph = (graphs: GraphServerData[]): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let offsetY = 0;

  for (const graph of graphs) {
    const part = buildServerGraph(graph, offsetY);
    nodes.push(...part.nodes);
    edges.push(...part.edges);
    offsetY += part.blockHeight + layout.blockGap;
  }

  assignEdgeHandles(nodes, edges);
  return { nodes, edges };
};

const useGraphData = () => ({
  graphs: DEMO_GRAPHS,
  initialized: true,
});

export interface GraphViewModel {
  nodes: Node[];
  edges: Edge[];
  overlayMessage: string | null;
  panelOpen: boolean;
  selected: GraphHost | null;
  panelStyle: CSSProperties;
}

export const useGraph = (): GraphViewModel => {
  const { graphs, initialized } = useGraphData();
  const { nodes, edges } = useMemo(() => buildGraph(graphs), [graphs]);
  const [selected] = useState<GraphHost | null>(null);
  const [panelOpen] = useState(false);
  const [rightWidth] = useState(layout.panelWidth);

  const panelStyle = panelOpen
    ? ({
        '--panel-width': `${rightWidth}px`,
        zIndex: 999,
      } as CSSProperties)
    : { zIndex: 999 };

  const overlayMessage = !initialized
    ? 'loading...'
    : graphs.length === 0
      ? 'No content'
      : null;

  return {
    nodes,
    edges,
    overlayMessage,
    panelOpen,
    selected,
    panelStyle,
  };
};
