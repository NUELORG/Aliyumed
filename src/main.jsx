import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Register Service Worker for background notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      console.log('Service Worker registered:', registration.scope)
      
      // Listen for messages from Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from Service Worker:', event.data)
        
        if (event.data.type === 'MARK_TAKEN') {
          // Dispatch custom event for the app to handle
          window.dispatchEvent(new CustomEvent('sw-mark-taken', { 
            detail: { medicationId: event.data.medicationId }
          }))
        }
        
        if (event.data.type === 'SNOOZE') {
          window.dispatchEvent(new CustomEvent('sw-snooze', { 
            detail: { medicationId: event.data.medicationId, minutes: event.data.minutes }
          }))
        }
      })
    } catch (error) {
      console.log('Service Worker registration failed:', error)
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
