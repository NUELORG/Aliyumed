import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMedications } from '../context/MedicationContext'
import { useTheme } from '../context/ThemeContext'
import AppLayout from '../components/AppLayout'
import {
  Moon,
  Sun,
  Download,
  Upload,
  LogOut,
  User,
  Bell,
  Shield,
  ChevronRight,
} from 'lucide-react'
import styles from './Settings.module.css'

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { exportUserData, importUserData } = useMedications()
  const { theme, toggleTheme } = useTheme()
  const fileRef = useRef(null)
  const [importMsg, setImportMsg] = useState(null)

  const handleExport = () => {
    const data = exportUserData()
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `medforget-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportPick = () => fileRef.current?.click()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const payload = JSON.parse(text)
      const result = importUserData(payload)
      if (result.success) {
        setImportMsg({ type: 'ok', text: 'Schedule restored from backup.' })
        navigate('/dashboard')
      } else {
        setImportMsg({ type: 'err', text: result.error || 'Import failed.' })
      }
    } catch {
      setImportMsg({ type: 'err', text: 'Could not read that file.' })
    }
  }

  return (
    <AppLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.kicker}>MedForget</p>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.sub}>Appearance, data, and account.</p>
        </header>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Account</h2>
          <div className={styles.row}>
            <div className={styles.rowIcon} aria-hidden>
              <User size={20} />
            </div>
            <div className={styles.rowBody}>
              <p className={styles.rowLabel}>{user?.name}</p>
              <p className={styles.rowHint}>{user?.email}</p>
            </div>
          </div>
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Appearance</h2>
          <button type="button" className={styles.rowButton} onClick={toggleTheme}>
            <div className={styles.rowIcon} aria-hidden>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div className={styles.rowBody}>
              <p className={styles.rowLabel}>Theme</p>
              <p className={styles.rowHint}>{theme === 'dark' ? 'Dark' : 'Light'}</p>
            </div>
            <ChevronRight size={18} className={styles.chevron} />
          </button>
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Data</h2>
          <p className={styles.blockDesc}>
            Export a JSON backup of your medications and adherence log. Store it somewhere safe;
            you can re-import on this device or after reinstalling the app.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.primaryBtn} onClick={handleExport}>
              <Download size={18} />
              Export backup
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={handleImportPick}>
              <Upload size={18} />
              Import backup
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className={styles.hiddenInput}
              onChange={handleFile}
            />
          </div>
          {importMsg && (
            <p className={importMsg.type === 'ok' ? styles.feedbackOk : styles.feedbackErr}>
              {importMsg.text}
            </p>
          )}
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Trust &amp; safety</h2>
          <div className={styles.notice}>
            <Shield size={20} />
            <p>
              MedForget stores your schedule on this device only. It does not replace medical
              advice—always follow your clinician&apos;s directions.
            </p>
          </div>
        </section>

        <section className={styles.block}>
          <h2 className={styles.blockTitle}>Notifications</h2>
          <div className={styles.row}>
            <div className={styles.rowIcon} aria-hidden>
              <Bell size={20} />
            </div>
            <div className={styles.rowBody}>
              <p className={styles.rowLabel}>System permission</p>
              <p className={styles.rowHint}>
                Enable alerts from the Today tab so dose reminders can fire in the background.
              </p>
            </div>
          </div>
        </section>

        <button type="button" className={styles.logout} onClick={() => logout()}>
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </AppLayout>
  )
}
