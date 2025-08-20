import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ConfigProvider, theme, message } from 'antd'
import LoginPage from './pages/LoginPage'
import DarkModeToggle from './components/DarkModeToggle'
import DashboardPage from './pages/DashboardPage'
import { useAuthStore } from './store/authStore'
import ChatroomPage from './pages/ChatRoom'

// RequireAuth wrapper component to protect routes
function RequireAuth({ children }) {
  const loggedIn = useAuthStore(state => state.loggedIn)
  const location = useLocation()
  if (!loggedIn) return <Navigate to="/" state={{ from: location }} replace />
  return children}

function AppWrapper() {
  const darkMode = useAuthStore(state => state.darkMode)
  const [messageApi, contextHolder] = message.useMessage()
  // Provide messageApi globally (optional, you can pass it via context)
  useEffect(() => {
    // You could store messageApi to Zustand or context for global usage if needed
  }, [messageApi])
  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {contextHolder}
      <DarkModeToggle />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/chat/:chatroomId"
          element={
            <RequireAuth>
              <ChatroomPage />
            </RequireAuth>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfigProvider>)}
export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  )
}
