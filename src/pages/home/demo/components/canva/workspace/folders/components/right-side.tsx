import { ArrowLeft, ArrowRight, RefreshCw, LayoutGrid, List, Folder, File, ArrowDownToLine, ChevronsRight, Bot } from "lucide-react";
import { FileFallbackIcon, getFileIconSrc, getFolderIconSrc, NameTooltip, useTruncatedNames } from "./utils";
import { PanelEmptyState } from "@/pages/home/demo/components/canva/utils/panel-empty-state";
import ContentView from "./content-view";
import { TooltipProvider } from "@/pages/home/demo/components/ui/tooltip";
import {
  getItemSubtitle,
  isFile,
  isImage,
  useRightSideItems,
  useRightSidePath,
  type FileContentData,
  type ViewMode,
} from "./logic";

const RightSide = ({
  folders,
  currentPath,
  viewMode,
  loading,
  disabled,
  autoRefresh: _autoRefresh,
  fileContent,
  onExpand: _onExpand,
  onFileClick: _onFileClick,
  onautoRefreshChange: _onautoRefreshChange,
  onViewModeChange: _onViewModeChange,
  onRefresh: _onRefresh,
  onPathSubmit: _onPathSubmit,
  onBack: _onBack,
  onForward: _onForward,
  canBack,
  canForward,
  canDownload,
  onDownload: _onDownload,
  onCancelLoading: _onCancelLoading,
}: {
  folders: unknown[];
  currentPath: string[];
  viewMode: ViewMode;
  loading: boolean;
  disabled: boolean;
  autoRefresh: boolean;
  fileContent: FileContentData | null;
  onExpand: (path: string[]) => void;
  onFileClick: (path: string[]) => void;
  onautoRefreshChange: (value: boolean) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  onPathSubmit: (path: string) => Promise<boolean>;
  onBack: () => void;
  onForward: () => void;
  canBack: boolean;
  canForward: boolean;
  canDownload: boolean;
  onDownload: () => void;
  onCancelLoading: () => void;
}) => {
  const items = useRightSideItems(folders, currentPath);
  const controlsDisabled = loading || disabled;
  const { inputValue } = useRightSidePath(currentPath, _onPathSubmit);
  const { attachNameRef, isTruncated } = useTruncatedNames([items, viewMode, currentPath]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden select-none">
      <div style={{ borderColor: "#222323" }} className={`overflow-x-auto flex items-center gap-[2px] px- py-[10px] border-b shrink-0 dv-bg-window select-none`}>
        <button
          type="button"
          disabled={controlsDisabled || !canBack}
          className={`button-default ml-3 bg-transparent border-none flex items-center px-1 py-0.5 rounded-[3px] select-none ${!controlsDisabled && canBack ? "cursor-pointer text-[#cecece]" : "cursor-default text-[#444]"}`}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          disabled={controlsDisabled || !canForward}
          className={`button-default bg-transparent border-none flex items-center px-1 py-0.5 rounded-[3px] select-none ${!controlsDisabled && canForward ? "cursor-pointer text-[#cecece]" : "cursor-default text-[#444]"}`}
        >
          <ArrowRight size={18} />
        </button>
        <button
          type="button"
          disabled={controlsDisabled}
          className={`button-default ml-0.5 bg-transparent border-none px-1 py-0.5 flex items-center rounded-[3px] select-none ${controlsDisabled ? "cursor-default text-[#444]" : "cursor-pointer text-[#cecece]"}`}
        >
          <RefreshCw size={16} />
        </button>
        <input
          value={inputValue}
          readOnly
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onFocus={(e) => e.currentTarget.blur()}
          className="ml-2 mr-1 select-none w-full min-w-[5rem] min-w-4 box-border bg-[#ffffff0b] border border-[#ffffff26] rounded-[6px] py-[2px] px-[6px] pr-7 text-[13.5px] text-[#d4d4d4] cursor-text"
        />
        {inputValue.trim().length > 0 ? (
          <button
            type="button"
            disabled={controlsDisabled}
            className={`button-default bg-transparent border-none p-0 flex items-center select-none ${controlsDisabled ? "cursor-default text-[#444]" : "cursor-pointer text-[#cecece]"}`}
          >
            <ChevronsRight size={20} />
          </button>
        ) : null}
        <div className="flex shrink-0 gap-[2px] ml-10">
          <div className="w-[1px] h-[18px] ml-2.5 mr-2.5 bg-[#181818] mx-[2px]" />
          <button
            type="button"
            title="Copy folder context"
            style={{padding: "6px"}}
            className={`cursor-pointer bg-transparent px-1 py-0.5 flex items-center rounded-[6px] border border-[#ffffff26] text-[#cecece] select-none`}
          >
            <Bot size={16} />
          </button>
          <div className="w-px h-[20px] bg-[#292929] mr-4 ml-4 shrink-0 self-center"></div>
          <button
            type="button"
            disabled={controlsDisabled || !canDownload}
            className={`button-default bg-[#191819] flex items-center gap-1.5 px-2 rounded-[6px] border text-[13.5px] select-none ${controlsDisabled || !canDownload ? "cursor-default text-[#555] border-[#2a2a2a]" : "cursor-pointer text-[#bdbdbd] border-[#ffffff26] hover:bg-[#1a1a1a]"}`}
          >
            <ArrowDownToLine size={10} />
            <span>Download</span>
          </button>
          <div className="w-[1px] h-[18px] ml-0.5 mr-0.5 bg-[#181818] mx-[2px]" />
          <button
            type="button"
            style={{padding: "6px"}}
            title="Icon view"
            className={`button-default cursor-pointer bg-transparent px-1 py-0.5 flex items-center rounded-[6px] border select-none
              ${viewMode === "grid" ? "border-[#ffffff26] text-[#cecece]" : "border-transparent text-[#555]"}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            style={{padding: "6px"}}
            title="List view"
            className={`button-default cursor-pointer mr-4 bg-transparent px-1 py-0.5 flex items-center rounded-[6px] border select-none
              ${viewMode === "list" ? "border-[#ffffff26] text-[#cecece]" : "border-transparent text-[#555]"}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {loading ? (
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
      ) : fileContent !== null ? (
        isImage(fileContent.contentB64) ? (
          <div className="flex-1 overflow-auto p-3 flex items-center justify-center">
            <img
              src={`data:${isImage(fileContent.contentB64)!};base64,${fileContent.contentB64}`}
              alt={fileContent.fileName}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <ContentView
            content={fileContent.content}
            canDownload={canDownload}
            controlsDisabled={controlsDisabled}
            onDownload={_onDownload}
            fileKey={fileContent.fileName}
          />
        )
      ) : items.length === 0 ? (
        <PanelEmptyState>No content found</PanelEmptyState>
      ) : viewMode === "grid" ? (
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          <TooltipProvider delayDuration={500}>
            <div className="flex flex-wrap content-start gap-1">
              {items.map(([name, nodeVal]) => {
                const fileNode = isFile(nodeVal);
                const fileIconSrc = fileNode ? getFileIconSrc(name) : null;
                const folderIconSrc = !fileNode ? getFolderIconSrc() : null;
                const nameKey = `grid:${currentPath.join("/")}:${name}`;
                const subtitle = getItemSubtitle(name, nodeVal, fileNode);

                const itemCard = (
                  <div
                    className="flex flex-col items-center justify-start w-[100px] h-[114px] px-1 pt-2 pb-1.5 rounded select-none border bg-transparent border-transparent overflow-hidden cursor-pointer"
                  >
                    {fileNode ? (
                      fileIconSrc ? (
                        <img src={fileIconSrc} alt={name} className="w-[40px] h-[40px] object-contain" loading="lazy" />
                      ) : (
                        <FileFallbackIcon size={42} />
                      )
                    ) : folderIconSrc ? (
                      <img src={folderIconSrc} alt={name} className="w-[40px] h-[40px] object-contain" loading="lazy" />
                    ) : null}
                    <span
                      ref={attachNameRef(nameKey)}
                      className="mt-1.5 text-[13.5px] text-center w-full text-[#cecece] overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {name}
                    </span>
                    <span className="mt-0.5 text-[.8rem] font-normal text-[#5E5D5F] text-center w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {subtitle}
                    </span>
                  </div>
                );

                return (
                  <NameTooltip key={name} name={name} enabled={isTruncated(nameKey)}>
                    {itemCard}
                  </NameTooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto overflow-x-auto p-0">
          <div className="ml-[0.1px] min-w-[480px]">
            <div className="ml-0.5 grid grid-cols-[1fr_90px_90px_90px] px-3 py-1 font-[400] text-[13px] text-[#5E5D5F] select-none sticky top-0 bg-[#161616] z-10">
              <span>Name</span>
              <span>Type</span>
              <span>Size</span>
              <span>Modified</span>
            </div>
            <TooltipProvider delayDuration={500}>
              {items.map(([name, nodeVal]) => {
                const fileNode = isFile(nodeVal);
                const nameKey = `list:${currentPath.join("/")}:${name}`;
                const nv = nodeVal as { size?: unknown; modified?: string };

                const row = (
                  <div
                    className="grid grid-cols-[1fr_90px_90px_90px] px-3 py-[3px] select-none border-l-3 bg-transparent border-transparent cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[#cecece] shrink-0 flex items-center">
                        {fileNode ? <File size={16} /> : <Folder size={16} />}
                      </span>
                      <span
                        ref={attachNameRef(nameKey)}
                        className="text-[13.5px] font-[400] overflow-hidden text-ellipsis whitespace-nowrap text-[#d4d4d4]"
                      >
                        {name}
                      </span>
                    </span>
                    <span className="text-[13.5px] text-[#929193] self-center">{fileNode ? "File" : "Folder"}</span>
                    <span className="text-[13.5px] text-[#929193] self-center">{String(nv.size ?? "-")}</span>
                    <span className="text-[13.5px] text-[#929193] self-center whitespace-nowrap">
                      {nv.modified?.slice?.(0, 10) ?? nv.modified ?? "-"}
                    </span>
                  </div>
                );

                return (
                  <NameTooltip key={name} name={name} enabled={isTruncated(nameKey)}>
                    {row}
                  </NameTooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSide;
