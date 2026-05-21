import ThemeToggle
from './ThemeToggle'

import ProfileDropdown
from './ProfileDropdown'

import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">
          Repo<span>Lens</span>
        </h1>
      </div>

      <div className="navbar-center">
        <ThemeToggle />
      </div>

      <div className="navbar-right">
        <ProfileDropdown />
      </div>
    </nav>
  )
}