import { useState } from 'react'

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow'

import 'reactflow/dist/style.css'
import './ArchGraph.css'

const nodeStyle = {
  background: '#ffffff',

  border: '1.5px solid #d9c2d6',

  borderRadius: '10px',

  padding: '10px 18px',

  fontSize: '13px',

  fontWeight: '600',

  color: '#2e2535',

  fontFamily:
    'Inter, system-ui, sans-serif',

  boxShadow:
    '0 2px 8px rgba(104,95,116,0.10)',

  minWidth: '120px',

  textAlign: 'center',
}

const edgeStyle = {
  stroke: '#CA9CE1',
  strokeWidth: 2,
}

function buildFlow(archGraph) {
  if (!archGraph?.nodes?.length) {
    return {
      nodes: [],
      edges: [],
    }
  }

  const nodes = archGraph.nodes
    .filter(node => node && node.id)

    .map((node, index) => {
      const safePosition =
        node.position &&
        typeof node.position.x ===
          'number' &&
        typeof node.position.y ===
          'number'
          ? node.position
          : {
              x: (index % 5) * 250,

              y:
                Math.floor(index / 5) *
                180,
            }

      return {
        id: String(node.id),

        data: {
          label:
            node.data?.label ||
            node.label ||
            node.id,
        },

        position: safePosition,

        style: nodeStyle,
      }
    })

  const validNodeIds = new Set(
    nodes.map(node => node.id)
  )

  const edges = (
    archGraph.edges || []
  )
    .filter(
      edge =>
        edge &&
        edge.source &&
        edge.target &&
        validNodeIds.has(
          String(edge.source)
        ) &&
        validNodeIds.has(
          String(edge.target)
        )
    )

    .map(edge => ({
      id:
        edge.id ||
        `${edge.source}-${edge.target}`,

      source: String(edge.source),

      target: String(edge.target),

      animated: true,

      style: edgeStyle,

      type: 'smoothstep',
    }))

  return {
    nodes,
    edges,
  }
}

export default function ArchGraph({
  archGraph,
}) {
  const [locked, setLocked] =
    useState(true)

  const {
    nodes,
    edges,
  } = buildFlow(archGraph)

  if (!nodes.length) {
    return (
      <div className="arch-empty">
        <p>No dependency graph found.</p>

        <span>
          This repository may have very
          few internal imports.
        </span>
      </div>
    )
  }

return (
  <div className="arch-wrapper">
    <div className="arch-header">

      <div className="arch-stats">
        <span>
          Nodes:{' '}
          {archGraph.totalNodes || 0}
        </span>

        <span>
          Edges:{' '}
          {archGraph.totalEdges || 0}
        </span>

        <button
          className={`arch-lock-btn ${
            locked ? 'locked' : ''
          }`}
          onClick={() =>
            setLocked(prev => !prev)
          }
        >
          {locked
            ? '🔒 Locked'
            : '🔓 Unlocked'}
        </button>
      </div>
    </div>

    <div className="arch-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}

        fitView

        fitViewOptions={{
          padding: 0.25,
        }}

        preventScrolling={false}

        zoomOnScroll={!locked}

        zoomOnPinch={!locked}

        zoomOnDoubleClick={!locked}

        panOnDrag={!locked}

        panOnScroll={false}

        nodesDraggable={!locked}

        elementsSelectable={!locked}

        nodesConnectable={false}

        attributionPosition="bottom-right"
      >
        <Background
          color="#d9c2d6"
          gap={20}
          size={1}
        />

        <Controls />

        <MiniMap
          nodeColor="#F2BEFC"
          maskColor="rgba(243,224,236,0.7)"
        />
      </ReactFlow>
    </div>
  </div>
)
}