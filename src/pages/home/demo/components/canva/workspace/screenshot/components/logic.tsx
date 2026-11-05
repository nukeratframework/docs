import type { Host } from "@/pages/home/demo/types";
import screenshot47334 from "@/pages/home/demo/assets/screenshot-47334.jpg";

export function useScreenshot(_selectedHost?: { host: Host; server: string } | null) {
  return { src: screenshot47334 };
}
