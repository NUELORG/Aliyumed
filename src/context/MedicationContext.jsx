import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const MedicationContext = createContext(null)

export function MedicationProvider({ children }) {
  const { user } = useAuth()
  const [medications, setMedications] = useState([])
  const [takenToday, setTakenToday] = useState({})

  // Load medications when user changes
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`aliyumed_meds_${user.id}`)
      if (stored) {
        setMedications(JSON.parse(stored))
      } else {
        // Add demo data for demo user
        if (user.id === 'demo') {
          const demoMeds = [
            { id: '1', name: 'Lisinopril', time: '08:00', dosage: '10 mg' },
            { id: '2', name: 'Metformin', time: '12:30', dosage: '500 mg' },
            { id: '3', name: 'Vitamin D', time: '19:00', dosage: '1 capsule' }
          ]
          setMedications(demoMeds)
          localStorage.setItem(`aliyumed_meds_${user.id}`, JSON.stringify(demoMeds))
        } else {
          setMedications([])
        }
      }
      
      // Load today's taken status
      const today = new Date().toDateString()
      const takenData = localStorage.getItem(`aliyumed_taken_${user.id}_${today}`)
      if (takenData) {
        setTakenToday(JSON.parse(takenData))
      } else {
        setTakenToday({})
      }
    } else {
      setMedications([])
      setTakenToday({})
    }
  }, [user])

  // Save medications when they change
  useEffect(() => {
    if (user && medications.length >= 0) {
      localStorage.setItem(`aliyumed_meds_${user.id}`, JSON.stringify(medications))
    }
  }, [medications, user])

  // Save taken status
  useEffect(() => {
    if (user) {
      const today = new Date().toDateString()
      localStorage.setItem(`aliyumed_taken_${user.id}_${today}`, JSON.stringify(takenToday))
    }
  }, [takenToday, user])

  const addMedication = (medication) => {
    const newMed = {
      ...medication,
      id: Date.now().toString()
    }
    setMedications(prev => [...prev, newMed])
  }

  const updateMedication = (id, updates) => {
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, ...updates } : med
    ))
  }

  const deleteMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id))
  }

  const markAsTaken = (id) => {
    setTakenToday(prev => ({ ...prev, [id]: true }))
  }

  const markAsNotTaken = (id) => {
    setTakenToday(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
  }

  const getMedication = (id) => {
    return medications.find(med => med.id === id)
  }

  const getNextReminder = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const upcoming = medications
      .filter(med => !takenToday[med.id])
      .map(med => {
        const [hours, minutes] = med.time.split(':').map(Number)
        const medTime = hours * 60 + minutes
        return { ...med, timeInMinutes: medTime }
      })
      .filter(med => med.timeInMinutes >= currentTime)
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes)
    
    return upcoming[0] || null
  }

  return (
    <MedicationContext.Provider value={{
      medications,
      takenToday,
      addMedication,
      updateMedication,
      deleteMedication,
      markAsTaken,
      markAsNotTaken,
      getMedication,
      getNextReminder
    }}>
      {children}
    </MedicationContext.Provider>
  )
}

export function useMedications() {
  const context = useContext(MedicationContext)
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider')
  }
  return context
}

