import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Profile.css'

const PLAN_LIMITS = { free: 5, pro: 25, max: 100 }
const PLAN_COLORS = { free: '#685F74', pro: '#8b5cf6', max: '#CA9CE1' }

export default function Profile() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  if (!user) return null

  const limit = PLAN_LIMITS[user.plan] || 5
  const used  = user.dailyAnalysisCount || 0
  const pct   = Math.min((used / limit) * 100, 100)

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-content">
        <button className="profile-back" onClick={() => navigate('/')}>
          ← Back
        </button>

        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <img className="profile-avatar" src={user.avatar} alt={user.name} />
            <div className="profile-identity">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-divider" />

          <div className="profile-section">
            <h2 className="profile-section-title">Current plan</h2>
            <div className="profile-plan">
              <span
                className="profile-plan-badge"
                style={{ background: PLAN_COLORS[user.plan] }}
              >
                {user.plan?.toUpperCase()}
              </span>
              <span className="profile-plan-desc">{limit} analyses per day</span>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Today's usage</h2>
            <div className="profile-usage">
              <div className="profile-usage-bar">
                <div
                  className="profile-usage-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="profile-usage-footer">
                <span className="profile-usage-text">
                  {used} / {limit} analyses used today
                </span>
                {used >= limit && (
                  <button
                    className="profile-usage-upgrade"
                    onClick={() => navigate('/billing')}
                  >
                    Upgrade →
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="profile-section-title">Upgrade plan</h2>
            <div className="profile-plans">
              {[
                { name: 'free', label: 'Free', limit: 5,   price: 'Free'   },
                { name: 'pro',  label: 'Pro',  limit: 25,  price: '₹49/mo' },
                { name: 'max',  label: 'Max',  limit: 100, price: '₹199/mo' },
              ].map(p => (
                <div
                  key={p.name}
                  className={`profile-plan-card ${user.plan === p.name ? 'profile-plan-card--active' : ''}`}
                >
                  <div className="profile-plan-card-header">
                    <span className="profile-plan-card-name">{p.label}</span>
                    <span className="profile-plan-card-price">{p.price}</span>
                  </div>
                  <p className="profile-plan-card-limit">{p.limit} analyses/day</p>
                  {user.plan === p.name
                    ? <span className="profile-plan-card-current">Current plan</span>
                    : <button
                        className="profile-plan-card-btn"
                        onClick={() => navigate('/billing')}
                      >
                        {p.name === 'max' ? 'Coming soon' : 'Upgrade'}
                      </button>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}