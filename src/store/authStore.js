import { create } from 'zustand'
import { loadState, saveState } from '../utils/localStorage'

const AUTH_STORAGE_KEY = 'gemini-auth'

export const useAuthStore = create(set => ({
  loggedIn: false,
  userPhone: '',
  darkMode: false,
  setLoggedIn: (val) => set({ loggedIn: val }),
  setUserPhone: (phone) => set({ userPhone: phone }),
  toggleDarkMode: () => set(state => {
    const newMode = !state.darkMode
    saveState('darkMode', newMode)
    return { darkMode: newMode }
  }),
  loadFromStorage: () => {
    const authData = loadState(AUTH_STORAGE_KEY, null)
    const darkMode = loadState('darkMode', false)
    if (authData) {
      set({ loggedIn: true, userPhone: authData.userPhone, darkMode })
    } else {
      set({ loggedIn: false, userPhone: '', darkMode })
    }
  },
  saveToStorage: () => {
    set(state => {
      saveState(AUTH_STORAGE_KEY, { userPhone: state.userPhone })
      return {}
    })
  },
  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    set({ loggedIn: false, userPhone: '' })
  }
}))
