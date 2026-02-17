import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, Info, Pill } from 'lucide-react'
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
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Pill size={32} />
          </div>
          <h1 className={styles.title}>Aliyumed</h1>
          <p className={styles.subtitle}>Welcome back! Please log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${styles.input} ${styles.inputWithToggle}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Logging in...' : 'Log In'}</span>
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.demoBox}>
            <div className={styles.demoHeader}>
              <Info size={16} />
              <span>Demo Credentials</span>
            </div>
            <div className={styles.demoInfo}>
              <p>Email: <code>demo@example.com</code></p>
              <p>Password: <code>password123</code></p>
            </div>
            <button 
              type="button" 
              onClick={fillDemoCredentials}
              className={styles.demoBtn}
            >
              Use Demo Account
            </button>
          </div>
        </form>

        <p className={styles.footer}>
          Don't have an account? <Link to="/signup">Create one here</Link>
        </p>
      </div>
    </div>
  )
}
