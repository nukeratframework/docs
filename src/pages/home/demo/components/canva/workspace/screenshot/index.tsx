import type { Host } from "@/pages/home/demo/types";
import { useScreenshot } from "./components/logic";
import { PanelEmptyState } from "@/pages/home/demo/components/canva/utils/panel-empty-state";


interface ScreenshotWindowProps {
  selectedHost?: { host: Host; server: string } | null;
}

const ScreenshotWindow = ({ selectedHost }: ScreenshotWindowProps) => {
  const { src } = useScreenshot(selectedHost);

  return (
    <div className="w-full h-full dv-bg-window flex items-center justify-center overflow-hidden relative">
      {src ? (
        <>
          <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-50" />
          <img src={src} alt="" className="relative max-w-full max-h-full object-contain z-10" />
        </>
      ) : (
        <PanelEmptyState>No screenshot to display</PanelEmptyState>
      )}
    </div>
  );
};

export default ScreenshotWindow;
