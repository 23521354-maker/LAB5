import React from 'react'

export default function Toast({ id, type, title, message, onClose }:{ id: string; type?: string; title?: string; message: string; onClose: (id:string)=>void }){
  const color = type === 'success' ? 'bg-emerald-50 border-emerald-200' : type === 'error' ? 'bg-red-50 border-red-200' : 'bg-sky-50 border-sky-200'
  return (
    <div className={`w-80 border p-3 rounded ${color} shadow-sm`}> 
      <div className="flex justify-between items-start">
        <div>
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          <div className="text-sm text-slate-700">{message}</div>
        </div>
        <button onClick={()=>onClose(id)} className="ml-3 text-sm opacity-70">✕</button>
      </div>
    </div>
  )
}
