import { useEffect } from "react";
import { toast } from "sonner";
import { MdCheckCircleOutline, MdErrorOutline, MdInfoOutline } from "react-icons/md";
import TopBar from "./topbar";
import Workspace from "./workspace";
import EmptyView from "./empty";
import { hostOsIcon } from "@/pages/home/demo/utils/host-os-icon";
import { useCanva, notifyDurationSecs } from "./logic";

const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 3)}...`;

export default function Canva() {
  const {
    tabs,
    activeId,
    notifyBatch,
    setNotifyBatch,
    refs,
    setActiveId,
    addTab,
    closeTab,
    updateTab,
  } = useCanva();

  useEffect(() => {
    if (!notifyBatch.length) return;
    for (const n of notifyBatch) {
      if ("ip" in n) {
        toast.info("New session", {
          className: "!h-auto !py-2 select-none",
          style: {
            background: "#1515154a",
            backdropFilter: "blur(10px)",
          },
          classNames: {
            icon: "!size-10 !min-w-10",
            title: "!text-[14.5px] !font-medium",
            description: "!text-[#9B9B9B] !text-[13px]",
          },
          description: truncate(`${n.ip} · ${n.hostname}`, 300),
          icon: <img src={hostOsIcon(n.os)} alt="" className="h-full w-full pr-[2px] object-contain" />,
          duration: notifyDurationSecs * 3000,
          position: "top-right",
        });
      } else {
        const kind = n.type || "info";
        (kind === "error" ? toast.error : kind === "success" ? toast.success : toast.info)(truncate(n.title || "Notification", 25), {
          className: "!h-auto !py-2 min-w-[100px]",
          style: {
            background: "#1515154a",
            backdropFilter: "blur(10px)",
          },
          classNames: {
            icon: "!size-5 !min-w-5",
            title: "!text-[14.5px] !font-medium",
            description: "!text-[#9B9B9B] !text-[13px]",
          },
          description: n.description ? truncate(n.description, 300) : undefined,
          icon: kind === "error"
            ? <MdErrorOutline size={18} className="text-[#b08080]" />
            : kind === "success"
              ? <MdCheckCircleOutline size={18} className="text-[#80b090]" />
              : <MdInfoOutline size={18} className="text-[#8090b0]" />,
          duration: notifyDurationSecs * 3000,
          position: "top-right",
        });
      }
    }
    setNotifyBatch([]);
  }, [notifyBatch, setNotifyBatch]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <TopBar
        workspaceTabs={tabs}
        activeTabId={activeId}
        onTabSelect={setActiveId}
        onTabAdd={addTab}
        onTabClose={closeTab}
      />
      <div className="flex-1 overflow-hidden relative bg-color-workspace">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="absolute inset-0"
            style={{ display: tab.id === activeId ? "flex" : "none", flexDirection: "column" }}
          >
            {tab.hasWindows ? (
              <Workspace
                ref={(r: any) => {
                  if (r) refs.current.set(tab.id, r);
                }}
                setWindows={(v: boolean) => updateTab(tab.id, { hasWindows: v })}
                pendingWindow={tab.pendingWindow}
                onWindowOpen={() => updateTab(tab.id, { pendingWindow: null })}
              />
            ) : (
              <EmptyView />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
