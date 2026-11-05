import "./styles.css";
import "./demo.css";
import "dockview/dist/styles/dockview.css";
import "reactflow/dist/style.css";

import type { CSSProperties } from "react";
import App from "./app";

export type NukeRatDemoProps = {
  className?: string;
  height?: string | number;
  width?: string | number;
};

export function NukeRatDemo({
  className,
  height = "980px",
  width = "100%",
}: NukeRatDemoProps) {
  const style: CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
  };

  return (
    <div
      className={`nukerat-demo-root overflow-hidden ${className ?? ""}`}
      style={style}
    >
      <App />
    </div>
  );
}

export default NukeRatDemo;
