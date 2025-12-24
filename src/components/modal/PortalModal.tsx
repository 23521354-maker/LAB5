import React from 'react'
import ReactDOM from 'react-dom'

type Props = { open: boolean; onClose: () => void; children?: React.ReactNode }

export default function PortalModal({ open, onClose, children }: Props){
  if(!open) return null
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded shadow-lg p-6 max-w-xl w-full">
        {children}
      </div>
    </div>,
    document.body
  )
}
