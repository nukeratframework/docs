import { forwardRef, memo, useCallback, useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import type { VirtuosoHandle } from 'react-virtuoso';
import { highlight, renderLines } from './logic';

interface TerminalOutputProps {
  output: any[];
  searchQuery?: string;
  activeItemIndex?: number | null;
  activeOccurrenceInItem?: number;
}

const TerminalLineItem = memo(function TerminalLineItem({
  line,
  searchQuery,
  activeOcc,
}: {
  line: any;
  searchQuery?: string;
  activeOcc?: number;
}) {
  return (
    <div className="demo_terminal-line" data-terminal-line>
      {typeof line === 'string' && line.startsWith('$') ? (
        <>
          <span className="demo_bZ5cQ">$</span>
          <span className="demo_sT2hJ">
            {searchQuery ? highlight(line.slice(2), searchQuery, activeOcc) : line.slice(2)}
          </span>
        </>
      ) : (
        <span className="demo_sT2hJ">
          {typeof line === 'object'
            ? searchQuery ? highlight(JSON.stringify(line), searchQuery, activeOcc) : JSON.stringify(line)
            : renderLines(String(line), searchQuery, activeOcc)}
        </span>
      )}
    </div>
  );
});

const TerminalOutputInner = forwardRef<VirtuosoHandle, TerminalOutputProps>(
  ({ output, searchQuery, activeItemIndex, activeOccurrenceInItem }, ref) => {
    const internalRef = useRef<VirtuosoHandle>(null);

    useEffect(() => {
      internalRef.current?.scrollToIndex({ index: 0, align: 'start', behavior: 'auto' });
    }, []);

    useEffect(() => {
      if (activeItemIndex != null && activeItemIndex >= 0) {
        internalRef.current?.scrollToIndex({ index: activeItemIndex, behavior: 'smooth', align: 'center' });
      }
    }, [activeItemIndex, activeOccurrenceInItem]);

    const renderItem = useCallback(
      (index: number, line: any) => {
        const isActiveItem = index === activeItemIndex;
        const activeOcc = isActiveItem ? activeOccurrenceInItem : undefined;
        return <TerminalLineItem line={line} searchQuery={searchQuery} activeOcc={activeOcc} />;
      },
      [searchQuery, activeItemIndex, activeOccurrenceInItem]
    );

    return (
      <div className="demo_terminal-list">
      <Virtuoso
        className="demo_terminal-virtuoso"
        ref={(instance) => {
          internalRef.current = instance;
          if (typeof ref === 'function') ref(instance);
          else if (ref) ref.current = instance;
        }}
        style={{ flex: 1, minHeight: 0 }}
        initialTopMostItemIndex={0}
        followOutput={false}
        data={output}
        itemContent={renderItem}
        computeItemKey={(index, line) => {
          const key =
            typeof line === 'object'
              ? JSON.stringify(line)
              : String(line);
          return `${index}-${key.length}`;
        }}
      />
      </div>
    );
  }
);

TerminalOutputInner.displayName = 'TerminalOutput';

const TerminalOutput = memo(TerminalOutputInner);

export default TerminalOutput;
