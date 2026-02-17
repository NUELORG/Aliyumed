import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import styles from './InstallPrompt.module.css'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    // Listen for the beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 2000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // For iOS, show instructions after delay
    if (isIOSDevice) {
      const dismissed = localStorage.getItem('aliyumed_install_dismissed')
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

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
    localStorage.setItem('aliyumed_install_dismissed', 'true')
  }

  if (isInstalled || !showPrompt) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.prompt}>
        <button onClick={handleDismiss} className={styles.closeBtn}>
          <X size={20} />
        </button>
        
        <div className={styles.icon}>
          <Smartphone size={32} />
        </div>
        
        <h3>Install Aliyumed</h3>
        <p>
          Install this app on your phone to get <strong>alarm notifications even when you're not using the browser</strong>.
        </p>

        {isIOS ? (
          <div className={styles.iosInstructions}>
            <p className={styles.step}>
              <span>1.</span> Tap the <strong>Share</strong> button below
            </p>
            <p className={styles.step}>
              <span>2.</span> Scroll and tap <strong>"Add to Home Screen"</strong>
            </p>
            <p className={styles.step}>
              <span>3.</span> Tap <strong>"Add"</strong> to install
            </p>
            <button onClick={handleDismiss} className={styles.gotItBtn}>
              Got it!
            </button>
          </div>
        ) : (
          <button onClick={handleInstall} className={styles.installBtn}>
            <Download size={20} />
            Install App
          </button>
        )}
      </div>
    </div>
  )
}

