import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Host } from "@/pages/home/demo/types";

const DEMO_FOLDERS: unknown[] = [
  {
    "C:": {
      "$Recycle.Bin": { type: "folder", size: "2" },
      "Documents and Settings": { type: "folder", size: "0" },
      "DumpStack.log.tmp": { type: "file", size: "8.0K" },
      inetpub: { type: "folder", size: "0" },
      "pagefile.sys": { type: "file", size: "704.0M" },
      PerfLogs: { type: "folder", size: "0" },
      "Program Files": { type: "folder", size: "33" },
      "Program Files (x86)": { type: "folder", size: "25" },
      ProgramData: { type: "folder", size: "19" },
      Recovery: { type: "folder", size: "1" },
      SQL2025: { type: "folder", size: "4" },
      "swapfile.sys": { type: "file", size: "16.0M" },
      "System Volume Information": { type: "folder", size: "0" },
      Users: { type: "folder", size: "6" },
      Windows: { type: "folder", size: "102" },
    },
    "D:": { type: "folder", size: "0" },
  },
];

const DEMO_INITIAL_PATH = ["C:"] as string[];

// types -----------------------------------------------------------------------

export type ViewMode = "grid" | "list";

export interface FileContentData {
  content: string;
  fileName: string;
  contentB64: string;
}

// path ------------------------------------------------------------------------

export function buildPathString(path: string[]): string | undefined {
  if (!path.length) return undefined;
  if (/^[A-Za-z]:$/.test(path[0])) return path.join("\\");
  return `/${path.join("/")}`;
}

export function formatPathDisplay(path: string[]): string {
  if (!path.length) return "/";
  if (/^[A-Za-z]:$/.test(path[0])) return path.join("\\");
  return `/${path.join("/")}`;
}

// tree ------------------------------------------------------------------------

export function isFile(node: unknown): boolean {
  return (node as { type?: string })?.type === "file";
}

export function getChildren(node: unknown): [string, unknown][] {
  if (!node || typeof node !== "object") return [];
  return Object.entries(node).filter(
    ([k, v]) => k !== "expanded" && typeof v === "object" && v !== null
  ) as [string, unknown][];
}

export function getNodeAtPath(folders: unknown[], path: string[]): unknown | null {
  if (!folders.length) return null;
  let node: unknown = folders[0];
  for (const segment of path) {
    if (!node || typeof node !== "object" || (node as Record<string, unknown>)[segment] === undefined) {
      return null;
    }
    node = (node as Record<string, unknown>)[segment];
  }
  return node;
}

export function filterTree(node: unknown, query: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [name, val] of getChildren(node)) {
    if (name.toLowerCase().includes(query.toLowerCase())) {
      result[name] = val;
    } else if (!isFile(val)) {
      const filtered = filterTree(val, query);
      if (Object.keys(filtered).length > 0) result[name] = filtered;
    }
  }
  return result;
}

export function allFolderKeys(node: unknown, prefix: string[] = []): string[] {
  const keys: string[] = [];
  for (const [name, val] of getChildren(node)) {
    if (!isFile(val)) {
      const p = [...prefix, name];
      keys.push(p.join("/"));
      keys.push(...allFolderKeys(val, p));
    }
  }
  return keys;
}

export function getItemSubtitle(name: string, nodeVal: unknown, fileNode: boolean): string {
  const raw = (nodeVal as { size?: unknown })?.size ?? "0";
  if (fileNode) return String(raw);
  const folderCount = Number.parseInt(String(raw), 10);
  return Number.isNaN(folderCount) ? `${raw} items` : `${folderCount} ${folderCount === 1 ? "item" : "items"}`;
}

// base64 / download -----------------------------------------------------------

export function getBase64Bytes(value: string): Uint8Array | null {
  if (!value || !value.trim()) return null;
  try {
    const binary = atob(value);
    return Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  } catch {
    return null;
  }
}

export function hasValidBase64Content(value: string): boolean {
  return getBase64Bytes(value) !== null;
}

export function isImage(contentB64: string): string | null {
  const bytes = getBase64Bytes(contentB64);
  if (!bytes || bytes.length < 3) return null;

  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  ) {
    return "image/gif";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
    return "image/bmp";
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
    return "image/x-icon";
  }

  return null;
}

