import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'))
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes(){
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<DashboardPage/>} />
          <Route path="analytics" element={<AnalyticsPage/>} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
