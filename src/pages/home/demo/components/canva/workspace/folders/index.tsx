import type { Host } from "@/pages/home/demo/types";
import LeftSide from "./components/left-side";
import RightSide from "./components/right-side";
import { useFoldersWindow } from "./components/logic";

interface FoldersWindowProps {
  selectedHost?: { host: Host; server: string } | null;
}

const FoldersWindow = ({ selectedHost }: FoldersWindowProps) => {
  const {
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
    canBack,
    canForward,
    canDownloadFile,
    onDownloadFile,
    fetchFolders,
    setLoading,
  } = useFoldersWindow(selectedHost);

  return (
    <div ref={containerRef} className="flex w-full h-full dv-bg-window font-mono overflow-hidden select-none">
      <LeftSide
        folders={folders}
        currentPath={currentPath}
        width={leftWidth}
        loading={loading}
        disabled={hostUnavailable}
        onFileClick={onFileClick}
        onExpand={onExpand}
      />
      <div
        className="shrink-0 w-[2px] px-[6px] -mx-[6px] cursor-col-resize relative z-10 bg-transparent"
        onMouseDown={startResize}
      >
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] dv-bg-border" />
      </div>
      <RightSide
        folders={folders}
        currentPath={currentPath}
        viewMode={viewMode}
        loading={loading}
        disabled={hostUnavailable}
        autoRefresh={autoRefresh}
        onautoRefreshChange={setautoRefresh}
        fileContent={fileContent}
        onExpand={onExpand}
        onFileClick={onFileClick}
        onViewModeChange={setViewMode}
        onRefresh={() => fetchFolders(currentPath)}
        onPathSubmit={onPathSubmit}
        onBack={goBack}
        onForward={goForward}
        canBack={canBack}
        canForward={canForward}
        canDownload={canDownloadFile}
        onDownload={onDownloadFile}
        onCancelLoading={() => setLoading(false)}
      />
    </div>
  );
};

export default FoldersWindow;
