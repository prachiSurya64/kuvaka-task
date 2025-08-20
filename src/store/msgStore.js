import { create } from 'zustand'
import { saveState, loadState } from '../utils/localStorage'

const MESSAGES_STORAGE_KEY = 'gemini-messages'

export const useMessagesStore = create(set => ({
  messagesByChatroomId: loadState(MESSAGES_STORAGE_KEY, {}),
  addMessage: (chatroomId, message) =>
    set(state => {
      const messages = state.messagesByChatroomId[chatroomId] || []
      const updatedMessages = [...messages, message]
      const updated = { ...state.messagesByChatroomId, [chatroomId]: updatedMessages }
      saveState(MESSAGES_STORAGE_KEY, updated)
      return { messagesByChatroomId: updated }
    }),
  prependMessages: (chatroomId, olderMessages) =>
    set(state => {
      const messages = state.messagesByChatroomId[chatroomId] || []
      const updatedMessages = [...olderMessages, ...messages]
      const updated = { ...state.messagesByChatroomId, [chatroomId]: updatedMessages }
      saveState(MESSAGES_STORAGE_KEY, updated)
      return { messagesByChatroomId: updated }
    }),
  clearMessages: (chatroomId) =>
    set(state => {
      const updated = { ...state.messagesByChatroomId }
      delete updated[chatroomId]
      saveState(MESSAGES_STORAGE_KEY, updated)
      return { messagesByChatroomId: updated }
    }),
}))
