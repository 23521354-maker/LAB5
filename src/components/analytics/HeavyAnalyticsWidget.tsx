import React, { useMemo, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectCategoryBreakdown } from '../../features/inventory/inventorySlice'

export default function HeavyAnalyticsWidget(){
  const [crash, setCrash] = useState(false)
  const breakdown = useAppSelector(selectCategoryBreakdown)

  if(crash) {
    throw new Error('Simulated analytics crash')
  }

  const categories = breakdown
  const max = Math.max(1, ...categories.map(c=> c.value))

  return (
    <div className="bg-white p-4 rounded card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Inventory Value by Category</h3>
        <div className="flex items-center gap-2">
          <button onClick={()=>setCrash(true)} className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded">Simulate Crash</button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-40">
          <svg viewBox={`0 0 600 200`} width="100%" height="100%">
            {categories.map((c, i)=>{
              const w = (c.value / max) * 520
              const x = 40
              const y = i * 28 + 10
              return (
                <g key={c.category}>
                  <rect x={x} y={y} width={w} height={18} fill="#1e6fff" opacity={0.85} rx={4} />
                  <text x={x + w + 8} y={y + 13} fontSize={12} fill="#0f1724">{c.category} (${c.value.toFixed(2)})</text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="text-sm text-slate-600">Total inventory value: <span className="font-medium">${categories.reduce((s,c)=>s+c.value,0).toFixed(2)}</span></div>
      </div>
    </div>
  )
}
