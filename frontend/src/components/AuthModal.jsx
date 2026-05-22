import './AuthModal.css'

export default function AuthModal({
  open,
  onClose,
}) {
  if (!open) return null

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button
          className="auth-close"
          onClick={onClose}
        >
          ×
        </button>

        <h2>
          Continue to RepoLens
        </h2>

        <p>
          Sign in to analyze repositories,
          save report history, and unlock
           premium features.
        </p>

        <a
          className="auth-btn github"
          href={`${import.meta.env.VITE_API_URL}/auth/github`}
        >
          Continue with GitHub
        </a>

        <button
          className="auth-btn google"
          disabled
        >
          Google OAuth Coming Soon
        </button>
      </div>
    </div>
  )
}