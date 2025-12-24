import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'

type ToastType = 'success' | 'error' | 'info'
type Toast = { id: string; type: ToastType; title?: string; message: string }

const initialState: { toasts: Toast[]; sidebarOpen: boolean; darkMode: boolean } = {
  toasts: [],
  sidebarOpen: true,
  darkMode: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    pushToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload)
      },
      prepare(payload: { type?: ToastType; title?: string; message: string }){
        return { payload: { id: nanoid(), type: payload.type || 'info', title: payload.title, message: payload.message } }
      }
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
    clearToasts: (state) => { state.toasts = [] },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => { state.sidebarOpen = action.payload },
    toggleDarkMode: (state) => { state.darkMode = !state.darkMode }
  }
})

export const { pushToast, dismissToast, clearToasts, toggleSidebar, setSidebarOpen, toggleDarkMode } = uiSlice.actions
export default uiSlice.reducer
