import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LocChart from '../components/LocChart'
import FileTree from '../components/FileTree'
import TechStack from '../components/TechStack'
import ArchGraph from '../components/ArchGraph'
import Summary from '../components/Summary'
import ScoreCard from '../components/ScoreCard'
import ShareButton from '../components/ShareButton'
import './Report.css'

export default function Report() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState('processing')

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reports/${id}`)
        const data = await res.json()
        setReport(data)
        setStatus(data.status)
        if (data.status === 'processing') setTimeout(poll, 2000)
      } catch {
        setStatus('error')
      }
    }
    poll()
  }, [id])

  if (status === 'processing') {
    return (
      <div className="report-loading">
        <div className="report-loading__spinner" />
        <p>Analyzing repository...</p>
        <span>cloning · counting lines · detecting stack · scoring</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="report-error">
        <h2>Analysis failed</h2>
        <p>{report?.error || 'Something went wrong.'}</p>
        <button onClick={() => navigate('/')}>Try another repo</button>
      </div>
    )
  }

  const totalLines = Object.values(report.loc || {})
    .reduce((sum, l) => sum + l.code, 0)

  return (
    <div className="report">
      <header className="report__header">
        <button className="report__back" onClick={() => navigate('/')}>← RepoLens</button>
        <div className="report__header-main">
          <h1 className="report__title">{report.repoName}</h1>
          <a className="report__url" href={report.repoUrl} target="_blank" rel="noreferrer">
            {report.repoUrl}
          </a>
        </div>
        <ShareButton reportId={id} />
      </header>

      {report.summary && (
        <div className="report__summary-wrap">
          <Summary summary={report.summary} />
        </div>
      )}

      <div className="report__stats">
        {[
          { label: 'Lines of code',  value: totalLines.toLocaleString() },
          { label: 'Languages',      value: Object.keys(report.loc || {}).length },
          { label: 'Tech detected',  value: report.techStack?.length || 0 },
          { label: 'Repo score',     value: report.scoring?.score ? `${report.scoring.score}/100` : '—' },
        ].map(s => (
          <div key={s.label} className="report__stat-card">
            <span className="report__stat-value">{s.value}</span>
            <span className="report__stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="report__grid">
        <section className="report__section">
          <h2 className="report__section-title">Language breakdown</h2>
          <LocChart loc={report.loc} />
        </section>

        <section className="report__section">
          <h2 className="report__section-title">Tech stack</h2>
          <TechStack stack={report.techStack} />
        </section>

        <section className="report__section report__section--full">
          <h2 className="report__section-title">Architecture graph</h2>
          <ArchGraph archGraph={report.archGraph} />
        </section>

        <section className="report__section report__section--full">
          <h2 className="report__section-title">File structure</h2>
          <FileTree tree={report.fileTree} />
        </section>

        <section className="report__section">
          <h2 className="report__section-title">Repo score</h2>
          <ScoreCard scoring={report.scoring} />
        </section>
      </div>
    </div>
  )
}