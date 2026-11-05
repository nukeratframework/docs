import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from "lucide-react";
import {
  getChildren,
  isFile,
  useLeftSideTree,
} from "./logic";

const TreeRow = ({
  name,
  depth,
  isOpen,
  hasSubs,
  isFileNode,
}: {
  name: string;
  depth: number;
  isOpen: boolean;
  hasSubs: boolean;
  isFileNode: boolean;
}) => (
  <div
    className="flex items-center gap-[3px] pr-2 py-[3px] mx-[10px] my-[1px] rounded-[6px] select-none bg-transparent cursor-pointer"
    style={{ paddingLeft: depth * 12 + 4 }}
  >
    <span className="w-3 h-3 shrink-0 text-[#999] flex items-center justify-center">
      {hasSubs ? (isOpen ? <ChevronDown size={9} /> : <ChevronRight size={9} />) : null}
    </span>
    <span className="w-[16px] h-[16px] shrink-0 flex items-center justify-center text-[#cecece]">
      {isFileNode ? <File size={16} /> : isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
    </span>
    <span className="font-[400] text-[13.5px] overflow-hidden text-ellipsis whitespace-nowrap text-[#cecece]">
      {name}
    </span>
  </div>
);

const TreeNode = ({
  name,
  node,
  depth,
  path,
  expandedPaths,
}: {
  name: string;
  node: unknown;
  depth: number;
  path: string[];
  expandedPaths: Set<string>;
}) => {
  const pathKey = path.join("/");
  const isFileNode = isFile(node);
  const children = isFileNode ? [] : getChildren(node);
  const hasSubs = children.length > 0;
  const isOpen = expandedPaths.has(pathKey);

  return (
    <>
      <TreeRow
        name={name}
        depth={depth}
        isOpen={isOpen}
        hasSubs={hasSubs}
        isFileNode={isFileNode}
      />
      {isOpen && !isFileNode && children.map(([childName, childNode]) => (
        <TreeNode
          key={childName}
          name={childName}
          node={childNode}
          depth={depth + 1}
          path={[...path, childName]}
          expandedPaths={expandedPaths}
        />
      ))}
    </>
  );
};

const LeftSide = ({
  folders,
  width,
  loading,
  disabled: _disabled,
}: {
  folders: unknown[];
  currentPath: string[];
  width: number;
  loading: boolean;
  disabled: boolean;
  onExpand: (path: string[]) => void;
  onFileClick: (path: string[]) => void;
}) => {
  const { search, displayExpanded, rootEntries } = useLeftSideTree(folders, []);

  return (
    <div className="shrink-0 dv-bg-window flex flex-col overflow-hidden select-none" style={{ width }}>
      <div style={{ borderColor: "#222323" }} className={`flex items-center px-[10px] py-[10px] border-b shrink-0 ${loading ? "pointer-events-none" : ""}`}>
        <input
          value={search}
          readOnly
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onFocus={(e) => e.currentTarget.blur()}
          placeholder="Search..."
          className="select-none w-full box-border bg-[#ffffff0b] border border-[#ffffff26] rounded-[6px] py-[1px] px-[6px] text-[13.5px] text-[#d4d4d4] outline-none font-inherit cursor-text"
        />
      </div>
      <div className={`flex-1 overflow-y-auto pt-2 pb-1 ${loading ? "pointer-events-none" : ""}`}>
        {rootEntries.map(([name, node]) => (
          <TreeNode
            key={name}
            name={name}
            node={node}
            depth={0}
            path={[name]}
            expandedPaths={displayExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export default LeftSide;
