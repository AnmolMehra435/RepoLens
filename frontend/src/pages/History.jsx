import {
  useEffect,
  useState,
} from 'react'

import { Link }
from 'react-router-dom'
import { useNavigate }
from 'react-router-dom'

import api from '../lib/axios'
import Navbar
from '../components/Navbar'
import './History.css'

export default function History() {
  const [reports, setReports] =
    useState([])
    const navigate = useNavigate()

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data } =
          await api.get(
            '/reports/history'
          )

        setReports(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="history-loading">
        Loading history...
      </div>
    )
  }

  return (
    <div className="history-page">
        <Navbar />
      <div className="history-header">
        <button
        className="history-back"
        onClick={() => navigate('/')}
        >
        ← Back to Home
        </button>
        <h1>Your Reports</h1>

        <p>
          Previously analyzed
          repositories
        </p>
      </div>

      <div className="history-grid">
        {reports.map(report => (
          <Link
            key={report._id}
            to={`/report/${report._id}`}
            className="history-card"
          >
            <h3>
              {report.repoName}
            </h3>

            <p>
              {report.repoUrl}
            </p>

            <span>
              Score:{' '}
              {report.scoring?.score ||
                '—'}
              /100
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}