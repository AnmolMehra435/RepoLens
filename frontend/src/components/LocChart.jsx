import './LocChart.css'

const COLORS = [
  '#6c63ff', '#3ecf8e', '#f59e0b',
  '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'
]

export default function LocChart({ loc }) {
  if (!loc || Object.keys(loc).length === 0) {
    return <p className="loc-empty">No language data found.</p>
  }

  const entries = Object.entries(loc)
    .sort((a, b) => b[1].code - a[1].code)

  const total = entries.reduce((s, [, v]) => s + v.code, 0)

  return (
    <div className="loc">
      <div className="loc__bar">
        {entries.map(([lang, data], i) => (
          <div
            key={lang}
            className="loc__bar-segment"
            style={{
              width: `${(data.code / total) * 100}%`,
              background: COLORS[i % COLORS.length],
            }}
            title={`${lang}: ${data.code.toLocaleString()} lines`}
          />
        ))}
      </div>

      <div className="loc__list">
        {entries.map(([lang, data], i) => (
          <div key={lang} className="loc__item">
            <span
              className="loc__dot"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="loc__lang">{lang}</span>
            <span className="loc__files">{data.nFiles} files</span>
            <span className="loc__lines">{data.code.toLocaleString()}</span>
            <span className="loc__pct">
              {((data.code / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}