import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMedications } from '../context/MedicationContext'
import { useAlarm } from '../context/AlarmContext'
import AppLayout from '../components/AppLayout'
import MedForgetLogo from '../components/MedForgetLogo'
import { KEYS, LEGACY, migrateIfNeeded } from '../lib/storageKeys'
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
  BellRing,
  Volume2,
  Share,
  Menu,
  Search,
} from 'lucide-react'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const {
    medications,
    takenToday,
    markAsTaken,
    markAsNotTaken,
    deleteMedication,
    getNextReminder,
    getAdherenceStreak,
  } = useMedications()
  const { notificationPermission, requestPermission, testAlarm } = useAlarm()
  const [nextReminder, setNextReminder] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showPermissionBanner, setShowPermissionBanner] = useState(true)
  const [showInstallGuide, setShowInstallGuide] = useState(true)
  const [isInstalled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  )
  const [isIOS] = useState(() =>
    typeof window !== 'undefined' ? /iPad|iPhone|iPod/.test(navigator.userAgent) : false
  )
  const [search, setSearch] = useState('')

  useEffect(() => {
    migrateIfNeeded(LEGACY.installGuideDismissed, KEYS.installGuideDismissed)
    queueMicrotask(() => {
      const dismissed = localStorage.getItem(KEYS.installGuideDismissed)
      if (dismissed) setShowInstallGuide(false)
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setNextReminder(getNextReminder())
    }, 1000)

    queueMicrotask(() => setNextReminder(getNextReminder()))

    return () => clearInterval(timer)
  }, [getNextReminder])

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':')
    const h = parseInt(hours, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  }

  const formatDate = () =>
    currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const handleTake = (id) => {
    if (takenToday[id]) markAsNotTaken(id)
    else markAsTaken(id)
  }

  const handleDelete = (id) => {
    deleteMedication(id)
    setShowDeleteConfirm(null)
  }

  const handleEnableNotifications = async () => {
    await requestPermission()
    setShowPermissionBanner(false)
  }

  const sortedMedications = useMemo(
    () => [...medications].sort((a, b) => a.time.localeCompare(b.time)),
    [medications]
  )

  const filteredMedications = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sortedMedications
    return sortedMedications.filter((m) => m.name.toLowerCase().includes(q))
  }, [sortedMedications, search])

  const takenCount = Object.keys(takenToday).filter((id) => takenToday[id]).length
  const totalCount = medications.length
  const adherencePercent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0
  const streak = getAdherenceStreak()

  return (
    <AppLayout>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <User size={20} />
              </div>
              <div>
                <p className={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'there'}</p>
                <p className={styles.date}>{formatDate()}</p>
              </div>
            </div>
            <button type="button" onClick={logout} className={styles.logoutBtn} title="Log out">
              <LogOut size={20} />
            </button>
          </div>

          {totalCount > 0 && (
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Today</p>
                <p className={styles.statValue}>
                  {takenCount}/{totalCount}
                </p>
                <p className={styles.statHint}>doses logged</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Completion</p>
                <p className={styles.statValue}>{adherencePercent}%</p>
                <p className={styles.statHint}>so far</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statLabel}>Streak</p>
                <p className={styles.statValue}>{streak}</p>
                <p className={styles.statHint}>perfect days</p>
              </div>
            </div>
          )}

          {totalCount > 0 && (
            <div className={styles.progressBar}>
              <div className={styles.progressInfo}>
                <span>Daily progress</span>
                <span>
                  {takenCount} of {totalCount} taken
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${adherencePercent}%` }} />
              </div>
            </div>
          )}
        </header>

        <main className={styles.main}>
          {showPermissionBanner && notificationPermission !== 'granted' && (
            <div className={styles.permissionBanner}>
              <div className={styles.permissionContent}>
                <BellRing size={22} />
                <div>
                  <h4>Enable notifications</h4>
                  <p>MedForget can alert you when the app is in the background on supported browsers.</p>
                </div>
              </div>
              <div className={styles.permissionActions}>
                <button type="button" onClick={handleEnableNotifications} className={styles.enableBtn}>
                  <Volume2 size={16} />
                  Enable
                </button>
                <button
                  type="button"
                  onClick={() => setShowPermissionBanner(false)}
                  className={styles.dismissBannerBtn}
                >
                  Not now
                </button>
              </div>
            </div>
          )}

          {!isInstalled && showInstallGuide && (
            <div className={`${styles.installGuide} mf-anim`}>
              <div className={styles.installHeader}>
                <div className={styles.installHeaderMark}>
                  <MedForgetLogo variant="mark" size="sm" />
                </div>
                <h4>Install for stronger reminders</h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowInstallGuide(false)
                    localStorage.setItem(KEYS.installGuideDismissed, 'true')
                  }}
                  className={styles.closeGuide}
                  aria-label="Dismiss install tips"
                >
                  ×
                </button>
              </div>
              {isIOS ? (
                <div className={styles.installStepList}>
                  <div className={styles.installStepCard}>
                    <span className={styles.installStepBadge} aria-hidden>
                      1
                    </span>
                    <div className={styles.installStepBody}>
                      <p className={styles.installStepTitle}>Open the share sheet</p>
                      <p className={styles.installStepText}>
                        Tap <Share size={16} className={styles.installInlineIcon} strokeWidth={2} />{' '}
                        <strong>Share</strong> in Safari&apos;s toolbar.
                      </p>
                    </div>
                  </div>
                  <div className={styles.installStepCard}>
                    <span className={styles.installStepBadge} aria-hidden>
                      2
                    </span>
                    <div className={styles.installStepBody}>
                      <p className={styles.installStepTitle}>Add to Home Screen</p>
                      <p className={styles.installStepText}>
                        Scroll the menu and choose <strong>Add to Home Screen</strong>.
                      </p>
                    </div>
                  </div>
                  <div className={styles.installStepCard}>
                    <span className={styles.installStepBadge} aria-hidden>
                      3
                    </span>
                    <div className={styles.installStepBody}>
                      <p className={styles.installStepTitle}>Confirm</p>
                      <p className={styles.installStepText}>
                        Tap <strong>Add</strong>. MedForget will sit on your home screen like a native app.
                      </p>
                    </div>
                  </div>
                  <p className={styles.installNote}>
                    Installed PWAs can wake alarms more reliably on iOS.
                  </p>
                </div>
              ) : (
                <div className={styles.installStepList}>
                  <div className={styles.installStepCard}>
                    <span className={styles.installStepBadge} aria-hidden>
                      1
                    </span>
                    <div className={styles.installStepBody}>
                      <p className={styles.installStepTitle}>Use the browser install prompt</p>
                      <p className={styles.installStepText}>
                        When a bar or bubble offers to install MedForget, accept it — that is the quickest
                        way to get lock-screen–friendly reminders.
                      </p>
                    </div>
                  </div>
                  <div className={styles.installStepCard}>
                    <span className={styles.installStepBadge} aria-hidden>
                      2
                    </span>
                    <div className={styles.installStepBody}>
                      <p className={styles.installStepTitle}>Or use the browser menu</p>
                      <p className={styles.installStepText}>
                        Open the main menu (
                        <Menu size={16} className={styles.installInlineIcon} strokeWidth={2} /> often labeled{' '}
                        <strong>⋮</strong> or <strong>≡</strong>
                        ), then look for one of these entries:
                      </p>
                      <div className={styles.installChips}>
                        <span className={styles.menuPill}>Install app</span>
                        <span className={styles.menuPill}>Add to Home screen</span>
                      </div>
                      <p className={styles.installStepFine}>
                        Wording depends on Chrome, Edge, or Samsung Internet — both options pin MedForget to
                        your device.
                      </p>
                    </div>
                  </div>
                  <p className={styles.installNote}>
                    Keeps MedForget one tap away from your lock screen.
                  </p>
                </div>
              )}
            </div>
          )}

          <button type="button" onClick={testAlarm} className={styles.testAlarmBtn}>
            <BellRing size={16} />
            Test alarm sound
          </button>

          {nextReminder && (
            <section className={styles.reminderSection}>
              <h2 className={styles.sectionTitle}>Next due</h2>
              <div className={styles.reminderCard}>
                <div className={styles.reminderIcon}>
                  <Bell size={22} />
                </div>
                <div className={styles.reminderContent}>
                  <h3>{nextReminder.name}</h3>
                  <p className={styles.reminderTime}>
                    <Clock size={14} />
                    {formatTime(nextReminder.time)}
                  </p>
                  <p className={styles.reminderDosage}>
                    <Pill size={14} />
                    {nextReminder.dosage}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/edit-medication/${nextReminder.id}`)}
                  className={styles.editReminderBtn}
                  title="Edit medication"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </section>
          )}

          <button type="button" onClick={() => navigate('/add-medication')} className={styles.addButton}>
            <Plus size={18} />
            Add medication
          </button>

          {sortedMedications.length > 0 && (
            <div className={styles.searchWrap}>
              <Search size={18} className={styles.searchIcon} aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search today’s list…"
                className={styles.searchInput}
                aria-label="Search medications"
              />
            </div>
          )}

          <section className={styles.medicationsSection}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} />
              Today&apos;s medications
            </h2>

            {sortedMedications.length === 0 ? (
              <div className={styles.emptyState}>
                <Pill size={48} />
                <h3>No medications yet</h3>
                <p>Add your first dose so MedForget can remind you on schedule.</p>
                <button type="button" onClick={() => navigate('/add-medication')} className={styles.emptyAddBtn}>
                  <Plus size={18} />
                  Add medication
                </button>
              </div>
            ) : filteredMedications.length === 0 ? (
              <div className={styles.emptyState}>
                <Search size={40} />
                <h3>No matches</h3>
                <p>Try a different search term.</p>
              </div>
            ) : (
              <ul className={styles.medicationList}>
                {filteredMedications.map((med) => (
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
                        <span>
                          <Clock size={12} /> {formatTime(med.time)}
                        </span>
                        <span>
                          <Pill size={12} /> {med.dosage}
                        </span>
                      </div>
                      {med.notes ? <p className={styles.medNotes}>{med.notes}</p> : null}
                    </div>
                    <div className={styles.medActions}>
                      <button
                        type="button"
                        onClick={() => handleTake(med.id)}
                        className={`${styles.takeBtn} ${takenToday[med.id] ? styles.takeBtnTaken : ''}`}
                      >
                        <Check size={16} />
                        {takenToday[med.id] ? 'Taken' : 'Log dose'}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/edit-medication/${med.id}`)}
                        className={styles.actionBtn}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(med.id)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {showDeleteConfirm === med.id && (
                      <div className={styles.deleteConfirm}>
                        <p>Remove {med.name}?</p>
                        <div className={styles.deleteActions}>
                          <button type="button" onClick={() => setShowDeleteConfirm(null)}>
                            Cancel
                          </button>
                          <button type="button" onClick={() => handleDelete(med.id)} className={styles.confirmDelete}>
                            Delete
                          </button>
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
    </AppLayout>
  )
}
