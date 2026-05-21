import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

import LocChart from '../components/LocChart'
import FileTree from '../components/FileTree'
import TechStack from '../components/TechStack'
import ArchDiagram from '../components/ArchDiagram'
import Summary from '../components/Summary'
import ScoreCard from '../components/ScoreCard'
import ShareButton from '../components/ShareButton'
import Navbar
from '../components/Navbar'

import './Report.css'

export default function Report() {
  const { id } = useParams()

  const navigate = useNavigate()

  const [report, setReport] = useState(null)

  const [status, setStatus] =
    useState('processing')

  const [graphMode, setGraphMode] =
    useState('folder')

    const [theme, setTheme] = useState(
      localStorage.getItem('theme') || 'light'
    )

  useEffect(() => {
    let timeoutId

    const poll = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/reports/${id}`
        )

        setReport(data)

        setStatus(data.status)

        if (data.status === 'processing') {
          timeoutId = setTimeout(
            poll,
            2000
          )
        }
      } catch (err) {
        setStatus('error')
        console.log(err.message)
      }
    }

    poll()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [id])

  useEffect(() => {

  document.body.setAttribute(
    'data-theme',
    theme
  )

  localStorage.setItem(
    'theme',
    theme
  )

}, [theme])

  if (status === 'processing') {
    return (
      <div className="report-loading">
        <div className="report-loading__spinner" />

        <p>Analyzing repository...</p>

        <span>
          cloning · counting lines ·
          detecting stack · generating
          architecture
        </span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="report-error">
        <h2>Analysis failed</h2>

        <p>
          {report?.error ||
            'Something went wrong.'}
        </p>

        <button
          onClick={() => navigate('/')}
        >
          Try another repo
        </button>
      </div>
    )
  }

  const totalLines = Object.values(
    report?.loc || {}
  ).reduce((sum, item) => {
    return sum + (item.code || 0)
  }, 0)

  const currentGraph =
    graphMode === 'file'
      ? report?.fileArchGraph
      : report?.archGraph

  return (
    <div className="report">
      <Navbar />
      <header className="report__header">
        <button
          className="report__back"
          onClick={() => navigate('/')}
        >
          ← RepoLens
        </button>
        <div className="report__header-main">
          <h1 className="report__title">
            {report.repoName}
          </h1>

          <a
            className="report__url"
            href={report.repoUrl}
            target="_blank"
            rel="noreferrer"
          >
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
          {
            label: 'Lines of code',
            value:
              totalLines.toLocaleString(),
          },

          {
            label: 'Languages',
            value: Object.keys(
              report.loc || {}
            ).length,
          },

          {
            label: 'Tech detected',
            value:
              report.techStack?.length ||
              0,
          },

          {
            label: 'Repo score',
            value:
              report.scoring?.score
                ? `${report.scoring.score}/100`
                : '—',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="report__stat-card"
          >
            <span className="report__stat-value">
              {stat.value}
            </span>

            <span className="report__stat-label">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="report__grid">
        <section className="report__section">
          <h2 className="report__section-title">
            Language breakdown
          </h2>

          <LocChart loc={report.loc} />
        </section>

        <section className="report__section techstack">
          <h2 className="report__section-title">
            Tech stack
          </h2>

          <TechStack
            stack={report.techStack}
          />
        </section>

        <section className="report__section report__section--full">
          <h2 className="report__section-title">File architecture</h2>
          <ArchDiagram diagram={report.diagram} />
        </section>

        <section className="report__section report__section--full">
          <h2 className="report__section-title">
            File structure
          </h2>

          <FileTree tree={report.fileTree} />
        </section>

        <section className="report__section techstack">
          <h2 className="report__section-title">
            Repo score
          </h2>

          <ScoreCard
            scoring={report.scoring}
          />
        </section>
      </div>
    </div>
  )
}