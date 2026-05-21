import { useState } from 'react'
import './ShareButton.css'

export default function ShareButton({ reportId }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const url = `${window.location.origin}/report/${reportId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button className={`share-btn ${copied ? 'share-btn--copied' : ''}`} onClick={handleCopy}>
      {copied ? '✓ Copied!' : '🔗 Share report'}
    </button>
  )
}