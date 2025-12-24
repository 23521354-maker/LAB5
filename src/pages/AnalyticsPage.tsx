import React, { Suspense, lazy } from 'react'
import { useAppSelector } from '../app/hooks'
import ErrorBoundary from '../components/ErrorBoundary'
import { selectAllProducts, selectTotalQuantity, selectTotalInventoryValue } from '../features/inventory/inventorySlice'

const HeavyAnalyticsWidget = lazy(() => import('../components/analytics/HeavyAnalyticsWidget'))

export default function AnalyticsPage(){
  const items = useAppSelector(selectAllProducts)
  const totalProducts = items.length
  const totalQty = useAppSelector(selectTotalQuantity)
  const totalValue = useAppSelector(selectTotalInventoryValue)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Analytics</h2>
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

      <div>
        <ErrorBoundary>
          <Suspense fallback={<div className="p-6">Loading analytics…</div>}>
            <HeavyAnalyticsWidget />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
