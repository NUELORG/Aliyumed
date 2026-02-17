import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('aliyumed_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Simple authentication - in a real app, this would call an API
    const users = JSON.parse(localStorage.getItem('aliyumed_users') || '[]')
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    // Demo credentials
    if (email === 'demo@example.com' && password === 'password123') {
      const demoUser = { id: 'demo', name: 'Demo User', email: 'demo@example.com' }
      setUser(demoUser)
      localStorage.setItem('aliyumed_user', JSON.stringify(demoUser))
      return { success: true }
    }
    
    if (foundUser) {
      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
      setUser(userData)
      localStorage.setItem('aliyumed_user', JSON.stringify(userData))
      return { success: true }
    }
    
    return { success: false, error: 'Invalid email or password' }
  }

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('aliyumed_users') || '[]')
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' }
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    }
    
    users.push(newUser)
    localStorage.setItem('aliyumed_users', JSON.stringify(users))
    
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email }
    setUser(userData)
    localStorage.setItem('aliyumed_user', JSON.stringify(userData))
    
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('aliyumed_user')
  }

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem',
      color: '#6b7280'
    }}>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

