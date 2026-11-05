import { RefreshCw, Trash2 } from "lucide-react";
import { PanelEmptyState } from "@/pages/home/demo/components/canva/utils/panel-empty-state";
import {
  formatProcess,
  formatUtcDateOnly,
  hostIcon,
  tableCellTruncate,
  tableColumns,
  UtcTableColumnHeader,
  useHostPanel,
} from "./components/logic";
import TopBar from "./components/topbbar";
import SplitPanel from "./components/split";

const HostPanel = () => {
  const {
    filteredHosts,
    loading,
    search,
    selectedId,
    panelOpen,
    selected,
    panelStyle,
    setSearch,
  } = useHostPanel();

  return (
    <div
      data-sessions-panel
      className="flex flex-col h-full bg-[#171717] text-[#d4d4d4] font-mono text-[12px] select-none overflow-hidden"
    >
      <TopBar search={search} onSearchChange={setSearch} />
      <div className="flex flex-1 min-h-0 min-w-0 relative overflow-hidden">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex-1 overflow-auto flex flex-col min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-16 text-[#444] text-[13.5px]">
                <RefreshCw size={14} className="animate-spin mr-2" />
                Loading...
              </div>
            ) : (
              <>
                <table className="w-max min-w-full border-collapse shrink-0">
                  <thead>
                    <tr className="bg-[#171717] border-b border-[#252525]">
                      {tableColumns.map((col) => (
                        <th
                          key={col}
                          className={`min-w-max py-2 px-3 text-[12px] font-medium uppercase tracking-widest whitespace-nowrap text-center cursor-pointer select-none transition-colors hover:text-[#b0b0b0] text-[#888888] ${col === "Platform" ? "max-w-[220px] !pl-5" : ""}`}
                        >
                          <span className="inline-flex items-center justify-center gap-0.5 mx-3">
                            <UtcTableColumnHeader label={col} />
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {filteredHosts.length > 0 && (
                    <tbody>
                      {filteredHosts.map((h) => {
                        const isSelected = selectedId === h.id;
                        return (
                          <tr
                            key={h.id}
                            data-session-id={h.id}
                            className={`border-b border-[#222] cursor-pointer transition-colors ${
                              isSelected ? "bg-[#282828]" : "hover:bg-[#232323]"
                            }`}
                          >
                            <td className="pl-5 pr-3 py-2 !text-left max-w-[220px]">
                              <div className="ml-2 flex items-center justify-start gap-1.5 min-w-0 max-w-full overflow-hidden">
                                <img src={hostIcon(h)} alt="" className="w-[30px] h-[30px] p-1 shrink-0 opacity-90" />
                                <span className={`ml-1.5 block !text-left text-[13.5px] text-[#d4d4d4] min-w-0 ${tableCellTruncate}`}>{h.os || "-"}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#9b9b9b] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{formatUtcDateOnly(h.last_activity)}</span>
                            </td>
                            <td className="select-text cursor-text px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={`${tableCellTruncate} font-mona-mono`}>{h.tag || "-"}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{h.hostname || "-"}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{h.user || "-"}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{h.privilege || "user"}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{(h.internal ?? h.ip) || "-"}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{h.external_ip || "-"}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{h.listener || "-"}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{h.pid ?? "-"}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#d4d4d4] whitespace-nowrap text-center">
                              <span className={tableCellTruncate}>{formatProcess(h.process)}</span>
                            </td>
                            <td className="px-3 py-2 text-[13.5px] text-[#9b9b9b] whitespace-nowrap text-center">
                              <span className={tableCellTruncate} title={h.notes?.trim() || undefined}>
                                {h.notes?.trim() ? h.notes : "-"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
                </table>
                {filteredHosts.length === 0 && <PanelEmptyState>No sessions found</PanelEmptyState>}
              </>
            )}
          </div>

          <div className="flex min-w-0 w-full shrink-0 flex-nowrap items-center gap-2 overflow-x-auto border-t border-[#292929] p-2">
            <button
              type="button"
              disabled={loading}
              className="button-default flex h-[29px] shrink-0 items-center gap-1.5 rounded border border-[#333] bg-[#232323] px-3 text-[13px] text-[#cecece] hover:bg-[#2b2b2b] hover:text-[#d4d4d4] cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
              Update
            </button>
            <button
              type="button"
              disabled={!selected}
              className="button-default flex h-[29px] shrink-0 items-center gap-1.5 rounded border border-[#333] bg-[#232323] px-3 text-[13px] text-[#cecece] hover:bg-[#2b2b2b] hover:text-[#c97070] cursor-pointer disabled:cursor-not-allowed disabled:opacity-25"
            >
              <Trash2 size={11} />
              Remove
            </button>
          </div>
        </div>

        {panelOpen && (
          <div
            style={{ backgroundColor: "#171717" }}
            className="z-999 bg-[#171717] hidden md:flex w-2 shrink-0 cursor-col-resize items-center justify-center group transition-colors border-l border-l-[#2a2a2a]"
          />
        )}

        <div
          className={`flex flex-col h-full min-h-0 min-w-0 bg-[#171717] overflow-x-auto overflow-y-hidden absolute inset-0 z-999 md:relative md:inset-auto md:z-auto md:max-w-full shrink transition-transform md:transition-[width] duration-300 ease-in-out ${
            panelOpen
              ? "translate-x-0 md:w-[var(--panel-width,440px)] border-l border-[#2a2a2a]"
              : "translate-x-full md:translate-x-0 md:w-0 pointer-events-none overflow-hidden"
          }`}
          style={{ zIndex: 999, ...panelStyle }}
        >
          {panelOpen && <SplitPanel host={selected} />}
        </div>
      </div>
    </div>
  );
};

export default HostPanel;
