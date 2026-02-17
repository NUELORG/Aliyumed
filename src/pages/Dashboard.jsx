import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMedications } from '../context/MedicationContext'
import { useAlarm } from '../context/AlarmContext'
import { 
  Bell, 
  Plus, 
  Clock, 
  Pill, 
  Check, 
  Edit2, 
  Trash2, 
  LogOut,
  User,
  Calendar,
  ChevronRight,
  BellRing,
  Volume2
} from 'lucide-react'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { medications, takenToday, markAsTaken, markAsNotTaken, deleteMedication, getNextReminder } = useMedications()
  const { notificationPermission, requestPermission, testAlarm } = useAlarm()
  const [nextReminder, setNextReminder] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showPermissionBanner, setShowPermissionBanner] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setNextReminder(getNextReminder())
    }, 1000)
    
    setNextReminder(getNextReminder())
    
    return () => clearInterval(timer)
  }, [getNextReminder])

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleTake = (id) => {
    if (takenToday[id]) {
      markAsNotTaken(id)
    } else {
      markAsTaken(id)
    }
  }

  const handleDelete = (id) => {
    deleteMedication(id)
    setShowDeleteConfirm(null)
  }

  const handleEnableNotifications = async () => {
    await requestPermission()
    setShowPermissionBanner(false)
  }

  const sortedMedications = [...medications].sort((a, b) => {
    return a.time.localeCompare(b.time)
  })

  const takenCount = Object.keys(takenToday).length
  const totalCount = medications.length
  const adherencePercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <User size={20} />
            </div>
            <div>
              <p className={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</p>
              <p className={styles.date}>{formatDate()}</p>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutBtn} title="Log out">
            <LogOut size={20} />
          </button>
        </div>
        
        {totalCount > 0 && (
          <div className={styles.progressBar}>
            <div className={styles.progressInfo}>
              <span>Today's Progress</span>
              <span>{takenCount} of {totalCount} taken</span>
            </div>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${adherencePercent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className={styles.main}>
        {showPermissionBanner && notificationPermission !== 'granted' && (
          <div className={styles.permissionBanner}>
            <div className={styles.permissionContent}>
              <BellRing size={24} />
              <div>
                <h4>Enable Notifications</h4>
                <p>Allow notifications to get alarms even when you leave this page</p>
              </div>
            </div>
            <div className={styles.permissionActions}>
              <button onClick={handleEnableNotifications} className={styles.enableBtn}>
                <Volume2 size={16} />
                Enable Now
              </button>
              <button onClick={() => setShowPermissionBanner(false)} className={styles.dismissBannerBtn}>
                Later
              </button>
            </div>
          </div>
        )}

        <button onClick={testAlarm} className={styles.testAlarmBtn}>
          <BellRing size={16} />
          Test Alarm Sound
        </button>

        {nextReminder && (
          <section className={styles.reminderSection}>
            <h2 className={styles.sectionTitle}>Today's Next Reminder</h2>
            <div className={styles.reminderCard}>
              <div className={styles.reminderIcon}>
                <Bell size={24} />
              </div>
              <div className={styles.reminderContent}>
                <h3>{nextReminder.name}</h3>
                <p className={styles.reminderTime}>
                  <Clock size={14} />
                  Scheduled for {formatTime(nextReminder.time)}
                </p>
                <p className={styles.reminderDosage}>
                  <Pill size={14} />
                  Dosage: {nextReminder.dosage}
                </p>
              </div>
              <button 
                onClick={() => navigate(`/edit-medication/${nextReminder.id}`)}
                className={styles.editReminderBtn}
                title="Edit medication"
              >
                <Edit2 size={18} />
              </button>
            </div>
          </section>
        )}

        <button 
          onClick={() => navigate('/add-medication')}
          className={styles.addButton}
        >
          <Plus size={18} />
          Add Medication
        </button>

        <section className={styles.medicationsSection}>
          <h2 className={styles.sectionTitle}>
            <Calendar size={20} />
            Today's Medications
          </h2>
          
          {sortedMedications.length === 0 ? (
            <div className={styles.emptyState}>
              <Pill size={48} />
              <h3>No medications yet</h3>
              <p>Add your first medication to get started with reminders</p>
              <button 
                onClick={() => navigate('/add-medication')}
                className={styles.emptyAddBtn}
              >
                <Plus size={18} />
                Add Your First Medication
              </button>
            </div>
          ) : (
            <ul className={styles.medicationList}>
              {sortedMedications.map(med => (
                <li 
                  key={med.id} 
                  className={`${styles.medicationItem} ${takenToday[med.id] ? styles.taken : ''}`}
                >
                  <div className={styles.medIcon}>
                    <Pill size={18} />
                  </div>
                  <div className={styles.medInfo}>
                    <h4>{med.name}</h4>
                    <div className={styles.medDetails}>
                      <span><Clock size={12} /> {formatTime(med.time)}</span>
                      <span><Pill size={12} /> {med.dosage}</span>
                    </div>
                  </div>
                  <div className={styles.medActions}>
                    <button 
                      onClick={() => handleTake(med.id)}
                      className={`${styles.takeBtn} ${takenToday[med.id] ? styles.takeBtnTaken : ''}`}
                    >
                      <Check size={16} />
                      {takenToday[med.id] ? 'Taken' : 'Take'}
                    </button>
                    <button 
                      onClick={() => navigate(`/edit-medication/${med.id}`)}
                      className={styles.actionBtn}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(med.id)}
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {showDeleteConfirm === med.id && (
                    <div className={styles.deleteConfirm}>
                      <p>Delete {med.name}?</p>
                      <div className={styles.deleteActions}>
                        <button onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
                        <button onClick={() => handleDelete(med.id)} className={styles.confirmDelete}>Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

