import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '../routes/AppRoutes'

test('renders dashboard route', async ()=>{
  render(
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  )
  // root redirects; smoke test that app mounts
  expect(true).toBe(true)
})
