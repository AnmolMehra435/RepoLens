import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ReactMarkdown from 'react-markdown'
import api from '../lib/axios'
import './ProFeatures.css'

function ProModal({ title, content, onClose }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const ext      = title.includes('README') ? 'md' : 'md'
    const filename = title.includes('README') ? 'README.md' : 'architecture-suggestion.md'
    const blob     = new Blob([content], { type: 'text/markdown' })
    const url      = URL.createObjectURL(blob)
    const a        = document.createElement('a')
    a.href         = url
    a.download     = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pro-modal-overlay" onClick={onClose}>
      <div className="pro-modal" onClick={e => e.stopPropagation()}>
        <div className="pro-modal-header">
          <h2 className="pro-modal-title">{title}</h2>
          <div className="pro-modal-actions">
            <button
              className={`pro-modal-copy ${copied ? 'pro-modal-copy--done' : ''}`}
              onClick={handleCopy}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button className="pro-modal-download" onClick={handleDownload}>
              Download .md
            </button>
            <button className="pro-modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="pro-modal-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

function LockedOverlay() {
  const navigate = useNavigate()
  return (
    <div className="pro-locked">
      <span className="pro-locked-icon">🔒</span>
      <p className="pro-locked-text">Pro feature</p>
      <button
        className="pro-locked-btn"
        onClick={() => navigate('/billing')}
      >
        Upgrade to Pro
      </button>
    </div>
  )
}

export default function ProFeatures({ reportId }) {
  const { user }    = useAuth()
  const isPro       = user?.plan === 'pro' || user?.plan === 'max'

  const [readmeLoading,  setReadmeLoading]  = useState(false)
  const [archLoading,    setArchLoading]    = useState(false)
  const [readmeError,    setReadmeError]    = useState('')
  const [archError,      setArchError]      = useState('')
  const [modal, setModal] = useState(null)

  async function handleReadme() {
    setReadmeLoading(true)
    setReadmeError('')
    try {
      const { data } = await api.post(`/pro/readme/${reportId}`)
      setModal({ title: 'Generated README.md', content: data.readme })
    } catch (err) {
      setReadmeError(err.response?.data?.message || 'Failed to generate README')
    } finally {
      setReadmeLoading(false)
    }
  }

  async function handleArchitecture() {
    setArchLoading(true)
    setArchError('')
    try {
      const { data } = await api.post(`/pro/architecture/${reportId}`)
      setModal({ title: 'Architecture Suggestion', content: data.suggestion })
    } catch (err) {
      setArchError(err.response?.data?.message || 'Failed to generate suggestion')
    } finally {
      setArchLoading(false)
    }
  }

  return (
    <>
      <div className="pro-features">
        <div className="pro-feature-card">
          <div className="pro-feature-header">
            <div>
              <h3 className="pro-feature-title">README Generator</h3>
              <p className="pro-feature-desc">
                Auto-generate a full README.md with badges, setup instructions, and API docs
              </p>
            </div>
            {!isPro && <span className="pro-badge">PRO</span>}
          </div>

          {isPro ? (
            <>
              <button
                className="pro-feature-btn"
                onClick={handleReadme}
                disabled={readmeLoading}
              >
                {readmeLoading ? (
                  <><span className="pro-btn-spinner" /> Generating...</>
                ) : (
                  'Generate README'
                )}
              </button>
              {readmeError && <p className="pro-feature-error">{readmeError}</p>}
            </>
          ) : (
            <LockedOverlay />
          )}
        </div>

        <div className="pro-feature-card">
          <div className="pro-feature-header">
            <div>
              <h3 className="pro-feature-title">Architecture Suggestion</h3>
              <p className="pro-feature-desc">
                Get an optimized folder structure based on your stack and current project layout
              </p>
            </div>
            {!isPro && <span className="pro-badge">PRO</span>}
          </div>

          {isPro ? (
            <>
              <button
                className="pro-feature-btn"
                onClick={handleArchitecture}
                disabled={archLoading}
              >
                {archLoading ? (
                  <><span className="pro-btn-spinner" /> Analyzing...</>
                ) : (
                  'Suggest Structure'
                )}
              </button>
              {archError && <p className="pro-feature-error">{archError}</p>}
            </>
          ) : (
            <LockedOverlay />
          )}
        </div>
      </div>

      {modal && (
        <ProModal
          title={modal.title}
          content={modal.content}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}