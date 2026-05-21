import './TechStack.css'

const ICONS = {
  'React': '⚛',
  'Next.js': '▲',
  'Vue': '◈',
  'Express': '⬡',
  'TypeScript': '𝚃',
  'MongoDB': '🍃',
  'Docker': '🐳',
  'Tailwind CSS': '🌊',
  'Python': '🐍',
  'Go': '◉',
  'Rust': '⚙',
}

export default function TechStack({ stack }) {
  if (!stack || stack.length === 0) {
    return (
      <p className="stack-empty">
        No known frameworks detected. The repo may use custom or unlisted tools.
      </p>
    )
  }

  return (
    <div className="stack">
      {stack.map(tech => (
        <div key={tech} className="stack__item">
          <span className="stack__icon">{ICONS[tech] || '◆'}</span>
          <span className="stack__name">{tech}</span>
        </div>
      ))}
    </div>
  )
}