import { DockviewReact, type IDockviewPanelHeaderProps } from "dockview";
import { X } from "lucide-react";
import { forwardRef } from "react";
import TerminalWindow from "./terminal/index";
import GraphWindow from "./graphs/index";
import ProcessWindow from "./process/index";
import HostSelectBox from "./host-select";
import HostPanel from "./hosts/index";
import ScreenshotWindow from "./screenshot/index";
import {
  getPanelHeaderJustify,
  shouldShowHostSelect,
  useWorkspace,
  type WorkspaceHandle,
  type WorkspaceProps,
} from "./logic";

const Workspace = forwardRef<WorkspaceHandle, WorkspaceProps>(
  (props, ref) => {
    const { onDockviewReady } = useWorkspace(props, ref);

    const PanelHeader = ({ api }: IDockviewPanelHeaderProps) => (
      <div
        className="cursor-default flex items-center h-full"
        style={{
          minWidth: 0,
          overflow: "hidden",
          width: "100%",
          justifyContent: getPanelHeaderJustify(api.title),
        }}
      >
        <span
          className="font-[400] text-nowrap gap-2 text-[13px] text-[#9e9e9e] flex items-center h-full"
        >
          {shouldShowHostSelect(api.title) ? (
            <>
            <HostSelectBox
              onSelect={(host) => api.updateParameters({ selectedHost: host })}
              hide={false}
            />
            {api.title}
            </>
          ) : (
            <>
              <div className="ml-1"></div>
              {api.title}
              <div className="mr-[1.1rem]"></div>
            </>
          )}

        </span>
        <button
          onClick={() => api.close?.()}
          className="button-default ml-2.5 mr-3.5 cursor-pointer rounded transition-colors"
          style={{ padding: "0px 0px", flexShrink: 0, marginTop: "1px" }}
        >
          <X size={13} className="text-[#9e9e9e]" />
        </button>
      </div>
    );

    return (
      <div
        className="flex-1 overflow-hidden relative"
        style={{ background: "#10121a" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #2a2d3e 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="absolute inset-0 bg-color-workspace"
          style={{
            paddingTop: ".2rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <DockviewReact
            className="h-full w-full"
            theme={{
              name: "darkSpaced",
              className: "dockview-theme-dark",
              gap: 10,
            }}
            components={{
              terminal: (props: any) => (
                <TerminalWindow
                  selectedHost={props.params?.selectedHost ?? null}
                />
              ),
              graphs: (_props: any) => <GraphWindow />,
              process: (props: any) => (
                <ProcessWindow
                  selectedHost={props.params?.selectedHost ?? null}
                />
              ),
              hosts: (_props: any) => <HostPanel />,
              screenshot: (props: any) => (
                <ScreenshotWindow
                  selectedHost={props.params?.selectedHost ?? null}
                />
              ),
            }}
            tabComponents={{ header: PanelHeader }}
            onReady={onDockviewReady}
          />
        </div>
      </div>
    );
  }
);

Workspace.displayName = "Workspace";

export default Workspace;
