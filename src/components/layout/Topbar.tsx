import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { toggleSidebar, toggleDarkMode } from '../../features/ui/uiSlice'

export default function Topbar(){
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s)=> s.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="app-topbar h-16 flex items-center px-6 shadow-sm">
      <div className="flex-1 text-sm font-medium">{user ? `Welcome, ${user.name}` : 'Welcome, Admin'}</div>
      <div className="flex items-center gap-4">
        <button onClick={()=>dispatch(toggleSidebar())} className="text-sm px-3 py-1 rounded hover:bg-slate-100">Toggle Sidebar</button>
        <button onClick={()=>dispatch(toggleDarkMode())} className="text-sm px-3 py-1 rounded hover:bg-slate-100">Toggle Theme</button>
        <button onClick={handleLogout} className="text-sm px-3 py-1 rounded bg-[var(--accent)] text-white">Logout</button>
      </div>
    </header>
  )
}
