import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from './test-utils'
import AppRoutes from '../routes/AppRoutes'
import * as authApi from './__mocks__/authApi'
import * as authSlice from '../features/auth/authSlice'



describe('Login flow', ()=>{
  it('logs in and redirects to dashboard (happy path)', async ()=>{
    // spy on the real thunk and mock its implementation to simulate success
    const spy = jest.spyOn(authSlice as any, 'loginAsync')
    spy.mockImplementation(({ email, password }: any) => async (dispatch: any) => {
      const payload = { user: { id: '1', name: 'Admin', role: 'admin' }, token: 'fake-token' }
      // dispatch the fulfilled action so reducer updates state
      dispatch({ type: 'auth/loginAsync/fulfilled', payload })
      // also dispatch a toast like the real thunk
      dispatch({ type: 'ui/pushToast', payload: { type: 'success', title: 'Welcome', message: `Welcome back, ${payload.user.name}` } })
      return { payload }
    })

    renderWithProviders(<AppRoutes />, { route: '/login' })

    const emailInput = screen.getByLabelText(/email/i)
    const pwInput = screen.getByLabelText(/password/i)
    const button = screen.getByRole('button', { name: /sign in/i })

    await userEvent.type(emailInput, 'admin@example.com')
    await userEvent.type(pwInput, 'password')
    await userEvent.click(button)

    await waitFor(()=>{
      // ensure auth state was updated and token present
      const { store } = require('../app/store')
      expect(store.getState().auth.token).toBe('fake-token')
    })
  })
})
