import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import './ArchDiagram.css'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor:       '#F2BEFC',
    primaryTextColor:   '#2e2535',
    primaryBorderColor: '#CA9CE1',
    lineColor:          '#CA9CE1',
    secondaryColor:     '#EAD5E6',
    tertiaryColor:      '#F3E0EC',
    background:         '#ffffff',
    mainBkg:            '#F3E0EC',
    nodeBorder:         '#CA9CE1',
    clusterBkg:         '#EAD5E6',
    titleColor:         '#2e2535',
    edgeLabelBackground:'#ffffff',
    fontFamily:         'Inter, system-ui, sans-serif',
    fontSize:           '14px',
  },
})

let diagramCounter = 0

export default function ArchDiagram({ diagram }) {
  const containerRef = useRef(null)
  const [error, setError]   = useState(null)
  const [zoom, setZoom]     = useState(1)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!diagram || !containerRef.current) return

    const id = `mermaid-${++diagramCounter}`

    mermaid.render(id, diagram)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg

          const svgEl = containerRef.current.querySelector('svg')
          if (svgEl) {
            svgEl.style.width   = '100%'
            svgEl.style.height  = 'auto'
            svgEl.style.maxWidth= '100%'
          }
        }
      })
      .catch(err => {
        console.error('Mermaid render error:', err)
        setError('Could not render diagram.')
      })
  }, [diagram])

  function handleZoomIn()  { setZoom(z => Math.min(z + 0.2, 3)) }
  function handleZoomOut() { setZoom(z => Math.max(z - 0.2, 0.4)) }
  function handleReset()   { setZoom(1) }

  function handleCopy() {
    navigator.clipboard.writeText(diagram)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!diagram) {
    return (
      <div className="archd-empty">
        <p>No diagram available.</p>
        <span>Groq API key may not be configured.</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="archd-empty">
        <p>Diagram render failed.</p>
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="archd">
      <div className="archd__toolbar">
        <div className="archd__zoom-controls">
          <button onClick={handleZoomOut}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn}>+</button>
          <button onClick={handleReset} className='reset'>Reset</button>
        </div>
        <button
          className={`archd__copy ${copied ? 'archd__copy--done' : ''}`}
          onClick={handleCopy}
        >
          {copied ? '✓ Copied' : 'Copy Mermaid'}
        </button>
      </div>

      <div className="archd__scroll">
        <div
          className="archd__inner"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          ref={containerRef}
        />
      </div>
    </div>
  )
}