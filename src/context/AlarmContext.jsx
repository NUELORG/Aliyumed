import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useMedications } from './MedicationContext'
import { useAuth } from './AuthContext'

const AlarmContext = createContext(null)

export function AlarmProvider({ children }) {
  const { user } = useAuth()
  const { medications, takenToday } = useMedications()
  const [isRinging, setIsRinging] = useState(false)
  const [currentAlarm, setCurrentAlarm] = useState(null)
  const [notificationPermission, setNotificationPermission] = useState('default')
  const [snoozedMeds, setSnoozedMeds] = useState({})
  
  const audioContextRef = useRef(null)
  const intervalRef = useRef(null)
  const alarmTimeoutRef = useRef(null)
  const checkedTimesRef = useRef(new Set())

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Check for due medications every 10 seconds
  useEffect(() => {
    if (!user || medications.length === 0) return

    const checkMedications = () => {
      const now = new Date()
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                         now.getMinutes().toString().padStart(2, '0')
      
      // Check each medication
      medications.forEach(med => {
        // Skip if already taken today
        if (takenToday[med.id]) return
        
        // Skip if snoozed and snooze hasn't expired
        if (snoozedMeds[med.id] && new Date() < new Date(snoozedMeds[med.id])) return
        
        // Create a unique key for this medication at this time
        const checkKey = `${med.id}-${now.toDateString()}-${currentTime}`
        
        // Skip if we've already checked and triggered for this medication at this time
        if (checkedTimesRef.current.has(checkKey)) return
        
        // Check if it's time for this medication (exact match)
        if (med.time === currentTime) {
          checkedTimesRef.current.add(checkKey)
          triggerAlarm(med)
        }
      })
    }

    // Check immediately
    checkMedications()
    
    // Then check every 10 seconds
    const timer = setInterval(checkMedications, 10000)
    
    return () => clearInterval(timer)
  }, [user, medications, takenToday, snoozedMeds])

  // Reset checked times at midnight
  useEffect(() => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const msUntilMidnight = tomorrow - now
    
    const midnightTimer = setTimeout(() => {
      checkedTimesRef.current.clear()
      setSnoozedMeds({})
    }, msUntilMidnight)
    
    return () => clearTimeout(midnightTimer)
  }, [])

  const triggerAlarm = useCallback((medication) => {
    // Don't trigger if already ringing
    if (isRinging) return
    
    setCurrentAlarm(medication)
    setIsRinging(true)

    // Try to show notification via Service Worker (works in background)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: `⏰ Time for ${medication.name}!`,
        body: `Dosage: ${medication.dosage}`,
        medication: medication
      })
    } else if ('Notification' in window && Notification.permission === 'granted') {
      // Fallback to regular notification
      try {
        const notification = new Notification(`⏰ Time for ${medication.name}!`, {
          body: `Dosage: ${medication.dosage}\nTap to dismiss`,
          icon: '/pill.svg',
          tag: `med-${medication.id}`,
          requireInteraction: true
        })
        
        notification.onclick = () => {
          window.focus()
          notification.close()
        }
      } catch (e) {
        console.log('Notification error:', e)
      }
    }

    // Start the alarm sound
    playAlarmSound()
  }, [isRinging])

  const playAlarmSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      const ctx = audioContextRef.current
      
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      let beepCount = 0
      const maxBeeps = 30 // About 12 seconds of beeping
      
      const beep = () => {
        if (beepCount >= maxBeeps) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return
        }

        try {
          const oscillator = ctx.createOscillator()
          const gainNode = ctx.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)
          
          // Create a pleasant but attention-grabbing melody
          const freqs = [523, 659, 784, 659] // C5, E5, G5, E5
          const freq = freqs[beepCount % 4]
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
          oscillator.type = 'sine'
          
          gainNode.gain.setValueAtTime(0, ctx.currentTime)
          gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
          
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.3)
          
          beepCount++
        } catch (e) {
          console.log('Audio error:', e)
        }
      }

      beep()
      intervalRef.current = setInterval(beep, 400)
      
      // Auto-stop after 12 seconds
      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm()
      }, 12000)
    } catch (e) {
      console.log('Audio context error:', e)
    }
  }, [])

  const stopAlarm = useCallback(() => {
    setIsRinging(false)
    setCurrentAlarm(null)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current)
      alarmTimeoutRef.current = null
    }
  }, [])

  const snoozeAlarm = useCallback((minutes = 5) => {
    if (!currentAlarm) return
    
    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000)
    setSnoozedMeds(prev => ({
      ...prev,
      [currentAlarm.id]: snoozeUntil.toISOString()
    }))
    
    // Remove from checked times so it can trigger again after snooze
    const now = new Date()
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0')
    const checkKey = `${currentAlarm.id}-${now.toDateString()}-${currentTime}`
    checkedTimesRef.current.delete(checkKey)
    
    stopAlarm()
  }, [currentAlarm, stopAlarm])

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      // Also need user interaction to enable audio
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      return permission
    }
    return 'denied'
  }, [])

  const testAlarm = useCallback(() => {
    triggerAlarm({
      id: 'test',
      name: 'Test Alarm',
      dosage: 'Testing alarm sound',
      time: new Date().toTimeString().slice(0, 5)
    })
  }, [triggerAlarm])

  return (
    <AlarmContext.Provider value={{
      isRinging,
      currentAlarm,
      notificationPermission,
      triggerAlarm,
      stopAlarm,
      snoozeAlarm,
      requestPermission,
      testAlarm
    }}>
      {children}
    </AlarmContext.Provider>
  )
}

export function useAlarm() {
  const context = useContext(AlarmContext)
  if (!context) {
    throw new Error('useAlarm must be used within an AlarmProvider')
  }
  return context
}

