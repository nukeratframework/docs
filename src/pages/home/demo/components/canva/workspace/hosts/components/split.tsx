import { X } from "lucide-react";
import { type Host } from "@/pages/home/demo/types";
import { formatDate, hostIcon } from "./logic";

const inputClass =
  "w-full bg-[#212121] border border-[#363636] text-[#cecece] text-[13.5px] rounded px-3 py-1.5 outline-none cursor-text";

const displayValue = (value?: string | number | null): string => {
  if (value === undefined || value === null || `${value}`.trim() === "") return "-";
  return String(value);
};

const ViewField = ({
  label,
  value,
  uppercase,
}: {
  label: string;
  value?: string | number | null;
  uppercase?: boolean;
}) => (
  <div className="mb-3 space-y-1.5">
    <label className="block text-[12px] text-[#6e6e6e] uppercase tracking-widest">{label}</label>
    <input
      type="text"
      readOnly
      tabIndex={-1}
      value={displayValue(value)}
      onMouseDown={(e) => e.preventDefault()}
      onFocus={(e) => e.currentTarget.blur()}
      className={`${inputClass}${uppercase ? " uppercase" : ""} select-none`}
    />
  </div>
);

export default function SplitPanel({ host }: { host: Host | null }) {
  const note = host?.notes ?? "";

  let implant: Record<string, unknown> | null = null;
  try {
    if (host?.implant_config) implant = JSON.parse(host.implant_config);
  } catch {}

  return (
    <div className="flex flex-col h-full min-h-0 min-w-[22rem] select-none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a] shrink-0">
        <span className="text-[13.5px] font-semibold text-[#cecece] tracking-wide flex items-center gap-2">
          {host && <img src={hostIcon(host)} alt="" className="w-[16px] h-[16px] opacity-90" />}
          View - {host?.tag ?? "Session"}
        </span>
        <button type="button" className="p-1 rounded text-[#6b6b6b] hover:text-[#d4d4d4] hover:bg-[#2a2a2a] transition-colors cursor-pointer">
          <X size={13} />
        </button>
      </div>
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto px-4 py-4">
        <div className="mb-3 space-y-1.5">
          <label className="block text-[12px] text-[#6e6e6e] uppercase tracking-widest">Note</label>
          <textarea
            className={`${inputClass} min-h-[72px] resize-y py-2 focus:border-[#555] transition-colors select-none`}
            rows={3}
            value={note}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onFocus={(e) => e.currentTarget.blur()}
          />
        </div>
        <ViewField label="Last Check" value={host?.last_activity || "-"} />
        <ViewField label="Tag" value={host?.tag} />
        <ViewField label="Hostname" value={host?.hostname} />
        <ViewField label="User" value={host?.user} />
        <ViewField label="Privilege" value={host?.privilege || "user"} />
        <ViewField label="Internal" value={host?.internal ?? host?.ip} />
        <ViewField label="External" value={host?.external_ip} />
        <ViewField label="Listener" value={host?.listener} uppercase />
        <ViewField label="Host Server" value={host?.host_server} />
        <ViewField label="Host Port" value={host?.host_port} />
        <ViewField label="Arch" value={host?.arch} />
        <ViewField label="PID" value={host?.pid} />
        <ViewField label="Process" value={host?.process || "-"} />
        <ViewField label="OS" value={host?.os} />
        <ViewField label="First Seen" value={formatDate(host?.first_seen)} />
        <ViewField label="Last Seen" value={formatDate(host?.last_seen)} />
        <ViewField label="delay" value={host?.delay} />
        <ViewField label="Server" value={host?._server} />
        <div className="mb-3 space-y-1.5">
          <label className="block text-[12px] text-[#6e6e6e] uppercase tracking-widest">Implant Config</label>
          {implant && typeof implant === "object" ? (
            <div className="rounded border border-[#363636] bg-[#212121] overflow-hidden">
              {Object.entries(implant).map(([key, val], i, arr) => (
                <div key={key} className={`flex items-center gap-3 px-2 py-0.5 ${i < arr.length - 1 ? "border-b border-[#363636]" : ""}`}>
                  <span className="text-[12px] text-[#6e6e6e] uppercase tracking-widest shrink-0">{key}</span>
                  <input
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={String(val)}
                    onMouseDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.currentTarget.blur()}
                    className={`${inputClass} font-mono border-0 bg-transparent px-0 py-0 select-none`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <input
              type="text"
              readOnly
              tabIndex={-1}
              value={host?.implant_config?.trim() ? host.implant_config : "-"}
              onMouseDown={(e) => e.preventDefault()}
              onFocus={(e) => e.currentTarget.blur()}
              className={`${inputClass} select-none`}
            />
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2 border-t border-[#252525] p-2">
        <button
          type="button"
          disabled
          className="button-default flex h-[29px] shrink-0 items-center gap-1.5 rounded border border-[#444] bg-[#232323] px-3 text-[13px] text-[#c8c8c8] hover:bg-[#2b2b2b] cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
        >
          Save
        </button>
      </div>
    </div>
  );
}
