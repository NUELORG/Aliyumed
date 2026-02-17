import { useAlarm } from '../context/AlarmContext'
import { useMedications } from '../context/MedicationContext'
import { Bell, X, Clock, Pill, Check, AlarmClock } from 'lucide-react'
import styles from './AlarmModal.module.css'

export default function AlarmModal() {
  const { isRinging, currentAlarm, stopAlarm, snoozeAlarm } = useAlarm()
  const { markAsTaken } = useMedications()

  if (!isRinging || !currentAlarm) return null

  const handleTaken = () => {
    if (currentAlarm.id !== 'test') {
      markAsTaken(currentAlarm.id)
    }
    stopAlarm()
  }

  const handleSnooze = (minutes) => {
    snoozeAlarm(minutes)
  }

  const handleDismiss = () => {
    stopAlarm()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconContainer}>
          <div className={styles.pulseRing}></div>
          <div className={styles.pulseRing} style={{ animationDelay: '0.5s' }}></div>
          <div className={styles.iconCircle}>
            <Bell size={40} className={styles.bellIcon} />
          </div>
        </div>

        <h2 className={styles.title}>Time for your medication!</h2>
        
        <div className={styles.medInfo}>
          <h3 className={styles.medName}>{currentAlarm.name}</h3>
          <div className={styles.medDetails}>
            <span className={styles.detail}>
              <Pill size={16} />
              {currentAlarm.dosage}
            </span>
            <span className={styles.detail}>
              <Clock size={16} />
              {currentAlarm.time}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleTaken} className={styles.takenBtn}>
            <Check size={20} />
            Mark as Taken
          </button>
          
          <div className={styles.snoozeGroup}>
            <span className={styles.snoozeLabel}>
              <AlarmClock size={16} />
              Snooze:
            </span>
            <button onClick={() => handleSnooze(5)} className={styles.snoozeBtn}>
              5 min
            </button>
            <button onClick={() => handleSnooze(10)} className={styles.snoozeBtn}>
              10 min
            </button>
            <button onClick={() => handleSnooze(15)} className={styles.snoozeBtn}>
              15 min
            </button>
          </div>

          <button onClick={handleDismiss} className={styles.dismissBtn}>
            <X size={18} />
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

