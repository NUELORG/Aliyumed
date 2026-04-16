/** MedForget storage keys; migrates legacy Aliyumed keys once. */
export const LEGACY = {
  user: 'aliyumed_user',
  users: 'aliyumed_users',
  installDismissed: 'aliyumed_install_dismissed',
  installGuideDismissed: 'aliyumed_install_guide_dismissed',
}

export const KEYS = {
  user: 'medforget_user',
  users: 'medforget_users',
  installDismissed: 'medforget_install_dismissed',
  installGuideDismissed: 'medforget_install_guide_dismissed',
  theme: 'medforget_theme',
}

export function medsKey(userId) {
  return `medforget_meds_${userId}`
}

export function takenKey(userId, dateStr) {
  return `medforget_taken_${userId}_${dateStr}`
}

export function adherenceKey(userId) {
  return `medforget_adherence_${userId}`
}

/** Copy legacy value to new key if new key is absent. */
export function migrateIfNeeded(legacyKey, newKey) {
  try {
    if (localStorage.getItem(newKey) != null) return
    const old = localStorage.getItem(legacyKey)
    if (old != null) localStorage.setItem(newKey, old)
  } catch {
    /* ignore */
  }
}

export function migrateUserScopedLegacy(userId) {
  if (!userId) return
  const legacyMeds = `aliyumed_meds_${userId}`
  const newMeds = medsKey(userId)
  migrateIfNeeded(legacyMeds, newMeds)

  const today = new Date().toDateString()
  const legacyTaken = `aliyumed_taken_${userId}_${today}`
  const newTaken = takenKey(userId, today)
  migrateIfNeeded(legacyTaken, newTaken)

  const legacyAdherence = `aliyumed_adherence_${userId}`
  const newAdherence = adherenceKey(userId)
  migrateIfNeeded(legacyAdherence, newAdherence)
}
