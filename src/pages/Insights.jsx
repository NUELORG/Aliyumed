import { useMemo } from 'react'
import { useMedications } from '../context/MedicationContext'
import AppLayout from '../components/AppLayout'
import { TrendingUp, Flame, Target, Pill } from 'lucide-react'
import styles from './Insights.module.css'

export default function Insights() {
  const { medications, getWeeklyAdherence, getAdherenceStreak } = useMedications()

  const week = useMemo(() => getWeeklyAdherence(), [getWeeklyAdherence])
  const streak = useMemo(() => getAdherenceStreak(), [getAdherenceStreak])
  const avg =
    week.length > 0 ? Math.round(week.reduce((s, d) => s + d.percent, 0) / week.length) : 0

  return (
    <AppLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.kicker}>MedForget</p>
          <h1 className={styles.title}>Insights</h1>
          <p className={styles.sub}>Adherence based on doses marked as taken in the app.</p>
        </header>

        {medications.length === 0 ? (
          <div className={styles.empty}>
            <Pill size={40} strokeWidth={1.5} />
            <h2>No data yet</h2>
            <p>Add medications on Today to start tracking your week.</p>
          </div>
        ) : (
          <>
            <div className={styles.cards}>
              <div className={styles.card}>
                <div className={styles.cardIcon} aria-hidden>
                  <Target size={22} />
                </div>
                <div>
                  <p className={styles.cardLabel}>7-day average</p>
                  <p className={styles.cardValue}>{avg}%</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={`${styles.cardIcon} ${styles.cardIconAccent}`} aria-hidden>
                  <Flame size={22} />
                </div>
                <div>
                  <p className={styles.cardLabel}>Perfect days streak</p>
                  <p className={styles.cardValue}>{streak}</p>
                </div>
              </div>
              <div className={styles.card}>
                <div className={`${styles.cardIcon} ${styles.cardIconMuted}`} aria-hidden>
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className={styles.cardLabel}>Active medications</p>
                  <p className={styles.cardValue}>{medications.length}</p>
                </div>
              </div>
            </div>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Last 7 days</h2>
              <div className={styles.chart}>
                {week.map((d) => (
                  <div key={d.dateStr} className={styles.barWrap}>
                    <div className={styles.barTrack} title={`${d.label}: ${d.percent}%`}>
                      <div className={styles.barFill} style={{ height: `${d.percent}%` }} />
                    </div>
                    <span className={styles.barLabel}>
                      {d.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <ul className={styles.list}>
              {week.map((d) => (
                <li key={d.dateStr} className={styles.listRow}>
                  <span className={styles.listDate}>{d.label}</span>
                  <span className={styles.listMeta}>
                    {d.takenCount}/{d.total} doses · {d.percent}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </AppLayout>
  )
}
