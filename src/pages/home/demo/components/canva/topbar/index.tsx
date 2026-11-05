import { useState } from "react";
import {
  SquareChevronRight,
  Share2,
  Cpu,
  Folder,
  Bug,
  Network,
  Server,
  Plus,
  X,
  Headphones,
  MonitorIcon,
  Info,
  Keyboard,
  CodeXml,
  LogOut,
  Bot,
  Camera,
  KeyRound,
  Globe,
  CodeXmlIcon,
  Scale,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Fullscreen,
  Logs,
  FileText,
  Command,
  MessageCircleMore,
  Fingerprint,
  Download,
} from "lucide-react";
import type { WorkspaceTab } from "../logic";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/pages/home/demo/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/pages/home/demo/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/pages/home/demo/components/ui/popover";
import { LuSquareCode } from "react-icons/lu";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GrHelpBook } from "react-icons/gr";
import logoSvg from "@/pages/home/demo/assets/logo.svg";

interface MainProps {
  workspaceTabs: WorkspaceTab[];
  activeTabId: string;
  onTabSelect: (id: string) => void;
  onTabAdd: () => void;
  onTabClose: (id: string) => void;
}

const preventMenuClose = (event: { preventDefault: () => void }) => {
  event.preventDefault();
};

const blockPointer = (event: React.MouseEvent) => {
  event.preventDefault();
};

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPod|iPad/i.test(navigator.platform);

const modToken = isMac ? "⌘" : "Ctrl";
const altToken = isMac ? "⌥" : "Alt";

const shortcutHints = {
  terminal: `${altToken}+T`,
  explorer: `${altToken}+F`,
  process: `${altToken}+R`,
  sessions: `${altToken}+S`,
  agent: `${altToken}+A`,
  credentials: `${altToken}+K`,
  servers: "Shift+S",
  listeners: "Shift+L",
  implants: "Shift+I",
  network: "Shift+N",
  queue: "Shift+Q",
  logs: "Shift+E",
  docs: "F1",
  quit: `${modToken}+Shift+Q`,
  view_zoom_in: `${modToken} +`,
  view_zoom_out: `${modToken} -`,
  view_zoom_reset: `${modToken}+0`,
  view_fullscreen: "F11",
  view_devtools: `${modToken}+Shift+I`,
} as const;

function ShortcutHint({ id }: { id: keyof typeof shortcutHints }) {
  return <span className="canva-shortcut-hint">{shortcutHints[id]}</span>;
}

