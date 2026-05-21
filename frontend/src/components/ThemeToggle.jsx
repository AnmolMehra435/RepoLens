import { useTheme }
from '../context/ThemeContext'

import './ThemeToggle.css'

export default function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
    >
      {theme === 'light'
        ? '🌙 Dark'
        : '☀️ Light'}
    </button>
  )
}