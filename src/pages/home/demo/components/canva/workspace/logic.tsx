import { useId, useImperativeHandle, useRef, useState, type Ref } from "react";
import type { Host } from "@/pages/home/demo/types";

const demo_server = "192.168.15.10:9090";

const demo_hosts: Host[] = [
  {
    id: 8,
    tag: "47334",
    ip: "192.168.15.72",
    host_server: "192.168.15.10",
    host_port: "9090",
    internal: "192.168.15.72",
    external_ip: "",
    listener: "http",
    privilege: "user",
    notes: null,
    process: null,
    pid: 6692,
    arch: "x64",
    os: "Windows 10 Pro",
    user: "Lab",
    hostname: "DESKTOP-B08TFNF",
    first_seen: "2026-09-06 06:18:26.066639",
    last_seen: "2026-09-06 07:27:51.917054",
    last_activity: "9h",
    delay: 2,
    implant_config:
      '{"channel":"http","host":"192.168.15.10","port":"9090","host_tag":"47334","delay":2,"syscall_method":"indirect"}',
    _server: demo_server,
  },
  {
    id: 10,
    tag: "246bd",
    ip: "192.168.15.81",
    host_server: "192.168.15.72",
    host_port: "8888",
    internal: "192.168.15.81",
    external_ip: "",
    listener: "tcp",
    privilege: "user",
    notes: null,
    process: null,
    pid: 623094,
    arch: "x64",
    os: "Kali GNU/Linux Rolling",
    user: "root",
    hostname: "kali",
    first_seen: "2026-09-06 06:23:41.852676",
    last_seen: "2026-09-06 06:48:25.781908",
    last_activity: "10h",
    delay: 2,
    implant_config:
      '{"channel":"tcp","host":"192.168.15.72","port":"8888","host_tag":"246bd","delay":2}',
    _server: demo_server,
  },
  {
    id: 11,
    tag: "600d4",
    ip: "192.168.15.74",
    host_server: "192.168.15.72",
    host_port: "445",
    internal: "192.168.15.74",
    external_ip: "",
    listener: "smb",
    privilege: "admin",
    notes: null,
    process: null,
    pid: 688,
    arch: "x64",
    os: "Windows 10 Pro",
    user: "Lab",
    hostname: "DESKTOP-B08TFNF",
    first_seen: "2026-09-06 06:38:21.270636",
    last_seen: "2026-09-06 07:27:51.407361",
    last_activity: "9h",
    delay: 2,
    implant_config:
      '{"channel":"smb","host":"192.168.15.72","port":"445","host_tag":"600d4","delay":2,"syscall_method":"indirect"}',
    _server: demo_server,
  },
  {
    id: 12,
    tag: "27e7a",
    ip: "10.0.2.15",
    host_server: "192.168.15.10",
    host_port: "9090",
    internal: "10.0.2.15",
    external_ip: "",
    listener: "http",
    privilege: "user",
    notes: null,
    process: null,
    pid: 811,
    arch: "x64",
    os: "macOS 10.16",
    user: "lab",
    hostname: "Labs-iMac-Pro.local",
    first_seen: "2026-09-06 06:40:44.255209",
    last_seen: "2026-09-06 06:48:09.939776",
    last_activity: "10h",
    delay: 2,
    implant_config:
      '{"channel":"http","delay":2,"host":"192.168.15.10","host_tag":"27e7a","port":"9090"}',
    _server: demo_server,
  },
];

export type HostSelectData = { host: Host; server: string } | null;

export interface HostSelectBoxProps {
  onSelect?: (data: HostSelectData) => void;
  hide?: boolean;
}

export interface WorkspaceProps {
  setWindows: (hasWindows: boolean) => void;
  pendingWindow?: string | null;
  onWindowOpen?: () => void;
}

export type WorkspaceHandle = { openWindow: (windowType: string) => void };

const hostless_titles = new Set(["Graphs", "Hosts"]);

export function getPanelTitle(windowType: string): string {
  return windowType.charAt(0).toUpperCase() + windowType.slice(1);
}

export function shouldShowHostSelect(title: string | undefined): boolean {
  return !hostless_titles.has(title ?? "");
}

