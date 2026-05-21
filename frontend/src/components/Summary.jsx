import './Summary.css'

export default function Summary({ summary, repoName }) {
  if (!summary) return null

  return (
    <div className="summary">
      <div className="summary__icon">🔬</div>
      <p className="summary__text">{summary}</p>
    </div>
  )
}