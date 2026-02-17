import { useNavigate } from 'react-router-dom'
import { Bell, Clock, Pill, Shield, Smartphone, Zap, ChevronRight, Heart } from 'lucide-react'
import styles from './Landing.module.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      {/* Animated background elements */}
      <div className={styles.bgElements}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
        <div className={styles.floatingPill1}><Pill size={24} /></div>
        <div className={styles.floatingPill2}><Pill size={20} /></div>
        <div className={styles.floatingPill3}><Pill size={28} /></div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Pill size={24} />
          </div>
          <span>Aliyumed</span>
        </div>
        <button onClick={() => navigate('/login')} className={styles.signInBtn}>
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Bell size={14} />
            <span>Smart Medication Reminders</span>
          </div>
          
          <h1 className={styles.title}>
            Never Miss a
            <span className={styles.highlight}> Dose </span>
            Again
          </h1>
          
          <p className={styles.subtitle}>
            Set personalized alarms for your medications and receive instant notifications 
            — even when you're not using the app. Your health, always on track.
          </p>

          <div className={styles.ctaGroup}>
            <button onClick={() => navigate('/login')} className={styles.primaryBtn}>
              Get Started Free
              <ChevronRight size={20} />
            </button>
            <button onClick={() => navigate('/signup')} className={styles.secondaryBtn}>
              Create Account
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Active Users</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>99.9%</span>
              <span className={styles.statLabel}>Alarm Accuracy</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Notifications</span>
            </div>
          </div>
        </div>

        {/* Phone mockup */}
        <div className={styles.heroVisual}>
          <div className={styles.phoneMockup}>
            <div className={styles.phoneScreen}>
              <div className={styles.phoneHeader}>
                <span>9:41</span>
                <div className={styles.phoneNotch}></div>
                <div className={styles.phoneIcons}>
                  <span>●●●</span>
                </div>
              </div>
              <div className={styles.phoneContent}>
                <div className={styles.alarmCard}>
                  <div className={styles.alarmIcon}>
                    <Bell size={28} />
                  </div>
                  <div className={styles.alarmInfo}>
                    <h4>Time for Medication!</h4>
                    <p>Lisinopril - 10mg</p>
                    <span>8:00 AM</span>
                  </div>
                </div>
                <div className={styles.medList}>
                  <div className={styles.medItem}>
                    <Pill size={16} />
                    <span>Vitamin D</span>
                    <span className={styles.medTime}>9:00 AM</span>
                  </div>
                  <div className={styles.medItem}>
                    <Pill size={16} />
                    <span>Metformin</span>
                    <span className={styles.medTime}>12:30 PM</span>
                  </div>
                  <div className={styles.medItem}>
                    <Pill size={16} />
                    <span>Aspirin</span>
                    <span className={styles.medTime}>6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.phoneGlow}></div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Why Choose Aliyumed?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Bell size={24} />
            </div>
            <h3>Smart Alarms</h3>
            <p>Audio alerts that ring even when your browser is closed</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Smartphone size={24} />
            </div>
            <h3>Push Notifications</h3>
            <p>Get notified on your phone like a native app</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Clock size={24} />
            </div>
            <h3>Flexible Scheduling</h3>
            <p>Set reminders for any time that works for you</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Shield size={24} />
            </div>
            <h3>Secure & Private</h3>
            <p>Your health data stays on your device</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Pill size={20} />
            <span>Aliyumed</span>
          </div>
          <p className={styles.footerText}>
            Made with <Heart size={14} className={styles.heart} /> for better health
          </p>
          <p className={styles.copyright}>© 2026 Aliyumed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

