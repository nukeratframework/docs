import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';
import { toast } from 'sonner';
import { COMMAND_LIST, CONFIRM_COMMANDS } from './values';
import type { Host } from "@/pages/home/demo/types";
import { terminalCommandHistory, terminalInputResponse, terminalOutput } from "@/pages/home/demo/global";

// command --------------------------------------------

export const executeCommand = async (
  command: string,
  history: string[],
  currentSession: string,
  server?: string,
  extraData: object = {}
): Promise<{ output: string | any; newHistory: string[]; session?: string }> => {
  const trimmedCmd = command.trim();
  const cmdParts = trimmedCmd.split(' ');
  const cmdName = cmdParts[0];
  const cmdArg = cmdParts.slice(1).join(' ');

  if (cmdName === 'clear') return { output: '', newHistory: history };
  if (cmdName === 'history') {
    return { output: history.map((cmd, i) => `  ${i + 1} ${cmd}`).join('\n'), newHistory: history };
  }
  if (cmdName === 'session') {
    if (cmdArg) {
      return { output: `Session changed to: ${cmdArg}`, newHistory: trimmedCmd ? [...history, trimmedCmd] : history, session: cmdArg };
    }
    return { output: `Current session: ${currentSession.substring(0, 100)}`, newHistory: trimmedCmd ? [...history, trimmedCmd] : history };
  }
  if (cmdName === 'exit') {
    return { output: 'Session terminated', newHistory: trimmedCmd ? [...history, trimmedCmd] : history, session: '' };
  }

  const extra = extraData as { type?: string; filename?: string; content?: string };
  if (extra.type === 'save_file') {
    return {
      output: { status: 'success', message: 'File saved' },
      newHistory: history,
    };
  }

  const cmdLower = trimmedCmd.toLowerCase();
  if (!cmdLower) {
    return { output: "", newHistory: history };
  }

  return {
    output: terminalInputResponse,
    newHistory: [...history, trimmedCmd],
  };
};

export const getAutocomplete = (input: string): string | null => {
  const match = COMMAND_LIST.find((cmd) => cmd.startsWith(input));
  return match && input ? `${match} ` : null;
};

// content-view --------------------------------------------

export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const highlight = (text: string, query: string, activeOcc?: number) => {
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'));
  let matchCount = 0;
  return (
    <>
      {parts.map((part, i) => {
        if (part.toLowerCase() === query.toLowerCase()) {
          const isActive = activeOcc != null && matchCount === activeOcc;
          matchCount++;
          return isActive
            ? (
              <mark
                key={i}
                data-terminal-active-match
                style={{ background: '#ff9843', color: '#010910', borderRadius: 2 }}
              >
                {part}
              </mark>
            )
            : <mark key={i} style={{ background: '#feff49', color: '#010910', borderRadius: 2 }}>{part}</mark>;
        }
        return part;
      })}
    </>
  );
};

export const renderLines = (text: string, query?: string, activeOcc?: number) => {
  const lines = text.split('\n');
  let occsSoFar = 0;
  return lines.map((str, j) => {
    const lineText = str.replace(/\r/g, '').replace(/ /g, '\u00A0');
    let activeOccInLine: number | undefined;
    if (query && activeOcc !== undefined) {
      const q = query.toLowerCase();
      const lower = lineText.toLowerCase();
      let lineCount = 0;
      let p = 0;
      while ((p = lower.indexOf(q, p)) !== -1) { lineCount++; p += q.length; }
      if (activeOcc >= occsSoFar && activeOcc < occsSoFar + lineCount) activeOccInLine = activeOcc - occsSoFar;
      occsSoFar += lineCount;
    }
    return (
      <span key={j}>
        {query ? highlight(lineText, query, activeOccInLine) : lineText}
        <br />
      </span>
    );
  });
};

// nano --------------------------------------------

export const useNanoEditor = (
  filename: string,
  initialContent: string,
  onExit: () => void,
  onSave: (content: string) => void
) => {
  const [content, setContent] = useState(initialContent);
  const [statusBar, setStatusBar] = useState(`File: ${filename}`);
  const [isModified, setIsModified] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (confirmExit) containerRef.current?.focus();
  }, [confirmExit]);

  useEffect(() => {
    if (content !== initialContent) setIsModified(true);
  }, [content, initialContent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (confirmExit) {
      if (e.key.toLowerCase() === 'y') { e.preventDefault(); onSave(content); onExit(); }
      else if (e.key.toLowerCase() === 'n') { e.preventDefault(); onExit(); }
      else if (e.ctrlKey && e.key === 'c') { e.preventDefault(); setConfirmExit(false); setStatusBar(`File: ${filename}`); }
      return;
    }
    if (e.ctrlKey && e.key === 'x') {
      e.preventDefault();
      if (isModified) { setConfirmExit(true); setStatusBar('Save modified buffer? (Y/n)'); }
      else onExit();
    } else if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      onSave(content);
      setIsModified(false);
      setStatusBar(`Wrote ${content.split('\n').length} lines`);
      setTimeout(() => setStatusBar(`File: ${filename}`), 2000);
    }
  };

  return { content, setContent, statusBar, isModified, confirmExit, containerRef, handleKeyDown };
};

