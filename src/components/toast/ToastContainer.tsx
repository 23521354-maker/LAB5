import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Toast from './Toast'
import { dismissToast } from '../../features/ui/uiSlice'

export default function ToastContainer(){
  const dispatch = useAppDispatch()
  const toasts = useAppSelector((s)=> s.ui.toasts)

  useEffect(()=>{
    const timers: Record<string, any> = {}
    toasts.forEach(t => {
      if(timers[t.id]) return
      timers[t.id] = setTimeout(()=>{
        dispatch(dismissToast(t.id))
        delete timers[t.id]
      }, 3600)
    })
    return ()=>{
      Object.values(timers).forEach(clearTimeout)
    }
  },[toasts, dispatch])

  if(!toasts.length) return null
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(t=> (
        <Toast key={t.id} id={t.id} type={t.type} title={t.title} message={t.message} onClose={(id)=>dispatch(dismissToast(id))} />
      ))}
    </div>
  )
}
