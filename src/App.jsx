import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AddMedication from './pages/AddMedication'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MedicationProvider } from './context/MedicationContext'
import { AlarmProvider } from './context/AlarmContext'
import AlarmModal from './components/AlarmModal'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" />
}

function LandingRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <LandingRoute><Landing /></LandingRoute>
      } />
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute><Signup /></PublicRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute><Dashboard /></PrivateRoute>
      } />
      <Route path="/add-medication" element={
        <PrivateRoute><AddMedication /></PrivateRoute>
      } />
      <Route path="/edit-medication/:id" element={
        <PrivateRoute><AddMedication /></PrivateRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MedicationProvider>
          <AlarmProvider>
            <AppRoutes />
            <AlarmModal />
          </AlarmProvider>
        </MedicationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
