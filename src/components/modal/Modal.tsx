import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

type Props = {
  open: boolean
  title?: React.ReactNode
  children?: React.ReactNode
  onClose?: () => void
}

const Modal: React.FC<Props> = ({ open, title, children, onClose }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose && onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const root = document.getElementById('modal-root') || document.body
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative bg-white rounded shadow-lg p-6 max-w-lg w-full">
        {title && <div className="mb-3 font-semibold">{title}</div>}
        <div>{children}</div>
      </div>
    </div>,
    root
  )
}

export default Modal
