import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import './Home.css'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import Navbar from '../components/Navbar'

const PLAN_LIMITS = { free: 5, pro: 25, max: 100 }

function UsageBar({ user }) {
  if (!user) return null

  const limit = PLAN_LIMITS[user.plan] || 5
  const used  = user.dailyAnalysisCount || 0
  const pct   = Math.min((used / limit) * 100, 100)
  const remaining = limit - used
  const isNearLimit = pct >= 80
  const isAtLimit   = used >= limit

  return (
    <div className="home__usage">
      <div className="home__usage-top">
        <span className="home__usage-label">
          Daily usage
          <span className="home__usage-plan">{user.plan?.toUpperCase()}</span>
        </span>
        <span className={`home__usage-count ${isAtLimit ? 'home__usage-count--danger' : isNearLimit ? 'home__usage-count--warn' : ''}`}>
          {used} / {limit}
        </span>
      </div>

      <div className="home__usage-bar">
        <div
          className={`home__usage-fill ${isAtLimit ? 'home__usage-fill--danger' : isNearLimit ? 'home__usage-fill--warn' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {isAtLimit && (
        <p className="home__usage-msg home__usage-msg--danger">
          Daily limit reached. <a href="/billing">Upgrade your plan</a> to continue.
        </p>
      )}
      {isNearLimit && !isAtLimit && (
        <p className="home__usage-msg home__usage-msg--warn">
          {remaining} {remaining === 1 ? 'analysis' : 'analyses'} remaining today.{' '}
          <a href="/billing">Upgrade for more.</a>
        </p>
      )}
    </div>
  )
}

export default function Home() {
  const [url, setUrl]         = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()
  const { user, setUser }     = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!url.match(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/)) {
      setError('Please enter a valid GitHub repo URL')
      return
    }

    if (!user) {
      setShowAuth(true)
      return
    }

    setLoading(true)

    try {
      const { data } = await api.post('/analyze', { repoUrl: url })
      // increment local count so bar updates instantly
      setUser(prev => ({
        ...prev,
        dailyAnalysisCount: (prev.dailyAnalysisCount || 0) + 1,
      }))
      navigate(`/report/${data.reportId}`)
    } catch (err) {
      if (err.response?.status === 403) {
        setError(`Daily limit reached (${PLAN_LIMITS[user.plan] || 5}/day). Upgrade your plan for more analyses.`)
      } else {
        setError('Server error. Make sure backend is running.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <Navbar />

      <div className="home__hero">
        <span className="home__badge">Free & Open</span>

        <h1 className="home__title">
          Understand any repo
          <br />
          <span className="home__title-accent">in seconds</span>
        </h1>

        <p className="home__subtitle">
          Paste a public GitHub URL and get instant insights — file
          structure, language breakdown, tech stack, and architecture.
        </p>

        <form className="home__form" onSubmit={handleSubmit}>
          <div className="home__input-row">
            <input
              className="home__input"
              type="text"
              placeholder="https://github.com/user/repo"
              value={url}
              onChange={e => setUrl(e.target.value)}
              disabled={loading}
            />
            <button
              className="home__btn"
              type="submit"
              disabled={loading || (user && user.dailyAnalysisCount >= (PLAN_LIMITS[user.plan] || 5))}
            >
              {loading ? 'Analyzing...' : 'Analyze →'}
            </button>
          </div>
          {error && <p className="home__error">{error}</p>}
        </form>

        <UsageBar user={user} />

        <div className="home__examples">
          <span className="home__examples-label">Try:</span>
          {[
            'https://github.com/expressjs/express',
            'https://github.com/facebook/react',
            'https://github.com/vitejs/vite',
          ].map(ex => (
            <button
              key={ex}
              className="home__example-chip"
              onClick={() => setUrl(ex)}
            >
              {ex.replace('https://github.com/', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="home__features">
        {[
          { icon: '🌿', title: 'File structure',      desc: 'Interactive expandable tree of every file and folder' },
          { icon: '📊', title: 'LOC analytics',       desc: 'Lines of code broken down by language with visual charts' },
          { icon: '🔬', title: 'Tech stack',          desc: 'Auto-detected frameworks, libraries, and tools' },
          { icon: '📝', title: 'Project description', desc: 'Smart repository summaries with detected architecture and stack' },
          { icon: '🏆', title: 'Project score',       desc: 'Evaluate maintainability, structure, complexity, and quality' },
          { icon: '🕸️', title: 'Architecture graph',  desc: 'Visualize folder relationships and dependency flow instantly' },
          { icon: '🔗', title: 'Shareable reports',   desc: 'Generate public report links to showcase your repositories' },
        ].map(f => (
          <div key={f.title} className="home__feature-card">
            <span className="home__feature-icon">{f.icon}</span>
            <h3 className="home__feature-title">{f.title}</h3>
            <p className="home__feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  )
}