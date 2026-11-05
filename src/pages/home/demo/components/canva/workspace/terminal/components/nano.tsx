import { useNanoEditor } from './logic';

interface NanoEditorProps {
  filename: string;
  initialContent: string;
  onExit: () => void;
  onSave: (content: string) => void;
}

const NanoEditor = ({ filename, initialContent, onExit, onSave }: NanoEditorProps) => {
  const { content, setContent, isModified, confirmExit, containerRef, handleKeyDown } = useNanoEditor(filename, initialContent, onExit, onSave);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="demo_nano-editor-container"
    >
      <div className="demo_nano-header demo_primary-text">
        <span>Editor</span>
        <span>{filename}</span>
        <span>{isModified ? 'Modified' : ''}</span>
      </div>

      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="demo_nano-textarea"
        spellCheck={false}
        disabled={confirmExit}
      />

      <div className="demo_nano-footer demo_primary-text">
        {confirmExit ? (
          <>
            <div><span className="demo_nano-key">Y</span> Yes</div>
            <div><span className="demo_nano-key">N</span> No</div>
            <div><span className="demo_nano-key">Ctrl+C</span> Cancel</div>
            <div></div>
          </>
        ) : (
          <div><span className="demo_nano-key">Ctrl+X</span> Save/Exit</div>
        )}
      </div>
    </div>
  );
};

export default NanoEditor;
