import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, LineChart, Settings } from 'lucide-react'
import styles from './AppLayout.module.css'

export default function AppLayout({ children }) {
  const location = useLocation()

  return (
    <div className={styles.shell}>
      <div key={location.pathname} className={`${styles.pageStage} mf-page-anim`}>
        <div className={styles.content}>{children}</div>
      </div>
      <nav className={styles.nav} aria-label="Main">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <LayoutDashboard size={22} strokeWidth={2} />
          <span>Today</span>
        </NavLink>
        <NavLink
          to="/insights"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <LineChart size={22} strokeWidth={2} />
          <span>Insights</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <Settings size={22} strokeWidth={2} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  )
}
