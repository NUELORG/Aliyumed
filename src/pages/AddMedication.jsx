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
  const [hour, setHour] = useState('12')
  const [minute, setMinute] = useState('00')
  const [period, setPeriod] = useState('AM')
  const [dosage, setDosage] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const isEditing = Boolean(id)

  // Convert 24h time to 12h format
  const parse24hTime = (time24) => {
    const [h, m] = time24.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return { hour: hour12.toString(), minute: m.toString().padStart(2, '0'), period }
  }

  // Convert 12h to 24h format for storage
  const to24hTime = () => {
    let h = parseInt(hour)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    return `${h.toString().padStart(2, '0')}:${minute}`
  }

  useEffect(() => {
    if (isEditing) {
      const medication = getMedication(id)
      if (medication) {
        setName(medication.name)
        const parsed = parse24hTime(medication.time)
        setHour(parsed.hour)
        setMinute(parsed.minute)
        setPeriod(parsed.period)
        setDosage(medication.dosage)
      } else {
        navigate('/dashboard')
      }
    }
  }, [id, isEditing, getMedication, navigate])

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Medication name is required'
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
      time: to24hTime(),
      dosage: dosage.trim()
    }
    
    if (isEditing) {
      updateMedication(id, medicationData)
    } else {
      addMedication(medicationData)
    }
    
    setTimeout(() => {
      navigate('/dashboard')
    }, 300)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate('/dashboard')} className={styles.backBtn}>
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
              <div className={styles.timePickerRow}>
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className={styles.timeSelect}
                >
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className={styles.timeColon}>:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className={styles.timeSelect}
                >
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className={styles.periodSelect}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <span className={styles.hint}>What time should you take this medication?</span>
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
                onClick={() => navigate('/dashboard')}
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

