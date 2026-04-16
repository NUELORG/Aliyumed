import { createContext, useContext, useState } from 'react'
import { KEYS, LEGACY, migrateIfNeeded } from '../lib/storageKeys'

const AuthContext = createContext(null)

function readStoredUser() {
  migrateIfNeeded(LEGACY.user, KEYS.user)
  try {
    const stored = localStorage.getItem(KEYS.user)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  const login = (email, password) => {
    migrateIfNeeded(LEGACY.users, KEYS.users)
    const users = JSON.parse(localStorage.getItem(KEYS.users) || '[]')
    const foundUser = users.find((u) => u.email === email && u.password === password)

    if (email === 'demo@example.com' && password === 'password123') {
      const demoUser = { id: 'demo', name: 'Demo User', email: 'demo@example.com' }
      setUser(demoUser)
      localStorage.setItem(KEYS.user, JSON.stringify(demoUser))
      return { success: true }
    }

    if (foundUser) {
      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
      setUser(userData)
      localStorage.setItem(KEYS.user, JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: 'Invalid email or password' }
  }

  const signup = (name, email, password) => {
    migrateIfNeeded(LEGACY.users, KEYS.users)
    const users = JSON.parse(localStorage.getItem(KEYS.users) || '[]')

    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Email already registered' }
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    }

    users.push(newUser)
    localStorage.setItem(KEYS.users, JSON.stringify(users))

    const userData = { id: newUser.id, name: newUser.name, email: newUser.email }
    setUser(userData)
    localStorage.setItem(KEYS.user, JSON.stringify(userData))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(KEYS.user)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- paired hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
