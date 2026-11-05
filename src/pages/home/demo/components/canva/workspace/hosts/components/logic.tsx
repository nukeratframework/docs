import { useMemo, useState, type CSSProperties } from "react";
import type { Host } from "@/pages/home/demo/types";
import linuxHostRootSvg from "@/pages/home/demo/assets/icons/hosts/linux_root.svg";
import linuxHostSvg from "@/pages/home/demo/assets/icons/hosts/linux.svg";
import macHostRootSvg from "@/pages/home/demo/assets/icons/hosts/mac_root.svg";
import macHostSvg from "@/pages/home/demo/assets/icons/hosts/mac.svg";
import unknownHostRootSvg from "@/pages/home/demo/assets/icons/hosts/unknown_root.svg";
import unknownHostSvg from "@/pages/home/demo/assets/icons/hosts/unknown.svg";
import windowsHostRootSvg from "@/pages/home/demo/assets/icons/hosts/windows_root.svg";
import windowsHostSvg from "@/pages/home/demo/assets/icons/hosts/windows.svg";

const DEMO_SERVER = "192.168.15.10:9090";

const DEMO_HOSTS: Host[] = [
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
    _server: DEMO_SERVER,
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
    _server: DEMO_SERVER,
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
    _server: DEMO_SERVER,
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
    _server: DEMO_SERVER,
  },
];

const icons = {
  windows: { n: windowsHostSvg, r: windowsHostRootSvg },
  linux: { n: linuxHostSvg, r: linuxHostRootSvg },
  mac: { n: macHostSvg, r: macHostRootSvg },
  unknown: { n: unknownHostSvg, r: unknownHostRootSvg },
};

const UTC_TABLE_COLUMN_SUFFIX = " (UTC)";

export function utcTableColumnTitle(base: string) {
  return `${base}${UTC_TABLE_COLUMN_SUFFIX}`;
}

export function UtcTableColumnHeader({ label }: { label: string }) {
  if (!label.endsWith(UTC_TABLE_COLUMN_SUFFIX)) return label;
  const base = label.slice(0, -UTC_TABLE_COLUMN_SUFFIX.length);
  return (
    <>
      {base}
      <span className="text-[#555]">{UTC_TABLE_COLUMN_SUFFIX}</span>
    </>
  );
}

const DISPLAY_DATETIME_RE = /^(\d{4})\/(\d{2})\/(\d{2}) - (\d{2}):(\d{2})$/;

export function formatUtcDateOnly(raw?: string | null): string {
  if (!raw?.trim()) return "-";
  const s = raw.trim();
  if (DISPLAY_DATETIME_RE.test(s)) return s;
  const m = s.replace(/\s*UTC\s*$/i, "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const iso = /[zZ]|[+-]\d{2}:\d{2}$/.test(s) ? s : `${s}Z`;
  const d = new Date(iso);
  if (!isNaN(d.getTime())) {
    const y = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${mo}-${dd}`;
  }
  return s;
}

export const tableColumns = [
  "Platform",
  utcTableColumnTitle("Last Check"),
  "Tag",
  "Hostname",
  "User",
  "Privilege",
  "Internal",
  "External",
  "Listener",
  "PID",
  "Process",
  "Note",
];

export const formatProcess = (v?: string | null) => {
  const s = (v ?? "").trim();
  return s ? s : "-";
};

export const tableCellTruncate = "inline-block max-w-[30ch] truncate align-middle";

export const formatDate = (raw?: string | null) => {
  if (!raw) return "-";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `${hh}:${mm} ${dd}/${mo}/${yy}`;
};

export const hostIcon = (h: Host) => {
  const os = (h.os ?? "").toLowerCase();
  let f: keyof typeof icons = "unknown";
  if (/\b(win|windows|microsoft)\b/.test(os)) f = "windows";
  else if (/\b(mac|macos|osx|darwin)\b/.test(os)) f = "mac";
  else if (/\b(linux|ubuntu|debian|fedora|arch|centos|kali|android)\b/.test(os)) f = "linux";
  let root = false;
  try {
    const r = JSON.parse(h.implant_config ?? "{}")?.root;
    root = r === true || r === 1 || /^(true|1|yes)$/i.test(String(r ?? "").trim());
  } catch {}
  return icons[f][root ? "r" : "n"];
};

export function useHostPanel() {
  const hosts = DEMO_HOSTS;
  const loading = false;
  const selectedId = null;
  const panelOpen = false;
  const showDeleteConfirm = false;
  const [search, setSearch] = useState("");

  const selected = hosts.find((h) => h.id === selectedId) ?? null;

  const filteredHosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hosts;
    return hosts.filter((h) =>
      [h.tag, h.ip, h.internal, h.external_ip, h.listener, h.host_server, h.host_port, h.user, h.hostname, h.notes, h.arch, h.os, h.privilege, h._server].some((v) =>
        String(v ?? "").toLowerCase().includes(q)
      )
    );
  }, [hosts, search]);

  const panelStyle = {} as CSSProperties;

  return {
    filteredHosts,
    loading,
    search,
    selectedId,
    panelOpen,
    showDeleteConfirm,
    selected,
    panelStyle,
    setSearch,
  };
}
