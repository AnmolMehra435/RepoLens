import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!url.match(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/)) {
      setError('Please enter a valid GitHub repo URL')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: url }),
      })
      const data = await res.json()
      navigate(`/report/${data.reportId}`)
    } catch {
      setError('Server error. Make sure the backend is running.')
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <nav className="home__nav">
        {/* <div className="home__logo">
          <div className="home__logo-icon">🔍</div>
          <span className="home__logo-name">Repo<span>Lens</span></span>
        </div> */}
        <span className="home__logo-name">Repo<span>Lens</span></span>
      </nav>

      <div className="home__hero">
        <span className="home__badge">Free & Open</span>

        <h1 className="home__title">
          Understand any repo
          <br />
          <span className="home__title-accent">in seconds</span>
        </h1>

        <p className="home__subtitle">
          Paste a public GitHub URL and get instant insights — file structure,
          language breakdown, tech stack, and architecture.
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
            <button className="home__btn" type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze →'}
            </button>
          </div>
          {error && <p className="home__error">{error}</p>}
        </form>

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
          { icon: '🌿', title: 'File structure', desc: 'Interactive expandable tree of every file and folder' },
          { icon: '📊', title: 'LOC analytics', desc: 'Lines of code broken down by language with visual charts' },
          { icon: '🔬', title: 'Tech stack', desc: 'Auto-detected frameworks, libraries, and tools' },
        ].map(f => (
          <div key={f.title} className="home__feature-card">
            <span className="home__feature-icon">{f.icon}</span>
            <h3 className="home__feature-title">{f.title}</h3>
            <p className="home__feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}