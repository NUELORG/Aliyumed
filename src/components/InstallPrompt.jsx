import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import MedForgetLogo from './MedForgetLogo'
import { KEYS, LEGACY, migrateIfNeeded } from '../lib/storageKeys'
import styles from './InstallPrompt.module.css'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS] = useState(() =>
    typeof window !== 'undefined' ? /iPad|iPhone|iPod/.test(navigator.userAgent) : false
  )
  const [isInstalled, setIsInstalled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  )

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return

    migrateIfNeeded(LEGACY.installDismissed, KEYS.installDismissed)

    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowPrompt(true), 2000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    if (isIOS) {
      const dismissed = localStorage.getItem(KEYS.installDismissed)
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [isIOS])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem(KEYS.installDismissed, 'true')
  }

  if (isInstalled || !showPrompt) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.prompt}>
        <button type="button" onClick={handleDismiss} className={styles.closeBtn} aria-label="Dismiss">
          <X size={20} />
        </button>

        <div className={styles.heroLogo}>
          <MedForgetLogo variant="mark" size="md" />
        </div>

        <h3>Install MedForget</h3>
        <p>
          Pin the app for <strong>one-tap access</strong> and <strong>stronger background reminders</strong> so
          doses are harder to miss when life gets loud.
        </p>

        <div className={styles.perkStrip} aria-hidden>
          <span>Homescreen icon</span>
          <span className={styles.perkDot}>·</span>
          <span>Richer alerts</span>
          <span className={styles.perkDot}>·</span>
          <span>Feels native</span>
        </div>

        {isIOS ? (
          <div className={styles.iosInstructions}>
            <p className={styles.step}>
              <span>1</span>
              Tap <strong>Share</strong> in Safari&apos;s toolbar
            </p>
            <p className={styles.step}>
              <span>2</span>
              Scroll and choose <strong>Add to Home Screen</strong>
            </p>
            <p className={styles.step}>
              <span>3</span>
              Tap <strong>Add</strong> to finish
            </p>
            <button type="button" onClick={handleDismiss} className={styles.gotItBtn}>
              Got it
            </button>
          </div>
        ) : (
          <button type="button" onClick={handleInstall} className={styles.installBtn}>
            <Download size={20} strokeWidth={2.25} />
            Install app
          </button>
        )}
      </div>
    </div>
  )
}
