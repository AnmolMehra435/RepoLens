import { useState } from 'react'
import './FileTree.css'

function TreeNode({ name, node, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2)
  const isDir = node !== null && typeof node === 'object'

  return (
    <div className="tree-node" style={{ '--depth': depth }}>
      {isDir ? (
        <>
          <button
            className="tree-node__row tree-node__row--dir"
            onClick={() => setOpen(o => !o)}
          >
            <span className="tree-node__arrow">{open ? '▾' : '▸'}</span>
            <span className="tree-node__icon">📁</span>
            <span className="tree-node__name">{name}</span>
          </button>
          {open && (
            <div className="tree-node__children">
              {Object.entries(node).map(([k, v]) => (
                <TreeNode key={k} name={k} node={v} depth={depth + 1} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="tree-node__row">
          <span className="tree-node__spacer" />
          <span className="tree-node__icon">📄</span>
          <span className="tree-node__name">{name}</span>
        </div>
      )}
    </div>
  )
}

export default function FileTree({ tree }) {
  if (!tree || Object.keys(tree).length === 0) {
    return <p className="tree-empty">No file structure available.</p>
  }

  return (
    <div className="tree">
      {Object.entries(tree).map(([k, v]) => (
        <TreeNode key={k} name={k} node={v} depth={0} />
      ))}
    </div>
  )
}