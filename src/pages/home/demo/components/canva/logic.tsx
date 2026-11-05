import { useState, useRef, useEffect } from "react";
import type { NotifyHost, NotifyCustom } from "@/pages/home/demo/types";

export interface WorkspaceTab {
  id: string;
  name: string;
  hasWindows: boolean;
  pendingWindow: string | null;
}

const mkTab = (n: number): WorkspaceTab => ({
  id: String(Date.now()),
  name: `Workspace ${n}`,
  hasWindows: true,
  pendingWindow: null,
});

const initial = mkTab(1);

export const notifyDurationSecs = 3;

export function useCanva() {
  const [tabs, setTabs] = useState<WorkspaceTab[]>([initial]);
  const [activeId, setActiveId] = useState(initial.id);
  const [notifyBatch, setNotifyBatch] = useState<(NotifyHost | NotifyCustom)[]>([]);
  const refs = useRef<Map<string, any>>(new Map());

  const updateTab = (id: string, patch: Partial<WorkspaceTab>) =>
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const openWindow = (type: string) => {
    const tab = tabs.find((t) => t.id === activeId);
    if (!tab) return;
    if (!tab.hasWindows) updateTab(activeId, { hasWindows: true, pendingWindow: type });
    else refs.current.get(activeId)?.openWindow?.(type);
  };

  const addTab = () => {
    const nums = tabs.map((t) => parseInt(t.name.replace("Workspace ", "")));
    const nextN = Math.max(0, ...nums) + 1;
    const t = mkTab(nextN);
    setTabs((prev) => [...prev, t]);
    setActiveId(t.id);
  };

  const closeTab = (id: string) => {
    if (tabs.length <= 1) return;
    const next = tabs.filter((t) => t.id !== id);
    if (activeId === id) setActiveId(next[next.length - 1].id);
    refs.current.delete(id);
    setTabs(next);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;
      const i = Number(e.key) - 1;
      if (i >= 0 && i < tabs.length) {
        e.preventDefault();
        setActiveId(tabs[i].id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [tabs]);

  return {
    tabs,
    activeId,
    notifyBatch,
    setNotifyBatch,
    refs,
    setActiveId,
    openWindow,
    addTab,
    closeTab,
    updateTab,
  };
}
