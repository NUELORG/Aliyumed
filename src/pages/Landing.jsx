import { useNavigate } from 'react-router-dom'
import { Bell, Pill, ArrowRight } from 'lucide-react'
import styles from './Landing.module.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Pill size={24} />
          <span>Aliyumed</span>
        </div>
        <button onClick={() => navigate('/login')} className={styles.signInBtn}>
          Sign In
        </button>
      </header>

      <main className={styles.hero}>
        <div className={styles.iconWrapper}>
          <Bell size={48} />
        </div>
        
        <h1 className={styles.title}>
          Set Alarms for Your Meds
        </h1>
        
        <p className={styles.subtitle}>
          Never miss a dose. Get reminded on time, every time.
        </p>

        <button onClick={() => navigate('/login')} className={styles.ctaBtn}>
          Get Started
          <ArrowRight size={20} />
        </button>

        <p className={styles.note}>
          Free forever • No account required to try
        </p>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Aliyumed</p>
      </footer>
    </div>
  )
}
