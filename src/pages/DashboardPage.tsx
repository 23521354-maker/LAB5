import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchInventory, setItems, selectAllProducts, selectTotalQuantity, selectTotalInventoryValue } from '../features/inventory/inventorySlice'
import EditProductModal from '../components/modal/EditProductModal'
import ConfirmDeleteModal from '../components/modal/ConfirmDeleteModal'
import DataTable from '../components/datatable/DataTable'
import useFetchInventory from '../app/useFetchInventory'

const PAGE_SIZE = 50

export default function DashboardPage(){
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.inventory.status)
  const items = useAppSelector(selectAllProducts)

  // use hook to fetch inventory when needed (avoids refetching)
  const { status: fetchStatus, error: fetchError } = useFetchInventory()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [editing, setEditing] = useState<any>(null)
  const [deleting, setDeleting] = useState<any>(null)

  const user = useAppSelector(s => s.auth.user)

  const onEdit = useCallback((item:any)=> setEditing(item),[])
  const onDelete = useCallback((item:any)=> setDeleting(item),[])

  const handleSave = useCallback((_product:any)=>{
    // product is upserted by EditProductModal; simply close modal
    setEditing(null)
  },[])

  const handleConfirmDelete = useCallback((_item:any)=>{
    // deletion handled inside ConfirmDeleteModal; just clear selection
    setDeleting(null)
  },[])

  const filtered = useMemo(()=>{
    const q = search.trim().toLowerCase()
    let list = items
    if(q) list = list.filter((it:any)=> it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q))
    return list
  },[items, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = useMemo(()=> filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE), [filtered, page])

  useEffect(()=>{ if(page > totalPages) setPage(1) },[totalPages])

  const totalProducts = items.length
  const totalQty = useAppSelector(selectTotalQuantity)
  const totalValue = useAppSelector(selectTotalInventoryValue)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded card">
          <div className="text-sm text-slate-500">Total products</div>
          <div className="text-2xl font-bold">{totalProducts}</div>
        </div>
        <div className="bg-white p-4 rounded card">
          <div className="text-sm text-slate-500">Total quantity</div>
          <div className="text-2xl font-bold">{totalQty}</div>
        </div>
        <div className="bg-white p-4 rounded card">
          <div className="text-sm text-slate-500">Total inventory value</div>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1) }} placeholder="Search name or SKU" className="p-2 border rounded" />
          </div>
          <div className="text-sm text-slate-600">Showing {filtered.length} results</div>
        </div>

        <DataTable data={pageItems} rowKey="id" loading={status === 'loading'} empty={<div>No products found</div>}>
          <DataTable.Column header="ID" field="id" />
          <DataTable.Column header="SKU" field="sku" />
          <DataTable.Column header="Name" field="name" sortable />
          <DataTable.Column header="Qty" field="qty" sortable />
          <DataTable.Column header="Price" field="price" sortable render={(v:any)=> `$${Number(v||0).toFixed(2)}`} />
          <DataTable.Column header="Actions" render={(_v:any,row:any)=> (
            <div className="flex gap-2">
              <button onClick={()=>onEdit(row)} className="text-sm px-2 py-1 bg-slate-100 rounded">Edit</button>
              {user && (user as any).role === 'admin' ? (
                <button onClick={()=>onDelete(row)} className="text-sm px-2 py-1 bg-red-50 text-red-700 rounded">Delete</button>
              ) : null}
            </div>
          )} />
        </DataTable>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">Page {page} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setPage(1)} disabled={page===1} className="px-2 py-1 border rounded">First</button>
            <button onClick={()=>setPage(p=> Math.max(1, p-1))} disabled={page===1} className="px-2 py-1 border rounded">Prev</button>
            <button onClick={()=>setPage(p=> Math.min(totalPages, p+1))} disabled={page===totalPages} className="px-2 py-1 border rounded">Next</button>
            <button onClick={()=>setPage(totalPages)} disabled={page===totalPages} className="px-2 py-1 border rounded">Last</button>
          </div>
        </div>
      </div>

      <EditProductModal open={!!editing} product={editing} onClose={()=>setEditing(null)} onSave={handleSave} />
      <ConfirmDeleteModal open={!!deleting} item={deleting} onClose={()=>setDeleting(null)} onConfirm={handleConfirmDelete} />
    </div>
  )
}
