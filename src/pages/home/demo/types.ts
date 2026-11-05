export interface Host {
  id: number;
  tag: string;
  ip: string;
  internal?: string;
  external_ip?: string;
  listener?: string;
  privilege?: string | null;
  notes?: string | null;
  process?: string | null;
  pid?: number | null;
  arch?: string;
  os: string;
  user?: string;
  hostname?: string;
  first_seen: string;
  last_seen: string;
  last_activity?: string;
  delay: number;
  host_server?: string;
  host_port?: string;
  implant_config: string;
  _server?: string;
}

export interface ServerEntry {
  id: string;
  name: string;
  ip: string;
  port: string;
  aesKey: string;
  secret: string;
}

export type GraphHost = Host;

export interface GraphServerData {
  server: string;
  chains: string[];
  data: Record<string, GraphHost>;
}

export interface CredentialEntry {
  id: string;
  name: string;
  server: string;
  host: string;
  desc: string;
  content?: string;
}

export function isCredentialSuccess(status?: string) {
  return status === "success" || status === "successfull";
}

export interface ProcessNode {
  pid: number;
  name: string;
  path: string;
  cpu: number;
  memory: number;
  user: string;
  integrity: string;
  session: number;
  arch: string;
  network: string;
  privilege: string;
  children?: ProcessNode[];
}

export type QueueItem = {
  id: string;
  tag: string;
  hostTag: string;
  host: string;
  type: string;
  input: string;
  parameters: string;
  isCompleted: number;
  error: string;
  captured: number;
  createdAt: string;
  output?: string;
  server?: string;
};

export type KeyloggerItem = {
  id: string;
  hora: string;
  hostTag: string;
  host: string;
  content: string;
  server?: string;
};

export type IocItem = {
  id: string;
  tag: string;
  type: string;
  value: string;
  hostTag: string;
  createdAt: string;
  server?: string;
};

export interface ScriptEntry {
  id: string;
  tag?: string;
  name: string;
  description: string;
  content?: string;
  status?: number;
  last_run?: string;
  errors_count?: number;
  success_count?: number;
  created_at?: string;
  server: string;
}

export type ReportType = "activity" | "hosts" | "ioc";

export interface ReportEntry {
  id: string;
  name: string;
  description: string;
  reportType: ReportType | string;
  hosts: string[];
  file?: string;
  created_at?: string;
  server?: string;
}

export type NetworkFormData = {
  networkType: "port_forwarding" | "socks";
  host: string;
  port: string;
  targetPort: string;
  protocol: "tcp" | "udp";
  authUser: string;
  authPass: string;
  hostTag: string;
  forwardHost: string;
  forwardPort: string;
};

export interface Connection {
  id?: string;
  session_id?: string;
  networkType?: "port_forwarding" | "socks";
  host?: string;
  targetPort?: string | number;
  protocol?: string;
  authUser?: string;
  authPass?: string;
  hostTag?: string;
  forwardHost?: string;
  forwardPort?: string | number;
  server?: string;
}

export type NsOutputItem = {
  id: string;
  tag: string;
  content: string;
  time?: string;
  server?: string;
};

export type NotifyHost = {
  tag: string;
  ip: string;
  os: string;
  hostname: string;
  first_seen: string | null;
  last_seen: string | null;
  delay: number;
};

export type NotifyCustom = {
  tag: string;
  title: string | null;
  type: string;
  description: string | null;
  created_at: string | null;
};

export type ConnectionStatus = "idle" | "checking" | "online" | "offline";
