import { memo, type RefObject } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { useTerminal } from './components/logic';
import NanoEditor from './components/nano';
import TerminalOutput from './components/content-view';
import type { Host } from "@/pages/home/demo/types";
import { SendHorizontal } from 'lucide-react';

const defaultSelectedHost: { host: Host; server: string } = {
  server: "192.168.15.10:9090",
  host: {
    id: 8,
    tag: "47334",
    ip: "192.168.15.72",
    host_server: "192.168.15.10",
    host_port: "9090",
    internal: "192.168.15.72",
    external_ip: "",
    listener: "http",
    privilege: "user",
    notes: null,
    process: null,
    pid: 6692,
    arch: "x64",
    os: "Windows 10 Pro",
    user: "Lab",
    hostname: "DESKTOP-B08TFNF",
    first_seen: "2026-09-06 06:18:26.066639",
    last_seen: "2026-09-06 07:27:51.917054",
    last_activity: "9h",
    delay: 2,
    implant_config:
      '{"channel":"http","host":"192.168.15.10","port":"9090","host_tag":"47334","delay":2,"syscall_method":"indirect"}',
    _server: "192.168.15.10:9090",
  },
};

interface TerminalWindowProps {
  selectedHost?: { host: Host; server: string } | null;
}

type TerminalInputBarProps = {
  input: string;
  session: string;
  isLoading: boolean;
  hostUnavailable: boolean;
  isSearch: boolean;
  isConfirming: boolean;
  confirmingCommand: string;
  searchMatchIndex: number;
  matchOccurrences: { itemIndex: number; occurrenceInItem: number }[];
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCancelLoading: () => void;
  onSend: () => void;
};

const TerminalInputBar = memo(function TerminalInputBar({
  input,
  session,
  isLoading,
  hostUnavailable,
  isSearch,
  isConfirming,
  confirmingCommand,
  searchMatchIndex,
  matchOccurrences,
  inputRef,
  onChange,
  onKeyDown,
  onCancelLoading,
  onSend,
}: TerminalInputBarProps) {
  const sendDisabled = input.trim() ? hostUnavailable || isLoading : true;
  const searchActive = isSearch && !isLoading;

  return (
    <div className="demo_qX9lW">
      {session ? <span className="demo_oKD1s">({session})</span> : null}
      {isLoading && (
        <>
          <button type="button" className="demo_terminal-cancel" onClick={onCancelLoading}>
            <MdOutlineCancel style={{ color: '#8d8d8d', marginRight: '1px', cursor: 'pointer' }} />
          </button>
          <svg style={{ minWidth: 12 }} className="demo_terminal-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M2 12a10 10 0 0 1 10 -10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </>
      )}
      <span
        className={`demo_bZ5cQ ${hostUnavailable && !searchActive && !isConfirming ? 'demo_bZ5cQ-muted' : ''}`}
        style={searchActive ? { color: '#ff9843' } : isConfirming ? { color: '#fbbf24' } : undefined}
      >
        {searchActive
          ? <>
              search
              {input.trim() && (
                <span style={{ color: '#929193' }}>
                  {' '}({matchOccurrences.length === 0 ? '0/0' : `${searchMatchIndex < 0 ? 0 : searchMatchIndex + 1}/${matchOccurrences.length}`})
                </span>
              )}
              {' >'}
            </>
          : isConfirming
            ? `Execute "${confirmingCommand}"? [Y/n]`
            : 'implant >'}
      </span>
      <div className="demo_terminal-input" data-terminal-input>
        <input
          ref={inputRef}
          data-terminal-input-field="command"
          type="text"
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onClick={(e) => e.stopPropagation()}
          className={`demo_pL8mF ${hostUnavailable ? 'demo_pL8mF-disabled' : ''}`}
          autoComplete="off"
          spellCheck={false}
          readOnly={isLoading}
          disabled={hostUnavailable}
        />
      </div>
      <button
        type="button"
        title="Send (Enter)"
        disabled={sendDisabled}
        onClick={(e) => {
          e.stopPropagation();
          onSend();
        }}
        className="demo_terminal-send"
      >
        <SendHorizontal size={16} className="shrink-0" strokeWidth={2} />
      </button>
    </div>
  );
});

const TerminalWindow = ({ selectedHost }: TerminalWindowProps) => {
  const activeHost = selectedHost ?? defaultSelectedHost;
  const {
    hostUnavailable, input, output, session, isLoading, isNano, nanoFile, isConfirming, confirmingCommand,
    isSearch, searchMatchIndex, matchOccurrences, activeOccurrenceInItem,
    inputRef, outputRef, setIsNano, setIsLoading,
    handleChange, handleKeyDown, sendInput, handleContainerClick, handleContainerMouseDown, handleNanoSave
  } = useTerminal(activeHost);

  if (isNano) {
    return (
      <div className="demo_terminal-full">
        <NanoEditor
          filename={nanoFile.name}
          initialContent={nanoFile.content}
          onExit={() => setIsNano(false)}
          onSave={handleNanoSave}
        />
      </div>
    );
  }

  return (
    <div
      data-terminal-panel
      className="demo_tHa7k demo_dv-bg-window"
      style={{ fontSize: 13.5 }}
      onClick={handleContainerClick}
      onMouseDown={handleContainerMouseDown}
    >
      <div id="output" className="demo_mK2vP">
        <div data-terminal-output className="demo_terminal-output">
          <TerminalOutput
            ref={outputRef}
            output={output}
            searchQuery={isSearch && !isLoading && input.trim() ? input : undefined}
            activeItemIndex={searchMatchIndex >= 0 ? matchOccurrences[searchMatchIndex]?.itemIndex : undefined}
            activeOccurrenceInItem={activeOccurrenceInItem}
          />
        </div>
        <TerminalInputBar
          input={input}
          session={session}
          isLoading={isLoading}
          hostUnavailable={hostUnavailable}
          isSearch={isSearch}
          isConfirming={isConfirming}
          confirmingCommand={confirmingCommand}
          searchMatchIndex={searchMatchIndex}
          matchOccurrences={matchOccurrences}
          inputRef={inputRef}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCancelLoading={() => setIsLoading(false)}
          onSend={sendInput}
        />
      </div>
    </div>
  );
};

export default TerminalWindow;
