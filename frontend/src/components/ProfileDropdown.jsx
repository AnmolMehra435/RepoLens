import { useState } from 'react'

import { useAuth }
from '../context/AuthContext'

import './ProfileDropdown.css'

import { Link }
from 'react-router-dom'
export default function ProfileDropdown() {
  const {
    user,
    logout,
  } = useAuth()

  const [open, setOpen] =
    useState(false)

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
        Sign in
      </a>
    )
  }

  return (
    <div className="profile">
      <button
        className="profile-trigger"
        onClick={() =>
          setOpen(prev => !prev)
        }
      >
        <img
          src={user.avatar}
          alt={user.name}
        />

        <span>{user.name}</span>
      </button>

      {open && (
        <div className="profile-dropdown">
          <Link to="/history">
            History
            </Link>

          <button>
            Billing
          </button>

          <button
            onClick={handleLogout}
          >
            Logout
          </button>

          {/* <a
            href="https://github.com/logout"
            target="_blank"
            rel="noreferrer"
            >
            Switch GitHub Account
            </a> */}
        </div>
      )}
    </div>
  )
}