import { Virtuoso } from "react-virtuoso";
import { CHUNK_SIZE, useContentPreview } from "./logic";

interface ContentViewProps {
  content: string;
  canDownload: boolean;
  controlsDisabled: boolean;
  onDownload: () => void;
  fileKey?: string;
}

const ContentView = ({
  content,
  canDownload,
  controlsDisabled,
  onDownload,
  fileKey,
}: ContentViewProps) => {
  const {
    allowLargePreview,
    setAllowLargePreview,
    isLargeContent,
    useChunkMode,
    lines,
    chunkCount,
  } = useContentPreview(content, fileKey);

  if (isLargeContent && !allowLargePreview) {
    return (
      <div className="flex-1 overflow-y-auto p-3">
        <div className="h-full flex flex-col items-center justify-center text-center gap-3">
          <p className="text-[12px] text-[#b0b0b0] max-w-[560px]">
            This file appears to be large. Do you really want to open it?
          </p>
          <div className="grid grid-cols-2 gap-2 w-full max-w-[320px]">
            <button
              onClick={onDownload}
              disabled={controlsDisabled || !canDownload}
              className={`button-default px-2 py-1.5 rounded-[3px] border text-[11px] ${controlsDisabled || !canDownload ? "cursor-default text-[#555] border-[#2a2a2a]" : "cursor-pointer text-[#bdbdbd] border-[#3a3a3a] hover:bg-[#1a1a1a]"}`}
            >
              Download
            </button>
            <button
              onClick={() => setAllowLargePreview(true)}
              className="button-default px-2 py-1.5 rounded-[3px] border text-[11px] cursor-pointer text-[#bdbdbd] border-[#3a3a3a] hover:bg-[#1a1a1a]"
            >
              View content
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden p-3.5">
      {useChunkMode ? (
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={chunkCount}
          itemContent={(index) => {
            const start = index * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, content.length);
            return (
              <div
                className="text-[13.5px] text-[#d4d4d4] font-inherit whitespace-pre-wrap break-all folders-content-view "
              >
                {content.slice(start, end)}
              </div>
            );
          }}
        />
      ) : (
        <Virtuoso
          style={{ height: "100%" }}
          totalCount={lines.length}
          itemContent={(index) => (
            <div
              className="text-[13.5px] text-[#d4d4d4] font-inherit whitespace-pre-wrap break-all folders-content-view "
            >
              {lines[index] === "" ? " " : lines[index]}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default ContentView;
