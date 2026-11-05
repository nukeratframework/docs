import { useId } from "react";
import {
  ChevronsUpDownIcon,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/pages/home/demo/components/ui/button";
import { PROCESS_FILTERS, type ProcessFilter } from "./logic";

interface ToolbarProps {
  search: string;
  loading: boolean;
  disabled: boolean;
  filter: ProcessFilter;
  treeMode: boolean;
}

const Toolbar = ({
  search,
  loading,
  disabled,
  filter,
  treeMode,
}: ToolbarProps) => {
  const id = useId();
  const controlsDisabled = loading || disabled;
  const refreshClassName = loading ? "animate-spin" : "";
  const selectedFilter =
    PROCESS_FILTERS.find((item) => item.value === filter) ?? PROCESS_FILTERS[0];

  return (
    <div
      style={{ borderColor: "#222323" }}
      className="shrink-0 min-w-0 overflow-x-auto border-b dv-bg-window"
    >
      <div className="box-border flex w-max min-w-full flex-nowrap items-center gap-2 p-2">
        <button
          type="button"
          disabled={controlsDisabled}
          className="button-default h-[29px] shrink-0 rounded-[5px] border border-[#ffffff26] px-2 text-[13.5px] text-[#cecece] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={refreshClassName} />
        </button>

        <div className="relative w-[14rem] min-w-[6rem] shrink-0" data-process-search-input>
          <input
            data-process-search-field="search"
            value={search}
            readOnly
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onFocus={(e) => e.currentTarget.blur()}
            placeholder="Filter processes..."
            className="h-[29px] w-full rounded border border-[#363636] bg-[#212121] px-3 py-0 text-[13.5px] text-[#cecece] outline-none transition-colors placeholder:text-[#444] focus:border-[#555]"
          />
        </div>
        {search && (
          <button
            type="button"
            className="button-default text-[#555] hover:text-[#cecece] cursor-pointer bg-transparent border-none p-0"
          >
            <X size={11} />
          </button>
        )}

        <div id="process-filter-select" className="shrink-0">
          <Button
            id={id}
            type="button"
            size="sm"
            variant="outline"
            role="combobox"
            aria-expanded={false}
            disabled={controlsDisabled}
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onFocus={(e) => e.currentTarget.blur()}
            className="button-default h-[30px] w-[140px] min-w-0 justify-between gap-1 border-input bg-background px-0 py-0 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
          >
            <span className="min-w-0 truncate text-[13.5px] text-[#cecece]">
              {selectedFilter.label}
            </span>
            <ChevronsUpDownIcon
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </div>

        <button
          type="button"
          className={`button-default h-[29px] shrink-0 rounded-[5px] border px-2 text-[13.5px] cursor-pointer ${treeMode ? "border-[#ffffff26] text-[#cecece]" : "border-transparent text-[#555]"}`}
        >
          Tree
        </button>
        <button
          type="button"
          className={`button-default h-[29px] shrink-0 rounded-[5px] border px-2 text-[13.5px] cursor-pointer ${!treeMode ? "border-[#ffffff26] text-[#cecece]" : "border-transparent text-[#555]"}`}
        >
          Flat
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
