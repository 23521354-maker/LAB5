import React, { useState, useEffect, useMemo } from 'react'
import Modal from './Modal'
import { useAppDispatch } from '../../app/hooks'
import { upsertProduct } from '../../features/inventory/inventorySlice'
import { pushToast } from '../../features/ui/uiSlice'

type Props = {
  open: boolean
  product?: any
  onClose: ()=>void
  onSave?: (p:any)=>void
}

export default function EditProductModal({ open, product, onClose, onSave }: Props){
  const dispatch = useAppDispatch()
  const [name, setName] = useState(product?.name||'')
  const [sku, setSku] = useState(product?.sku||'')
  const [price, setPrice] = useState<number>(product?.price ?? 0)
  const [qty, setQty] = useState<number>(product?.qty ?? 0)
  const [category, setCategory] = useState(product?.category || '')
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(()=>{
    setName(product?.name||'')
    setSku(product?.sku||'')
    setPrice(product?.price ?? 0)
    setQty(product?.qty ?? 0)
    setCategory(product?.category || '')
    setTouched({})
  },[product, open])

  const errors = useMemo(()=>{
    const e: Record<string,string> = {}
    if(!name || name.trim().length < 3) e.name = 'Name must be at least 3 characters'
    const skuRe = /^[A-Z0-9-]{6,16}$/
    if(!sku || !skuRe.test(sku)) e.sku = 'SKU must be 6-16 chars, uppercase letters, numbers or -'
    if(price < 0) e.price = 'Price must be 0 or more'
    if(!Number.isInteger(qty) || qty < 0) e.qty = 'Quantity must be an integer 0 or more'
    if(!category) e.category = 'Category is required'
    return e
  },[name, sku, price, qty, category])

  const isValid = Object.keys(errors).length === 0

  const handleSave = () => {
    setTouched({ name:true, sku:true, price:true, qty:true, category:true })
    if(!isValid) return
    const payload = { ...(product || {}), name: name.trim(), sku, price: Number(price), qty: Number(qty), category, updatedAt: new Date().toISOString() }
    dispatch(upsertProduct(payload))
    dispatch(pushToast({ type: 'success', title: 'Saved', message: `${payload.name} saved` }))
    onSave && onSave(payload)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit Product' : 'New Product'}>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} onBlur={()=>setTouched(t=>({...t, name:true}))} className="w-full p-2 border rounded" />
          {touched.name && errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
        </div>

        <div>
          <label className="block text-sm mb-1">SKU</label>
          <input value={sku} onChange={(e)=>setSku(e.target.value.toUpperCase())} onBlur={()=>setTouched(t=>({...t, sku:true}))} className="w-full p-2 border rounded" />
          {touched.sku && errors.sku && <div className="text-sm text-red-600">{errors.sku}</div>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input type="number" step="0.01" value={price} onChange={(e)=>setPrice(Number(e.target.value))} onBlur={()=>setTouched(t=>({...t, price:true}))} className="w-full p-2 border rounded" />
            {touched.price && errors.price && <div className="text-sm text-red-600">{errors.price}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">Quantity</label>
            <input type="number" value={qty} onChange={(e)=>setQty(Number(e.target.value))} onBlur={()=>setTouched(t=>({...t, qty:true}))} className="w-full p-2 border rounded" />
            {touched.qty && errors.qty && <div className="text-sm text-red-600">{errors.qty}</div>}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Category</label>
          <input value={category} onChange={(e)=>setCategory(e.target.value)} onBlur={()=>setTouched(t=>({...t, category:true}))} className="w-full p-2 border rounded" />
          {touched.category && errors.category && <div className="text-sm text-red-600">{errors.category}</div>}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button onClick={handleSave} disabled={!isValid} className={`px-3 py-1 bg-[var(--accent)] text-white rounded ${!isValid ? 'opacity-60 cursor-not-allowed' : ''}`}>Save</button>
        </div>
      </div>
    </Modal>
  )
}
