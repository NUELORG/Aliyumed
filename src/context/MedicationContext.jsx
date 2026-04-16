import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { medsKey, takenKey, adherenceKey, migrateUserScopedLegacy } from '../lib/storageKeys'

const MedicationContext = createContext(null)

function readAdherence(userId) {
  try {
    const raw = localStorage.getItem(adherenceKey(userId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAdherence(userId, data) {
  try {
    localStorage.setItem(adherenceKey(userId), JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

export function MedicationProvider({ children }) {
  const { user } = useAuth()
  const [medications, setMedications] = useState([])
  const [takenToday, setTakenToday] = useState({})

  useEffect(() => {
    queueMicrotask(() => {
      if (!user) {
        setMedications([])
        setTakenToday({})
        return
      }

      migrateUserScopedLegacy(user.id)

      const stored = localStorage.getItem(medsKey(user.id))
      if (stored) {
        setMedications(JSON.parse(stored))
      } else if (user.id === 'demo') {
        const demoMeds = [
          { id: '1', name: 'Lisinopril', time: '08:00', dosage: '10 mg', notes: 'With breakfast' },
          { id: '2', name: 'Metformin', time: '12:30', dosage: '500 mg', notes: '' },
          { id: '3', name: 'Vitamin D', time: '19:00', dosage: '1 capsule', notes: 'Evening' },
        ]
        setMedications(demoMeds)
        localStorage.setItem(medsKey(user.id), JSON.stringify(demoMeds))
      } else {
        setMedications([])
      }

      const today = new Date().toDateString()
      const takenData = localStorage.getItem(takenKey(user.id, today))
      if (takenData) {
        setTakenToday(JSON.parse(takenData))
      } else {
        setTakenToday({})
      }
    })
  }, [user])

  useEffect(() => {
    if (user && medications.length >= 0) {
      localStorage.setItem(medsKey(user.id), JSON.stringify(medications))
    }
  }, [medications, user])

  useEffect(() => {
    if (!user) return
    const today = new Date().toDateString()
    localStorage.setItem(takenKey(user.id, today), JSON.stringify(takenToday))

    const adherence = readAdherence(user.id)
    adherence[today] = { ...takenToday }
    writeAdherence(user.id, adherence)
  }, [takenToday, user])

  const addMedication = (medication) => {
    const newMed = {
      notes: '',
      ...medication,
      id: Date.now().toString(),
    }
    setMedications((prev) => [...prev, newMed])
  }

  const updateMedication = (id, updates) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, ...updates } : med)))
  }

  const deleteMedication = (id) => {
    setMedications((prev) => prev.filter((med) => med.id !== id))
    setTakenToday((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const markAsTaken = (id) => {
    setTakenToday((prev) => ({ ...prev, [id]: true }))
  }

  const markAsNotTaken = (id) => {
    setTakenToday((prev) => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }

  const getMedication = useCallback(
    (id) => medications.find((med) => med.id === id),
    [medications]
  )

  const getNextReminder = useCallback(() => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const upcoming = medications
      .filter((med) => !takenToday[med.id])
      .map((med) => {
        const [hours, minutes] = med.time.split(':').map(Number)
        const medTime = hours * 60 + minutes
        return { ...med, timeInMinutes: medTime }
      })
      .filter((med) => med.timeInMinutes >= currentTime)
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes)

    return upcoming[0] || null
  }, [medications, takenToday])

  const getWeeklyAdherence = useCallback(() => {
    if (!user || medications.length === 0) return []

    const adherence = readAdherence(user.id)
    const n = medications.length
    const days = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toDateString()
      const dayTaken = adherence[dateStr] || {}
      const takenCount = medications.filter((m) => dayTaken[m.id]).length
      const percent = Math.round((takenCount / n) * 100)
      days.push({
        date: d,
        dateStr,
        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        percent,
        takenCount,
        total: n,
      })
    }
    return days
  }, [user, medications])

  const getAdherenceStreak = useCallback(() => {
    if (!user || medications.length === 0) return 0
    const adherence = readAdherence(user.id)
    const n = medications.length
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toDateString()
      const dayTaken = adherence[dateStr] || {}
      const takenCount = medications.filter((m) => dayTaken[m.id]).length
      if (takenCount >= n && n > 0) streak += 1
      else break
    }
    return streak
  }, [user, medications])

  const exportUserData = useCallback(() => {
    if (!user) return null
    const today = new Date().toDateString()
    return {
      app: 'MedForget',
      version: 1,
      exportedAt: new Date().toISOString(),
      user: { id: user.id, name: user.name, email: user.email },
      medications,
      takenToday,
      adherence: readAdherence(user.id),
      takenKeySnapshot: { [today]: { ...takenToday } },
    }
  }, [user, medications, takenToday])

  const importUserData = useCallback(
    (payload) => {
      if (!user || !payload || typeof payload !== 'object') return { success: false, error: 'Invalid file' }
      const meds = Array.isArray(payload.medications) ? payload.medications : null
      if (!meds) return { success: false, error: 'No medications found in this file' }
      setMedications(meds)
      localStorage.setItem(medsKey(user.id), JSON.stringify(meds))

      const today = new Date().toDateString()
      const taken = payload.takenToday && typeof payload.takenToday === 'object' ? payload.takenToday : {}
      setTakenToday(taken)
      localStorage.setItem(takenKey(user.id, today), JSON.stringify(taken))

      if (payload.adherence && typeof payload.adherence === 'object') {
        writeAdherence(user.id, payload.adherence)
      }
      return { success: true }
    },
    [user]
  )

  return (
    <MedicationContext.Provider
      value={{
        medications,
        takenToday,
        addMedication,
        updateMedication,
        deleteMedication,
        markAsTaken,
        markAsNotTaken,
        getMedication,
        getNextReminder,
        getWeeklyAdherence,
        getAdherenceStreak,
        exportUserData,
        importUserData,
      }}
    >
      {children}
    </MedicationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook
export function useMedications() {
  const context = useContext(MedicationContext)
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider')
  }
  return context
}
