import type { Host } from "@/pages/home/demo/types";
import Toolbar from "./components/toolbar";
import ProcessTable from "./components/process-table";
import { useProcessWindow } from "./components/logic";

interface ProcessWindowProps {
  selectedHost?: { host: Host; server: string } | null;
}

const ProcessWindow = ({ selectedHost }: ProcessWindowProps) => {
  const {
    hostUnavailable,
    processes,
    loading,
    search,
    filter,
    treeMode,
    sort,
    sortDir,
    selected,
    table,
  } = useProcessWindow(selectedHost);

  return (
    <div className="flex w-full h-full dv-bg-window font-mono overflow-hidden flex-col">
      <Toolbar
        search={search}
        loading={loading}
        disabled={hostUnavailable}
        filter={filter}
        treeMode={treeMode}
      />
      {loading && processes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-[#555]">
          <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M2 12a10 10 0 0 1 10 -10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span
            className="mt-2 text-[13.5px] text-[#3a3a3a] cursor-pointer select-none hover:text-[#4a4a4a]"
          >
            Cancel
          </span>
        </div>
      ) : (
        <ProcessTable
          table={table}
          treeMode={treeMode}
          selected={selected}
          sort={sort}
          sortDir={sortDir}
        />
      )}
    </div>
  );
};

export default ProcessWindow;
