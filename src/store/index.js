import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authStore'
import chatReducer from './chatStore'

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  }
})

export default store