export default function TopBar(props: MainProps) {
  return (
    <div className="bg-color-workspace">
      <div
        style={{ borderRadius: ".45rem" }}
        className="m3vqw bg-color-workspace"
      >
        <div className="ml-2 mr-2 inline-flex items-center gap-2 text-[13.5px] leading-none primary-text">
          <img
            src={logoSvg}
            alt=""
            className="h-[1em] w-auto shrink-0 opacity-70 object-contain"
          />
          <span className="font-bold tracking-[0.18em]">NUKERAT</span>
        </div>
        <div className="w-px h-4 bg-[#292929] mr-4 ml-4 shrink-0" />

        <TopBarMenu label="NukeRat">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Server size={13} />
                Servers
              </span>
              <ShortcutHint id="servers" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Headphones size={14} />
                Listeners
              </span>
              <ShortcutHint id="listeners" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Bug size={13} />
                Implants
              </span>
              <ShortcutHint id="implants" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Network size={13} />
                Network
              </span>
              <ShortcutHint id="network" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={preventMenuClose}>
              <Bot size={13} />
              Agents
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={preventMenuClose}>
              <CodeXmlIcon size={13} />
              NukeScripts
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={preventMenuClose}>
              <HiOutlineDocumentReport size={13} />
              Reports
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={preventMenuClose}>
              <Fingerprint size={13} />
              IOCs
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Logs size={13} />
                Queue
              </span>
              <ShortcutHint id="queue" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <FileText size={13} />
                Event Log
              </span>
              <ShortcutHint id="logs" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <LogOut size={13} />
                Quit
              </span>
              <ShortcutHint id="quit" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </TopBarMenu>

        <TopBarMenu label="View">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Fullscreen size={13} />
                Full Screen
              </span>
              <ShortcutHint id="view_fullscreen" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <ZoomIn size={13} />
                Zoom In
              </span>
              <ShortcutHint id="view_zoom_in" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <ZoomOut size={13} />
                Zoom Out
              </span>
              <ShortcutHint id="view_zoom_out" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <RotateCcw size={13} />
                Reset Zoom
              </span>
              <ShortcutHint id="view_zoom_reset" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <CodeXml size={13} />
                Devtools
              </span>
              <ShortcutHint id="view_devtools" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </TopBarMenu>

        <TopBarMenu label="Tabs">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <SquareChevronRight size={13} />
                Terminal
              </span>
              <ShortcutHint id="terminal" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Folder size={13} />
                File Browser
              </span>
              <ShortcutHint id="explorer" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Cpu size={13} />
                Processes
              </span>
              <ShortcutHint id="process" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={preventMenuClose}>
              <Camera size={13} />
              Screenshot
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={preventMenuClose}>
              <Keyboard size={13} />
              Keystrokes
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <KeyRound size={13} />
                Credentials
              </span>
              <ShortcutHint id="credentials" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <MonitorIcon size={13} />
                Sessions
              </span>
              <ShortcutHint id="sessions" />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={preventMenuClose}>
              <Share2 size={13} />
              Attack Graph
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <Bot size={13} />
                AI Agent
              </span>
              <ShortcutHint id="agent" />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={preventMenuClose}>
              <Globe size={13} />
              File Server
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={preventMenuClose}>
              <LuSquareCode size={13} />
              NS Debugger
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </TopBarMenu>

        <TopBarMenu label="Help">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex w-full items-center justify-between gap-2"
              onSelect={preventMenuClose}
            >
              <span className="flex items-center gap-2">
                <GrHelpBook size={13} />
                Documentation
              </span>
              <ShortcutHint id="docs" />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={preventMenuClose}>
              <Command size={13} />
              Shortcuts
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={preventMenuClose}>
              <MessageCircleMore size={13} />
              Feedbacks
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={preventMenuClose}>
              <Scale size={13} />
              License
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={preventMenuClose}>
              <Info size={10} />
              About
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </TopBarMenu>

        <div className="w-px h-4 bg-[#292929] mr-4 ml-4 shrink-0" />

        <NavItem
          type="icons-only"
          icon={<SquareChevronRight size={18.5} />}
          label="Terminal"
          title="Terminal"
          desc="Interactive session console"
        />
        <NavItem
          type="icons-only"
          icon={<Folder size={18.5} />}
          label="File Browser"
          title="File Browser"
          desc="Browse files on the active host"
        />
        <NavItem
          type="icons-only"
          icon={<Cpu size={18.5} />}
          label="Processes"
          title="Processes"
          desc="View and manage host processes"
        />

        <div className="w-px h-4 bg-[#292929] mr-4 ml-4 shrink-0" />

        <NavItem
          type="icons-only"
          icon={<Camera size={20} />}
          label="Screenshot"
          title="Screenshot"
          desc="Capture remote desktop view"
        />
        <NavItem
          type="icons-only"
          icon={<Keyboard size={18.5} />}
          label="Keylogger"
          title="Keylogger"
          desc="Capture keyboard events"
        />
        <NavItem
          type="icons-only"
          icon={<KeyRound size={18.5} />}
          label="Credentials"
          title="Credentials"
          desc="Manage stored credentials"
        />

        <div className="w-px h-4 bg-[#292929] mr-4 ml-4 shrink-0" />

        <NavItem
          type="icons-only"
          icon={<MonitorIcon size={18.5} />}
          label="Sessions"
          title="Sessions"
          desc="View active sessions"
        />
        <NavItem
          type="icons-only"
          icon={<Share2 size={18.5} />}
          label="Attack Graph"
          title="Attack Graph"
          desc="Visualize lateral movement and pivots"
        />

        <div className="w-px h-4 bg-[#292929] mr-4 ml-4 shrink-0" />

        <NavItem
          type="icons-only"
          icon={<Bot size={22} />}
          label="AI Agent"
          title="AI Agent"
          desc="AI-assisted session operations"
        />
        <NavItem
          type="icons-only"
          icon={<Globe size={18.5} />}
          label="File Server"
          title="File Server"
          desc="Team server file staging"
        />

        <DownloadsTopbarButton />

        <div className="w-px h-4 bg-[#292929] mr-4 ml-4 shrink-0" />

        {props.workspaceTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onMouseDown={blockPointer}
            style={{ fontWeight: "500", padding: "0px 7px 0px 7px" }}
            className={`button-default text-[.8rem] ml-0.5 cursor-pointer group flex items-center gap-1.5 px-2 py-0.5 rounded font-medium whitespace-nowrap transition-colors ${
              tab.id === props.activeTabId
                ? "bg-[#2a2a2a] primary-text border border-[#3a3a3a]"
                : "primary-text hover:text-[#a0a0a0] hover:bg-[#1e1e1e] border border-transparent"
            }`}
          >
            <span>{tab.name}</span>
            {props.workspaceTabs.length > 1 && (
              <span
                onMouseDown={blockPointer}
                className="group-hover:opacity-100 hover:text-red-400 transition rounded p-0.5"
              >
                <X size={13} />
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={blockPointer}
          title="New workspace"
          className="button-default p-1 rounded text-[#6b6b6b] hover:text-[#a0a0a0] hover:bg-[#1e1e1e] transition-colors"
        >
          <Plus size={17} />
        </button>

        <div className="flex-1" />
      </div>
    </div>
  );
}

function DownloadsTopbarButton() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="button-default hover:underline cursor-pointer flex items-center gap-1.5 px-3 py-2 text-[1rem] primary-text rounded font-medium"
            >
              <Download size={18.5} />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="topbar-nav-tooltip bg-[#3A3A3A] flex flex-col items-start gap-1 text-left"
          style={{ borderRadius: "7px" }}
        >
          <div className="font-semibold text-xs text-left w-full">Downloads</div>
          <div className="text-xs opacity-90 text-left w-full">Recent download history</div>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="downloads-popover text-[#d4d4d4] w-[13rem] overflow-hidden p-0 !ring-0"
      >
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 select-none">
          <span className="cursor-default text-[13px] font-medium text-[#cecece]">Downloads</span>
          <button
            type="button"
            aria-label="Close downloads"
            className="button-default shrink-0 p-1 rounded text-[#888888] hover:text-[#d4d4d4] hover:bg-[#2a2a2a] transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-0"
            onClick={() => setOpen(false)}
          >
            <X size={13} />
          </button>
        </div>
        <div className="downloads-popover-list max-h-[13rem] overflow-y-auto overflow-x-hidden select-none cursor-default">
          <p className="px-3 py-8 text-center text-[12px] text-[#8a8a8a]">No downloads</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TopBarMenu({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="ml-0.5 mr-0.5 font-[400] flex items-center gap-1.5 cursor-pointer rounded px-2 py-1 text-[13.5px] primary-text">
          <span>{label}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={0}
        className="topbar-menu-dropdown rounded-[8px] p-1 [&_[data-slot=dropdown-menu-group]]:w-full [&_[data-slot=dropdown-menu-sub-trigger]]:w-full"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavItem({
  type,
  icon,
  label,
  title,
  desc,
}: {
  type?: string;
  icon: React.ReactNode;
  label: string;
  title?: string;
  desc?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onMouseDown={blockPointer}
          className="button-default hover:underline cursor-pointer flex items-center gap-1.5 px-3 py-2 text-[1rem] primary-text rounded font-medium"
        >
          {icon}
          {type !== "icons-only" && label}
        </button>
      </TooltipTrigger>
      {title && desc && (
        <TooltipContent
          side="bottom"
          className="topbar-nav-tooltip bg-[#3A3A3A] flex flex-col items-start gap-1 text-left"
          style={{ borderRadius: "7px" }}
        >
          <div className="font-semibold text-xs text-left w-full">{title}</div>
          <div className="text-xs opacity-90 text-left w-full">{desc}</div>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
