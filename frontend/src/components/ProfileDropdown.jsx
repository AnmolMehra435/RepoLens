import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './ProfileDropdown.css'

export default function ProfileDropdown() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    window.location.href = '/'
  }

  if (!user) {
    return (
      <a
        className="profile-login-btn"
        href="http://localhost:5000/api/auth/github"
      >
        Sign in with GitHub
      </a>
    )
  }

  return (
    <div className="profile">
      <button
        className="profile-trigger"
        onClick={() => setOpen(prev => !prev)}
      >
        <img src={user.avatar} alt={user.name} />
        <span>{user.name}</span>
      </button>

      {open && (
        <>
          <div
            className="profile-overlay"
            onClick={() => setOpen(false)}
          />
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              <p className="profile-dropdown-name">{user.name}</p>
              <p className="profile-dropdown-plan">{user.plan?.toUpperCase()} plan</p>
            </div>
            <div className="profile-dropdown-divider" />
            <Link to="/profile" onClick={() => setOpen(false)}>
              <button>Profile</button>
            </Link>
            <Link to="/history" onClick={() => setOpen(false)}>
              <button>History</button>
            </Link>
            <Link to="/billing" onClick={() => setOpen(false)}>
              <button>Billing</button>
            </Link>
            <div className="profile-dropdown-divider" />
            <button className="profile-dropdown-logout" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}