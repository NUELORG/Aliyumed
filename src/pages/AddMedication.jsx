import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMedications } from '../context/MedicationContext'
import { ArrowLeft, Plus, Pill, Clock, Save, Info, Check } from 'lucide-react'
import styles from './AddMedication.module.css'

export default function AddMedication() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addMedication, updateMedication, getMedication } = useMedications()
  
  const [name, setName] = useState('')
  const [time, setTime] = useState('12:30')
  const [dosage, setDosage] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const isEditing = Boolean(id)

  useEffect(() => {
    if (isEditing) {
      const medication = getMedication(id)
      if (medication) {
        setName(medication.name)
        setTime(medication.time)
        setDosage(medication.dosage)
      } else {
        navigate('/')
      }
    }
  }, [id, isEditing, getMedication, navigate])

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Medication name is required'
    if (!time) newErrors.time = 'Time is required'
    if (!dosage.trim()) newErrors.dosage = 'Dosage is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setLoading(true)
    
    const medicationData = {
      name: name.trim(),
      time,
      dosage: dosage.trim()
    }
    
    if (isEditing) {
      updateMedication(id, medicationData)
    } else {
      addMedication(medicationData)
    }
    
    setTimeout(() => {
      navigate('/')
    }, 300)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <Plus size={24} />
            </div>
            <div>
              <h1>{isEditing ? 'Edit Medication' : 'Add New Medication'}</h1>
              <p>Enter the details of your medication to add it to your daily schedule</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Pill size={16} />
                Medication Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Lisinopril, Metformin, Vitamin D"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              />
              <span className={styles.hint}>Enter the name of the medication</span>
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Clock size={16} />
                Time to Take
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`${styles.input} ${errors.time ? styles.inputError : ''}`}
              />
              <span className={styles.hint}>What time should you take this medication?</span>
              {errors.time && <span className={styles.errorText}>{errors.time}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <Pill size={16} />
                Dosage
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g., 10 mg, 1 tablet, 500 mg"
                className={`${styles.input} ${errors.dosage ? styles.inputError : ''}`}
              />
              <span className={styles.hint}>Enter the dosage amount and unit</span>
              {errors.dosage && <span className={styles.errorText}>{errors.dosage}</span>}
            </div>

            <div className={styles.actions}>
              <button 
                type="button" 
                onClick={() => navigate('/')}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                <Check size={18} />
                {loading ? 'Saving...' : isEditing ? 'Update Medication' : 'Save Medication'}
              </button>
            </div>
          </form>
        </div>

        <div className={styles.tipCard}>
          <Info size={18} />
          <div>
            <strong>Tip:</strong>
            <p>You can add multiple medications with different times. Set reminders for each medication to help you stay on track with your treatment plan.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