export function getPanelHeaderJustify(title: string | undefined): "left" | "between" {
  return hostless_titles.has(title ?? "") ? "left" : "between";
}

type panel_layout = {
  initialWidth?: number;
  initialHeight?: number;
  minimumWidth?: number;
  minimumHeight?: number;
  maximumWidth?: number;
  maximumHeight?: number;
};

const demo_panel_layout: Record<string, panel_layout> = {
  screenshot: {
    initialWidth: 650,
    initialHeight: 468,
    minimumWidth: 550,
    minimumHeight: 180,
  },
  graphs: {
    initialWidth: 350,
    initialHeight: 360,
    minimumWidth: 550,
    minimumHeight: 180,
  },
  terminal: {
    initialWidth: 500,
    initialHeight: 468,
    minimumWidth: 220,
    minimumHeight: 180,
  },
  process: {
    initialWidth: 500,
    initialHeight: 360,
    minimumWidth: 220,
    minimumHeight: 180,
  },
};

const panelLayout = (id: string): panel_layout => demo_panel_layout[id] ?? {};

function initDefaultPanels(api: any) {
  api.addPanel({
    id: "terminal",
    component: "terminal",
    tabComponent: "header",
    title: getPanelTitle("terminal"),
    ...panelLayout("terminal"),
  });

  api.addPanel({
    id: "screenshot",
    component: "screenshot",
    tabComponent: "header",
    title: getPanelTitle("screenshot"),
    position: { referencePanel: "terminal", direction: "left" },
    ...panelLayout("screenshot"),
  });

  api.addPanel({
    id: "graphs",
    component: "graphs",
    tabComponent: "header",
    title: getPanelTitle("graphs"),
    position: { referencePanel: "screenshot", direction: "below" },
    ...panelLayout("graphs"),
  });

  api.addPanel({
    id: "process",
    component: "process",
    tabComponent: "header",
    title: getPanelTitle("process"),
    position: { referencePanel: "terminal", direction: "below" },
    ...panelLayout("process"),
  });
}

export function useWorkspace(
  { setWindows, pendingWindow, onWindowOpen }: WorkspaceProps,
  ref: Ref<WorkspaceHandle>
) {
  const dockviewRef = useRef<any>(null);

  const addPanel = (windowType: string) => {
    if (!dockviewRef.current) return;
    dockviewRef.current.addPanel({
      id: `${windowType}-${Date.now()}`,
      component: windowType,
      tabComponent: "header",
      title: getPanelTitle(windowType),
      position: { direction: "right" },
    });
  };

  useImperativeHandle(ref, () => ({
    openWindow: addPanel,
  }));

  const onDockviewReady = (event: { api: any }) => {
    const api = event.api;
    dockviewRef.current = api;
    api.onDidAddPanel(() => setWindows(api.panels.length > 0));
    api.onDidRemovePanel(() => setWindows(api.panels.length > 0));

    if (api.panels.length === 0) {
      initDefaultPanels(api);
      setWindows(true);
    }

    if (pendingWindow) {
      addPanel(pendingWindow);
      onWindowOpen?.();
    }
  };

  return { onDockviewReady };
}

export function useHostSelect(onSelect?: (data: HostSelectData) => void) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const defaultHost = demo_hosts.find((host) => host.tag === "47334");
  const [value, setValue] = useState(defaultHost ? String(defaultHost.id) : "");
  const [hosts, setHosts] = useState<Host[]>(demo_hosts);
  const loading = false;
  const response = { status: "success" as const };

  const loadHosts = () => {
    setHosts(demo_hosts);
  };

  const groups = hosts.reduce<Record<string, Host[]>>((acc, host) => {
    const key = host._server ?? "Unknown";
    (acc[key] ??= []).push(host);
    return acc;
  }, {});

  const selectedHost = hosts.find((h) => String(h.id) === value);

  const selectHost = (host: Host, server: string) => {
    if (value === String(host.id)) {
      setValue("");
      onSelect?.(null);
    } else {
      setValue(String(host.id));
      onSelect?.({ host, server });
    }
    setOpen(false);
  };

  return {
    id,
    open,
    setOpen,
    value,
    loading,
    response,
    groups,
    selectedHost,
    loadHosts,
    selectHost,
  };
}
