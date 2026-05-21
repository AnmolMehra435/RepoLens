import './ScoreCard.css'

const CATEGORY_ICONS = {
  Documentation: '📄',
  Structure:     '🏗',
  DevOps:        '⚙️',
  Complexity:    '📊',
}

export default function ScoreCard({ scoring }) {
  if (!scoring) return null

  const { score, grade, label, breakdown } = scoring

  const categories = [...new Set(breakdown.map(b => b.category))]

  return (
    <div className="score">
      <div className="score__header">
        <div className="score__circle" data-grade={grade}>
          <span className="score__number">{score}</span>
          <span className="score__max">/100</span>
        </div>
        <div className="score__meta">
          <span className="score__grade">{grade}</span>
          <span className="score__label">{label}</span>
        </div>
      </div>

      <div className="score__bar-wrap">
        <div className="score__bar">
          <div className="score__bar-fill" style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="score__breakdown">
        {categories.map(cat => {
          const items = breakdown.filter(b => b.category === cat)
          const earned = items.reduce((s, i) => s + i.earned, 0)
          const max    = items.reduce((s, i) => s + i.points, 0)
          return (
            <div key={cat} className="score__category">
              <div className="score__cat-header">
                <span className="score__cat-icon">{CATEGORY_ICONS[cat]}</span>
                <span className="score__cat-name">{cat}</span>
                <span className="score__cat-pts">{earned}/{max}</span>
              </div>
              {items.map(item => (
                <div key={item.label} className="score__item">
                  <span className={`score__check ${item.passed ? 'score__check--pass' : 'score__check--fail'}`}>
                    {item.passed ? '✓' : '✗'}
                  </span>
                  <span className="score__item-label">{item.label}</span>
                  <span className="score__item-pts">+{item.points}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}