import React from 'react'
import Modal from './Modal'
import { useAppDispatch } from '../../app/hooks'
import { removeProduct } from '../../features/inventory/inventorySlice'
import { pushToast } from '../../features/ui/uiSlice'

export default function ConfirmDeleteModal({ open, item, onClose, onConfirm }:{ open:boolean; item?:any; onClose:()=>void; onConfirm:(item:any)=>void }){
  const dispatch = useAppDispatch()

  const handleDelete = () => {
    if(!item) return
    dispatch(removeProduct(item.id))
    dispatch(pushToast({ type: 'success', title: 'Deleted', message: `${item.name} removed` }))
    onConfirm && onConfirm(item)
    onClose && onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete">
      <div>
        <p className="text-sm text-slate-700 mb-4">Are you sure you want to delete <strong>{item?.name}</strong>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </Modal>
  )
}
