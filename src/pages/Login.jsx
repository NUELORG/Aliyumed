import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Info, ArrowLeft } from 'lucide-react'
import MedForgetLogo from '../components/MedForgetLogo'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)

    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }

  const fillDemoCredentials = () => {
    setEmail('demo@example.com')
    setPassword('password123')
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.backHome}>
          <ArrowLeft size={18} aria-hidden />
          Back to home
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <MedForgetLogo variant="lockup" size="lg" className={styles.headerLogo} />
          <h1 className={styles.authHeading}>Log in</h1>
          <p className={styles.subtitle}>Manage reminders, insights, and backups on this device.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="login-email">
              Email address
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <Mail size={18} />
              </span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={styles.input}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <Lock size={18} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${styles.input} ${styles.inputWithToggle}`}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Logging in…' : 'Log in'}</span>
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <div className={styles.demoBox}>
            <div className={styles.demoHeader}>
              <Info size={16} />
              <span>Demo account</span>
            </div>
            <div className={styles.demoInfo}>
              <p>
                Email: <code>demo@example.com</code>
              </p>
              <p>
                Password: <code>password123</code>
              </p>
            </div>
            <button type="button" onClick={fillDemoCredentials} className={styles.demoBtn}>
              Use demo credentials
            </button>
          </div>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}
