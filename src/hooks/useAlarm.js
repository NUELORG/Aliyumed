import { useState, useEffect, useRef, useCallback } from 'react'

// Generate alarm sound using Web Audio API
function createAlarmSound(audioContext) {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5 note
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  
  return { oscillator, gainNode }
}

export function useAlarm() {
  const [isRinging, setIsRinging] = useState(false)
  const [currentAlarm, setCurrentAlarm] = useState(null)
  const [notificationPermission, setNotificationPermission] = useState('default')
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const intervalRef = useRef(null)
  const alarmTimeoutRef = useRef(null)

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission)
        })
      }
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAlarm()
    }
  }, [])

  const playAlarmPattern = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    
    // Resume audio context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Create beeping pattern
    let beepCount = 0
    const maxBeeps = 20 // Will beep for about 10 seconds
    
    const beep = () => {
      if (beepCount >= maxBeeps || !isRinging) {
        return
      }

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Alternate between two frequencies for more attention-grabbing sound
      const freq = beepCount % 2 === 0 ? 880 : 1100
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
      oscillator.type = 'sine'
      
      // Envelope for each beep
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.3)
      
      beepCount++
    }

    // Start beeping pattern
    beep()
    intervalRef.current = setInterval(beep, 500)
    
    // Auto-stop after 10 seconds
    alarmTimeoutRef.current = setTimeout(() => {
      stopAlarm()
    }, 10000)
  }, [isRinging])

  const triggerAlarm = useCallback((medication) => {
    setCurrentAlarm(medication)
    setIsRinging(true)

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`⏰ Time for ${medication.name}!`, {
        body: `Dosage: ${medication.dosage}\nTap to view`,
        icon: '/pill.svg',
        tag: `med-${medication.id}`,
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200]
      })
      
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }

    // Start the alarm sound
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    let beepCount = 0
    const maxBeeps = 20
    
    const beep = () => {
      if (beepCount >= maxBeeps) {
        clearInterval(intervalRef.current)
        return
      }

      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      const freq = beepCount % 2 === 0 ? 880 : 1100
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.25)
      
      beepCount++
    }

    beep()
    intervalRef.current = setInterval(beep, 400)
    
    alarmTimeoutRef.current = setTimeout(() => {
      stopAlarm()
    }, 10000)
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
    const snoozedMed = currentAlarm
    stopAlarm()
    
    // Return the snooze time so the caller can handle rescheduling
    return {
      medication: snoozedMed,
      snoozeUntil: new Date(Date.now() + minutes * 60 * 1000)
    }
  }, [currentAlarm, stopAlarm])

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      return permission
    }
    return notificationPermission
  }, [notificationPermission])

  const testAlarm = useCallback(() => {
    triggerAlarm({
      id: 'test',
      name: 'Test Medication',
      dosage: 'Test dosage',
      time: new Date().toTimeString().slice(0, 5)
    })
  }, [triggerAlarm])

  return {
    isRinging,
    currentAlarm,
    notificationPermission,
    triggerAlarm,
    stopAlarm,
    snoozeAlarm,
    requestPermission,
    testAlarm
  }
}

export default useAlarm