export function downloadBase64File(
  contentB64: string,
  fileName: string,
  mimeType = "application/octet-stream"
): boolean {
  const bytes = getBase64Bytes(contentB64);
  if (!bytes) return false;

  const safeName = fileName?.trim() || "download";
  const blob = new Blob([new Uint8Array(bytes)], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  return true;
}

// resize ----------------------------------------------------------------------

export function useHorizontalResize(
  initialWidth = 220,
  min = 120,
  max = 280,
  minRemaining = 120,
) {
  const [width, setWidth] = useState(initialWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResize = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const next = startWidth + (moveEvent.clientX - startX);
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const maxWidth = containerWidth > 0
        ? Math.min(max, containerWidth - minRemaining)
        : max;
      setWidth(Math.max(min, Math.min(maxWidth, next)));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return { width, startResize, containerRef };
}

// truncated names -------------------------------------------------------------

export function useTruncatedNames(deps: unknown[]) {
  const [truncatedNames, setTruncatedNames] = useState<Record<string, boolean>>({});
  const nameRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const updateTruncation = (key: string) => {
    const el = nameRefs.current[key];
    if (!el) return;
    const truncated = el.scrollWidth > el.clientWidth;
    setTruncatedNames((prev) => (prev[key] === truncated ? prev : { ...prev, [key]: truncated }));
  };

  const attachNameRef = (key: string) => (el: HTMLSpanElement | null) => {
    nameRefs.current[key] = el;
    if (el) updateTruncation(key);
  };

  useEffect(() => {
    const recalc = () => Object.keys(nameRefs.current).forEach(updateTruncation);
    const id = window.setTimeout(recalc, 0);
    window.addEventListener("resize", recalc);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", recalc);
    };
  }, deps);

  return { attachNameRef, isTruncated: (key: string) => !!truncatedNames[key] };
}

// content preview -------------------------------------------------------------

export const ONE_MB_APPROX_CHARS = 1024 * 1024;
export const CHUNK_MODE_THRESHOLD = 10 * 1024 * 1024;
export const CHUNK_SIZE = 2048;

export function useContentPreview(content: string, fileKey?: string) {
  const [allowLargePreview, setAllowLargePreview] = useState(false);

  useEffect(() => {
    setAllowLargePreview(false);
  }, [fileKey, content.length]);

  const isLargeContent = content.length >= ONE_MB_APPROX_CHARS;
  const useChunkMode = content.length >= CHUNK_MODE_THRESHOLD;

  const lines = useMemo(() => {
    if (useChunkMode) return [] as string[];
    return content.split(/\r?\n/);
  }, [content, useChunkMode]);

  const chunkCount = useChunkMode ? Math.ceil(content.length / CHUNK_SIZE) : 0;

  return {
    allowLargePreview,
    setAllowLargePreview,
    isLargeContent,
    useChunkMode,
    lines,
    chunkCount,
  };
}

// left tree -------------------------------------------------------------------

export function useLeftSideTree(folders: unknown[], currentPath: string[]) {
  const rootNode = (folders[0] ?? {}) as Record<string, unknown>;
  const allExpanded = useMemo(() => new Set(allFolderKeys(rootNode)), [rootNode]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(allExpanded);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setExpandedPaths(allExpanded);
  }, [allExpanded]);

  const toggle = useCallback((key: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const displayNode = useMemo(
    () => (search ? filterTree(rootNode, search) : rootNode),
    [rootNode, search]
  );
  const displayExpanded = useMemo(
    () => (search ? new Set(allFolderKeys(displayNode)) : expandedPaths),
    [search, displayNode, expandedPaths]
  );
  const rootEntries = useMemo(() => getChildren(displayNode), [displayNode]);

  return { search, setSearch, displayExpanded, rootEntries, toggle };
}

export function useTreeNodeClick(
  isFileNode: boolean,
  path: string[],
  pathKey: string,
  isOpen: boolean,
  onExpand: (path: string[]) => void,
  onToggle: (key: string) => void,
  onFileClick: (path: string[]) => void
) {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
  };

  const handleClick = () => {
    if (isFileNode) {
      onFileClick(path);
      return;
    }
    clearTimer();
    clickTimer.current = setTimeout(() => onExpand(path), 200);
  };

  const handleDoubleClick = () => {
    clearTimer();
    if (!isFileNode) {
      onToggle(pathKey);
      onExpand(path);
    }
  };

  const handleChevronClick = () => {
    clearTimer();
    if (isFileNode) return;
    onToggle(pathKey);
    if (!isOpen) onExpand(path);
  };

  return { handleClick, handleDoubleClick, handleChevronClick };
}

// right panel -----------------------------------------------------------------

export function useRightSidePath(currentPath: string[], onPathSubmit: (path: string) => Promise<boolean>) {
  const pathDisplay = formatPathDisplay(currentPath);
  const [inputValue, setInputValue] = useState(pathDisplay);

  useEffect(() => {
    setInputValue(pathDisplay);
  }, [pathDisplay]);

  const handlePathSubmit = useCallback(async () => {
    await onPathSubmit(inputValue);
  }, [inputValue, onPathSubmit]);

  return { inputValue, setInputValue, handlePathSubmit };
}

export function useRightSideItems(folders: unknown[], currentPath: string[]) {
  return useMemo(() => {
    const node = getNodeAtPath(folders, currentPath);
    return node ? getChildren(node) : [];
  }, [folders, currentPath]);
}

// folders window --------------------------------------------------------------

export function useFoldersWindow(selectedHost?: { host: Host; server: string } | null) {
  const hostUnavailable = !selectedHost;
  const [folders, setFolders] = useState<unknown[]>(DEMO_FOLDERS);
  const { width: leftWidth, startResize, containerRef } = useHorizontalResize(120, 120, 280);
  const [currentPath, setCurrentPath] = useState<string[]>(DEMO_INITIAL_PATH);
  const [history, setHistory] = useState<string[][]>([DEMO_INITIAL_PATH]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [autoRefresh, setautoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState<FileContentData | null>(null);

  useEffect(() => {
    setFolders(DEMO_FOLDERS);
    setCurrentPath(DEMO_INITIAL_PATH);
    setHistory([DEMO_INITIAL_PATH]);
    setHistoryIndex(0);
    setFileContent(null);
  }, [selectedHost]);

  const fetchFolders = useCallback((_path: string[] = []) => {
    setFolders(DEMO_FOLDERS);
    setLoading(false);
  }, []);

  const navigateTo = useCallback(
    (path: string[]) => {
      setFileContent(null);
      setCurrentPath(path);
      const base = history.slice(0, historyIndex + 1);
      setHistory([...base, path]);
      setHistoryIndex(base.length);
    },
    [history, historyIndex]
  );

  const onExpand = useCallback(
    (path: string[]) => {
      fetchFolders(path);
      navigateTo(path);
    },
    [fetchFolders, navigateTo]
  );

  const onFileClick = useCallback(
    (path: string[]) => {
      if (!selectedHost) return;
      setLoading(true);
      const fallbackName = path[path.length - 1] ?? "download";
      setFileContent({
        content: "Demo file content\n",
        fileName: fallbackName,
        contentB64: "",
      });
      setLoading(false);
    },
    [selectedHost]
  );

  const onPathSubmit = useCallback(
    (rawPath: string): Promise<boolean> => {
      if (!selectedHost) return Promise.resolve(false);
      const trimmedPath = rawPath.trim();
      const nextPath = trimmedPath.split(/[/\\]/).filter(Boolean);
      setFolders(DEMO_FOLDERS);
      navigateTo(nextPath);
      return Promise.resolve(true);
    },
    [selectedHost, navigateTo]
  );

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setFileContent(null);
      setHistoryIndex(idx);
      setCurrentPath(history[idx]);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setFileContent(null);
      setHistoryIndex(idx);
      setCurrentPath(history[idx]);
    }
  }, [history, historyIndex]);

  const canDownloadFile = !!fileContent && hasValidBase64Content(fileContent.contentB64);

  const onDownloadFile = useCallback(() => {
    if (!fileContent) return;
    downloadBase64File(fileContent.contentB64, fileContent.fileName);
  }, [fileContent]);

  return {
    hostUnavailable,
    folders,
    leftWidth,
    startResize,
    containerRef,
    currentPath,
    viewMode,
    loading,
    fileContent,
    autoRefresh,
    setautoRefresh,
    setViewMode,
    onExpand,
    onFileClick,
    onPathSubmit,
    goBack,
    goForward,
    canBack: historyIndex > 0,
    canForward: historyIndex < history.length - 1,
    canDownloadFile,
    onDownloadFile,
    fetchFolders,
    setLoading,
  };
}
