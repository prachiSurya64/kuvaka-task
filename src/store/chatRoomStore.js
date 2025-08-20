  import { create } from 'zustand'
import { saveState, loadState } from '../utils/localStorage'

const CHATROOMS_STORAGE_KEY = 'gemini-chatrooms'

export const useChatroomsStore = create(set => ({
  chatrooms: loadState(CHATROOMS_STORAGE_KEY, []),
  addChatroom: (title) =>
    set(state => {
      const newChatroom = {
        id: Date.now().toString(),
        title,
        lastMessage: '',
        updatedAt: new Date().toISOString(),
      }
      const updated = [newChatroom, ...state.chatrooms]
      saveState(CHATROOMS_STORAGE_KEY, updated)
      return { chatrooms: updated }
    }),
  deleteChatroom: (id) =>
    set(state => {
      const updated = state.chatrooms.filter(c => c.id !== id)
      saveState(CHATROOMS_STORAGE_KEY, updated)
      return { chatrooms: updated }
    }),
  updateChatroomLastMessage: (id, lastMessage) =>
    set(state => {
      const updated = state.chatrooms.map(c =>
        c.id === id ? { ...c, lastMessage, updatedAt: new Date().toISOString() } : c
      )
      saveState(CHATROOMS_STORAGE_KEY, updated)
      return { chatrooms: updated }
    }),
}))
