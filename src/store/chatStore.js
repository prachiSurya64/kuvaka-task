import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  chatrooms: [ { id: uuidv4(), title: 'Welcome Chat', messages: [] } ]
}

const chatStore = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createRoom(state, action){
      state.chatrooms.unshift({ id: uuidv4(), title: action.payload.title || `Chat ${Date.now()}`, messages: [] })
    },
    deleteRoom(state, action){
      state.chatrooms = state.chatrooms.filter(r=>r.id !== action.payload)
    },
    addMessage(state, action){
      const { roomId, message } = action.payload
      const room = state.chatrooms.find(r=>r.id === roomId)
      if(room) room.messages.push(message)
    },
    setRooms(state, action){ state.chatrooms = action.payload }
  }
})

export const { createRoom, deleteRoom, addMessage, setRooms } = chatStore.actions
export default chatStore.reducer