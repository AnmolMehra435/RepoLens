import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../lib/axios'
import './Billing.css'

const PLANS = [
  {
    name:        'free',
    label:       'Free',
    price:       '₹0',
    period:      'forever',
    analyses:    5,
    features:    [
      '5 analyses per day',
      'File structure viewer',
      'LOC analytics',
      'Tech stack detection',
      'Repo scoring',
      'Shareable reports',
    ],
    cta:         'Current plan',
    disabled:    true,
    comingSoon:  false,
  },
  {
    name:        'pro',
    label:       'Pro',
    price:       '₹49',
    period:      'per month',
    analyses:    25,
    features:    [
      '25 analyses per day',
      'Everything in Free',
      'AI architecture diagram',
      'Create README',
      'Priority processing',
    ],
    cta:         'Upgrade to Pro',
    disabled:    false,
    comingSoon:  false,
    highlight:   true,
  },
  {
    name:        'max',
    label:       'Max',
    price:       '₹199',
    period:      'per month',
    analyses:    100,
    features:    [
      '100 analyses per day',
      'Everything in Pro',
      'Team sharing',
      'API access',
      'Priority support',
    ],
    cta:         'Coming Soon',
    disabled:    true,
    comingSoon:  true,
  },
]

export default function Billing() {
  const { user, setUser } = useAuth()
  const navigate          = useNavigate()
  const [loading, setLoading] = useState(null)
  const [error, setError]     = useState('')

  async function handleUpgrade(plan) {
    if (plan === 'free' || plan === 'max') return
    if (user?.plan === plan) return

    setLoading(plan)
    setError('')

    try {
      const { data } = await api.post('/payment/create-order', { plan })

      const options = {
        key:          data.keyId,
        amount:       data.amount,
        currency:     data.currency,
        name:         'RepoLens',
        description:  `Pro Plan — 25 analyses/day`,
        order_id:     data.orderId,
        prefill: {
          name:  data.name,
          email: data.email,
        },
        theme: {
          color: '#CA9CE1',
        },
        handler: async function (response) {
          try {
            const { data: verifyData } = await api.post('/payment/verify-payment', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              plan,
            })

            if (verifyData.success) {
              setUser(prev => ({ ...prev, plan: verifyData.plan }))
              navigate('/profile')
            }
          } catch {
            setError('Payment verified but update failed. Please contact support.')
          } finally {
            setLoading(null)
          }
        },
        modal: {
          ondismiss: () => setLoading(null),
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', function () {
        setError('Payment failed. Please try again.')
        setLoading(null)
      })

      rzp.open()

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
      setLoading(null)
    }
  }

  return (
    <div className="billing-page">
      <Navbar />

      <div className="billing-content">
        <button className="billing-back" onClick={() => navigate('/profile')}>
          ← Back to profile
        </button>

        <div className="billing-header">
          <h1 className="billing-title">Choose your plan</h1>
          <p className="billing-subtitle">
            Upgrade to analyze more repos and unlock powerful features
          </p>
        </div>

        {error && <p className="billing-error">{error}</p>}

        <div className="billing-grid">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`billing-card ${plan.highlight ? 'billing-card--highlight' : ''} ${user?.plan === plan.name ? 'billing-card--current' : ''}`}
            >
              {plan.highlight && (
                <span className="billing-badge">Most popular</span>
              )}
              {plan.comingSoon && (
                <span className="billing-badge billing-badge--soon">Coming soon</span>
              )}

              <div className="billing-card-header">
                <h2 className="billing-plan-name">{plan.label}</h2>
                <div className="billing-price-wrap">
                  <span className="billing-price">{plan.price}</span>
                  <span className="billing-period">{plan.period}</span>
                </div>
              </div>

              <ul className="billing-features">
                {plan.features.map(f => (
                  <li key={f} className="billing-feature">
                    <span className="billing-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`billing-cta ${plan.highlight ? 'billing-cta--primary' : ''} ${plan.comingSoon ? 'billing-cta--soon' : ''}`}
                disabled={plan.disabled || user?.plan === plan.name || loading === plan.name}
                onClick={() => handleUpgrade(plan.name)}
              >
                {loading === plan.name
                  ? 'Opening...'
                  : user?.plan === plan.name
                    ? 'Current plan'
                    : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="billing-note">
          Payments are processed securely by Razorpay. Cancel anytime.
        </p>
      </div>
    </div>
  )
}