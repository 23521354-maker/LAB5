import React, { useEffect } from 'react'
import { useAppSelector } from './hooks'

export default function ThemeProvider({ children }: { children: React.ReactNode }){
  const dark = useAppSelector(s=> s.ui.darkMode)

  useEffect(()=>{
    if(dark) document.documentElement.classList.add('theme-dark')
    else document.documentElement.classList.remove('theme-dark')
  },[dark])

  return <>{children}</>
}
