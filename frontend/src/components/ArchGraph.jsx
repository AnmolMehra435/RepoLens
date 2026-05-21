import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
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
  fontFamily: 'Inter, system-ui, sans-serif',
  boxShadow: '0 2px 8px rgba(104,95,116,0.10)',
  minWidth: '90px',
  textAlign: 'center',
}

const edgeStyle = {
  stroke: '#CA9CE1',
  strokeWidth: 2,
}

function buildFlow(archGraph) {
  if (!archGraph?.nodes?.length) return { nodes: [], edges: [] }

  const nodes = archGraph.nodes.map(n => ({
    id: n.id,
    data: { label: n.label },
    position: n.position,
    style: nodeStyle,
  }))

  const edges = archGraph.edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: true,
    style: edgeStyle,
    type: 'smoothstep',
  }))

  return { nodes, edges }
}

export default function ArchGraph({ archGraph }) {
  const { nodes: initNodes, edges: initEdges } = buildFlow(archGraph)
  const [nodes, , onNodesChange] = useNodesState(initNodes)
  const [edges, , onEdgesChange] = useEdgesState(initEdges)

  if (!archGraph?.nodes?.length) {
    return (
      <div className="arch-empty">
        <p>No folder-level connections found.</p>
        <span>This repo may be flat or use a single directory.</span>
      </div>
    )
  }

  return (
    <div className="arch-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        attributionPosition="bottom-right"
      >
        <Background color="#d9c2d6" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor="#F2BEFC"
          maskColor="rgba(243,224,236,0.7)"
        />
      </ReactFlow>
    </div>
  )
}