import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'

export default function Sidebar(){
  const sidebarOpen = useAppSelector(s=> s.ui.sidebarOpen)
  if(!sidebarOpen) return null
  return (
    <aside className="app-sidebar w-64 min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-semibold">NexSales</h1>
        <div className="text-xs opacity-80">Enterprise</div>
      </div>
      <nav className="p-4 flex-1">
        <ul>
          <li className="mb-2">
            <NavLink to="/dashboard" className={({isActive})=> isActive? 'block px-3 py-2 rounded bg-[rgba(255,255,255,0.06)]':'block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.03)]'}>Dashboard</NavLink>
          </li>
          <li className="mb-2">
            <NavLink to="/dashboard/analytics" className={({isActive})=> isActive? 'block px-3 py-2 rounded bg-[rgba(255,255,255,0.06)]':'block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.03)]'}>Analytics</NavLink>
          </li>
        </ul>
      </nav>
      <div className="p-4 text-xs opacity-80 border-t border-slate-800">v0.1.0</div>
    </aside>
  )
}
