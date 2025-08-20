import { Switch } from 'antd'
import { useAuthStore } from '../store/authStore'

export default function DarkModeToggle() {
  const darkMode = useAuthStore(state => state.darkMode)
  const toggle = useAuthStore(state => state.toggleDarkMode)

  return (
    <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1000 }}>
      <Switch
        checked={darkMode}
        onChange={toggle}
        checkedChildren="Dark"
        unCheckedChildren="Light"
        aria-label="Toggle Dark Mode"
      />
    </div>
  )
}