// index --------------------------------------------

const generateRandomId = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

export const useTerminal = (selectedHost?: { host: Host, server: string } | null) => {
  const hostUnavailable = !selectedHost;
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(terminalCommandHistory);
  const [output, setOutput] = useState<any[]>(terminalOutput);
  const [commandHistory, setCommandHistory] = useState<string[]>(terminalCommandHistory);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isNano, setIsNano] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nanoFile, setNanoFile] = useState({ name: '', content: '' });
  const [terminalId] = useState(generateRandomId(6));
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<VirtuosoHandle>(null);
  const [session, setSession] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmingCommand, setConfirmingCommand] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [searchMatchIndex, setSearchMatchIndex] = useState(-1);
  const inputLengthRef = useRef(0);
  inputLengthRef.current = input.length;

  useEffect(() => {
    if (!isNano) inputRef.current?.focus({ preventScroll: true });
  }, [isNano]);

  const outputCountRef = useRef(output.length);
  useEffect(() => {
    const previous = outputCountRef.current;
    outputCountRef.current = output.length;
    if (output.length <= previous) return;
    const index = output.length - 1;
    const timer = window.setTimeout(() => {
      outputRef.current?.scrollToIndex({ index, align: 'end', behavior: 'auto' });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [output]);

  useEffect(() => {
    if (isSearch) setSearchMatchIndex(-1);
  }, [input, isSearch]);

  const matchOccurrences = useMemo(() => {
    if (!isSearch || !input.trim()) return [] as { itemIndex: number; occurrenceInItem: number }[];
    const query = input.toLowerCase();
    const result: { itemIndex: number; occurrenceInItem: number }[] = [];
    for (let i = 0; i < output.length; i++) {
      const text = typeof output[i] === 'object' ? JSON.stringify(output[i]) : String(output[i]);
      const lower = text.toLowerCase();
      let pos = 0;
      let occ = 0;
      while ((pos = lower.indexOf(query, pos)) !== -1) {
        result.push({ itemIndex: i, occurrenceInItem: occ });
        pos += query.length;
        occ++;
      }
    }
    return result;
  }, [isSearch, input, output]);

  const activeOccurrenceInItem = searchMatchIndex >= 0 ? matchOccurrences[searchMatchIndex]?.occurrenceInItem : undefined;

  const exitSearch = () => {
    setIsSearch(false);
    setInput('');
    setSearchMatchIndex(-1);
  };

  const handleSubmit = async (cmd: string) => {
    if (!cmd.trim()) return;

    if (isConfirming) {
      const answer = cmd.trim().toLowerCase();
      const pending = confirmingCommand;
      setIsConfirming(false);
      setConfirmingCommand('');
      if (answer !== 'y') { setInput(''); setHistoryIndex(-1); return; }
      cmd = pending;
    } else if (CONFIRM_COMMANDS.some(c => cmd.trim().toLowerCase().startsWith(c))) {
      setIsConfirming(true);
      setConfirmingCommand(cmd.trim().toLowerCase());
      setInput('');
      setHistoryIndex(-1);
      return;
    }

    setHistory([...history, cmd]);
    setIsLoading(true);

    try {
      const { output: result, session: newSession } = await executeCommand(cmd, [...history, cmd], session, selectedHost?.server, { id: terminalId, host_tag: selectedHost?.host?.tag ?? null });

      if (newSession !== undefined) setSession(newSession);

      if (cmd === 'clear') {
        setOutput([]);
      } else if (result && typeof result === 'object' && result.type === 'nano') {
        setNanoFile({ name: result.filename, content: result.content });
        setIsNano(true);
        setCommandHistory([...commandHistory, cmd]);
      } else {
        let displayResult = result;
        if (typeof result === 'object' && result !== null) {
          displayResult = result.message !== undefined ? result.message : JSON.stringify(result);
        }
        setOutput([...output, `$ ${cmd}`, displayResult]);
        setCommandHistory([...commandHistory, cmd]);
      }

      setInput('');
      setHistoryIndex(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmptyEnter = () => {
    setOutput([...output, '$ ']);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleCtrlC = () => {
    if (isConfirming) {
      setIsConfirming(false);
      setConfirmingCommand('');
      setInput('');
      setHistoryIndex(-1);
      return;
    }
    setOutput([...output, `$ ${input}^C`]);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleNanoSave = async (content: string) => {
    const { output: result } = await executeCommand('', history, session, selectedHost?.server, {
      type: 'save_file',
      filename: nanoFile.name,
      content,
      id: terminalId,
      host_tag: selectedHost?.host?.tag ?? null,
    });
    if (result && typeof result === 'object' && result.status === 'success') {
      toast.success(result?.message ?? 'File saved');
      setNanoFile({ ...nanoFile, content });
      return;
    }
    if (result && typeof result === 'object' && result.status !== 'success') {
      toast.error(result?.message ?? 'Failed to save file');
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmitRef = useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;
  const handleEmptyEnterRef = useRef(handleEmptyEnter);
  handleEmptyEnterRef.current = handleEmptyEnter;
  const handleCtrlCRef = useRef(handleCtrlC);
  handleCtrlCRef.current = handleCtrlC;
  const exitSearchRef = useRef(exitSearch);
  exitSearchRef.current = exitSearch;
  const matchOccurrencesRef = useRef(matchOccurrences);
  matchOccurrencesRef.current = matchOccurrences;

  const terminalKeyStateRef = useRef({
    input,
    isConfirming,
    isSearch,
    isLoading,
    historyIndex,
    commandHistory,
  });
  terminalKeyStateRef.current = {
    input,
    isConfirming,
    isSearch,
    isLoading,
    historyIndex,
    commandHistory,
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const {
      input: currentInput,
      isConfirming: confirming,
      isSearch: searching,
      isLoading: loading,
      historyIndex: histIdx,
      commandHistory: cmdHist,
    } = terminalKeyStateRef.current;

    const isCtrlC = e.ctrlKey && e.key.toLowerCase() === 'c';
    const isCtrlF = e.ctrlKey && e.key.toLowerCase() === 'f';
    const isEnter = e.key === 'Enter';

    if (isCtrlF) {
      e.preventDefault();
      if (!confirming) {
        setIsSearch((prev) => { setInput(''); setSearchMatchIndex(-1); return !prev; });
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (searching) exitSearchRef.current();
      else if (confirming) handleCtrlCRef.current();
      return;
    }
    if (isCtrlC && searching) { e.preventDefault(); exitSearchRef.current(); return; }

    if (searching) {
      if (isEnter) {
        e.preventDefault();
        const matches = matchOccurrencesRef.current;
        if (matches.length > 0) setSearchMatchIndex((prev) => (prev + 1) % matches.length);
      }
      return;
    }

    if (loading && (isCtrlC || isEnter)) { e.preventDefault(); return; }

    if (isCtrlC) {
      if (confirming) { e.preventDefault(); handleCtrlCRef.current(); return; }
      const hasSelection = inputRef.current && inputRef.current.selectionStart !== inputRef.current.selectionEnd;
      if (!hasSelection) { e.preventDefault(); handleCtrlCRef.current(); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestion = getAutocomplete(currentInput);
      if (suggestion) setInput(suggestion);
    } else if (isEnter) {
      if (!currentInput.trim()) { if (!confirming) handleEmptyEnterRef.current(); }
      else handleSubmitRef.current(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = histIdx + 1;
      if (newIndex < cmdHist.length) {
        setHistoryIndex(newIndex);
        setInput(cmdHist[cmdHist.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        const newIndex = histIdx - 1;
        setHistoryIndex(newIndex);
        setInput(cmdHist[cmdHist.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  }, []);

  const sendInput = useCallback(() => {
    const {
      input: currentInput,
      isConfirming: confirming,
      isSearch: searching,
      isLoading: loading,
    } = terminalKeyStateRef.current;

    if (searching && !loading) {
      const matches = matchOccurrencesRef.current;
      if (matches.length > 0) setSearchMatchIndex((prev) => (prev + 1) % matches.length);
      return;
    }
    if (loading) return;

    if (!currentInput.trim()) {
      if (!confirming) handleEmptyEnterRef.current();
    } else handleSubmitRef.current(currentInput);
  }, []);

  const handleContainerClick = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    if (inputRef.current !== document.activeElement) {
      const len = inputLengthRef.current;
      inputRef.current?.focus({ preventScroll: true });
      inputRef.current?.setSelectionRange(len, len);
    }
  }, []);

  const handleContainerMouseDown = useCallback(() => {
    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().length > 0;
    const inputHasFocus = inputRef.current === document.activeElement;
    if (hasSelection && !inputHasFocus) selection?.removeAllRanges();
    if (!inputHasFocus) {
      const len = inputLengthRef.current;
      inputRef.current?.focus({ preventScroll: true });
      inputRef.current?.setSelectionRange(len, len);
    }
  }, []);

  return {
    hostUnavailable, input, output, session, isLoading, isNano, nanoFile, isConfirming, confirmingCommand,
    isSearch, searchMatchIndex, matchOccurrences, activeOccurrenceInItem,
    inputRef, outputRef, setIsNano, setIsLoading,
    handleChange, handleKeyDown, sendInput, handleContainerClick, handleContainerMouseDown, handleNanoSave
  };
};
