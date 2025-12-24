import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (creds: { email: string; password: string }, thunkAPI) => {
    const { email, password } = creds
    await new Promise((res) => setTimeout(res, 700))
    if (!email.includes('@') || password.length < 6) {
      // dispatch error toast
      try{ thunkAPI.dispatch(require('../ui/uiSlice').pushToast({ type: 'error', title: 'Login failed', message: 'Invalid email or password' })) }catch(e){}
      return thunkAPI.rejectWithValue('Invalid email or password')
    }
    const payload = { user: { id: '1', name: 'Admin', role: 'admin' }, token: 'fake-token' }
    try{ thunkAPI.dispatch(require('../ui/uiSlice').pushToast({ type: 'success', title: 'Welcome', message: `Welcome back, ${payload.user.name}` })) }catch(e){}
    return payload
  }
)

type State = {
  user: null | { id: string; name: string; role?: string }
  token: null | string
  loading: boolean
  error: string | null
}

const initialState: State = {
  user: null,
  token: null,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Login failed'
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
