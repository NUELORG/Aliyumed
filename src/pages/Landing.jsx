import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Pill,
  ArrowRight,
  Shield,
  Smartphone,
  LineChart,
  Sparkles,
  CheckCircle2,
  Lock,
  CloudOff,
} from 'lucide-react'
import MedForgetLogo from '../components/MedForgetLogo'
import styles from './Landing.module.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.bgPattern} aria-hidden />

      <header className={styles.top}>
        <button type="button" className={styles.brandBtn} onClick={() => navigate('/')}>
          <MedForgetLogo variant="lockup" size="md" />
        </button>
        <button type="button" onClick={() => navigate('/login')} className={styles.signIn}>
          Sign in
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={`${styles.heroPanel} mf-anim`}>
            <div className={styles.heroMark}>
              <MedForgetLogo variant="mark" size="hero" />
            </div>
            <p className={styles.eyebrow}>Reminders · Insights · On-device privacy</p>
            <h1 className={styles.headline}>Never miss a dose again.</h1>
            <p className={styles.lede}>
              MedForget keeps your regimen visible: alarms when it matters, a clear today view, and
              backups you own—without clutter or noisy feeds.
            </p>

            <ul className={styles.heroBullets}>
              <li>
                <CheckCircle2 size={18} aria-hidden />
                Log doses in one tap
              </li>
              <li>
                <Lock size={18} aria-hidden />
                Data stays on your phone or browser
              </li>
              <li>
                <CloudOff size={18} aria-hidden />
                Works offline-first for your schedule
              </li>
            </ul>

            <div className={styles.heroActions}>
              <button type="button" onClick={() => navigate('/signup')} className={styles.primary}>
                Get started free
                <ArrowRight size={18} />
              </button>
              <button type="button" onClick={() => navigate('/login')} className={styles.secondary}>
                I have an account
              </button>
            </div>
            <p className={styles.micro}>Try the demo on the sign-in screen · No credit card</p>
          </div>

          <div className={styles.statStrip}>
            <div className={styles.stat}>
              <span className={styles.statValue}>7-day</span>
              <span className={styles.statLabel}>adherence view</span>
            </div>
            <div className={styles.statDivider} aria-hidden />
            <div className={styles.stat}>
              <span className={styles.statValue}>PWA</span>
              <span className={styles.statLabel}>install ready</span>
            </div>
            <div className={styles.statDivider} aria-hidden />
            <div className={styles.stat}>
              <span className={styles.statValue}>JSON</span>
              <span className={styles.statLabel}>export & import</span>
            </div>
          </div>
        </section>

        <section className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Built for real mornings</h2>
          <p className={styles.sectionSub}>Everything you need to stay consistent—nothing you don&apos;t.</p>
        </section>

        <section className={styles.grid} aria-label="Product highlights">
          <article className={styles.tile}>
            <div className={styles.tileIcon}>
              <Bell size={22} />
            </div>
            <h3 className={styles.tileTitle}>Reliable alarms</h3>
            <p className={styles.tileBody}>
              In-app sound plus notifications; install the app for stronger background behavior where
              supported.
            </p>
          </article>
          <article className={styles.tile}>
            <div className={styles.tileIcon}>
              <LineChart size={22} />
            </div>
            <h3 className={styles.tileTitle}>Adherence insights</h3>
            <p className={styles.tileBody}>
              Trends, completion, and streaks from what you mark—so you see progress at a glance.
            </p>
          </article>
          <article className={styles.tile}>
            <div className={styles.tileIcon}>
              <Smartphone size={22} />
            </div>
            <h3 className={styles.tileTitle}>Home-screen app</h3>
            <p className={styles.tileBody}>
              Add MedForget like a native app for faster access from your lock screen.
            </p>
          </article>
          <article className={styles.tile}>
            <div className={styles.tileIcon}>
              <Shield size={22} />
            </div>
            <h3 className={styles.tileTitle}>Privacy-first</h3>
            <p className={styles.tileBody}>
              Your medications and logs live locally. Export a JSON backup whenever you want a copy.
            </p>
          </article>
          <article className={styles.tile}>
            <div className={styles.tileIcon}>
              <Pill size={22} />
            </div>
            <h3 className={styles.tileTitle}>Simple editor</h3>
            <p className={styles.tileBody}>
              Name, time, dosage, optional notes—structured enough to trust, light enough to maintain.
            </p>
          </article>
          <article className={styles.tile}>
            <div className={styles.tileIcon}>
              <Sparkles size={22} />
            </div>
            <h3 className={styles.tileTitle}>Refined UI</h3>
            <p className={styles.tileBody}>
              Light and dark themes, clear typography, and layouts tuned for daily use.
            </p>
          </article>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <MedForgetLogo variant="lockup" size="sm" />
        </div>
        <p className={styles.footerLegal}>
          © {new Date().getFullYear()} MedForget. Not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  )
}
