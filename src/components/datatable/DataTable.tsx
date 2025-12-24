import React, { useMemo, useState } from 'react'

type ColumnDef<T> = {
  header?: React.ReactNode
  field?: keyof T | string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

type DataTableProps<T> = {
  data: T[]
  rowKey: keyof T | string
  loading?: boolean
  empty?: React.ReactNode
  className?: string
}

function Column<T>(_props: ColumnDef<T> & { children?: React.ReactNode }){
  return null
}

function DataTableInner<T extends Record<string, any>>({ data, rowKey, loading, empty, className, children }: React.PropsWithChildren<DataTableProps<T>>){
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<1|-1>(1)

  const columns = useMemo(()=>{
    const cols: ColumnDef<T>[] = []
    React.Children.forEach(children, c=>{
      const child = c as any
      if(!child) return
      cols.push(child.props)
    })
    return cols
  },[children])

  const sorted = useMemo(()=>{
    if(!sortKey) return data
    const s = [...data]
    s.sort((a:any,b:any)=>{
      const A = a[sortKey]
      const B = b[sortKey]
      if(typeof A === 'string') return A.localeCompare(B) * sortDir
      return ((A||0) - (B||0)) * sortDir
    })
    return s
  },[data, sortKey, sortDir])

  const toggleSort = (key?: string, sortable?: boolean)=>{
    if(!sortable || !key) return
    if(sortKey === key) setSortDir(d => d === 1 ? -1 : 1)
    else { setSortKey(key); setSortDir(1) }
  }

  return (
    <div className={className}>
      <div className="bg-white p-0 rounded">
        {loading ? (
          <div className="p-4">
            <div className="space-y-2">
              {Array.from({length:6}).map((_,i)=> <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />)}
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="p-6 text-center text-slate-600">{empty ?? 'No data'}</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-600">
                <tr>
                  {columns.map((col, idx)=> (
                    <th key={idx} className={`px-3 py-2 ${col.sortable ? 'cursor-pointer select-none' : ''}`} onClick={()=> toggleSort(String(col.field), col.sortable)}>
                      <div className="flex items-center gap-2">
                        <span>{col.header}</span>
                        {col.sortable && sortKey === String(col.field) && (
                          <span className="text-xs">{sortDir === 1 ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, rIdx)=> (
                  <tr key={String(row[rowKey]) ?? rIdx} className="border-t text-sm">
                    {columns.map((col, cIdx)=> (
                      <td key={cIdx} className="px-3 py-2">
                        {col.render ? col.render(row[col.field as string], row) : row[col.field as string]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const DataTable = DataTableInner as unknown as typeof DataTableInner & { Column: typeof Column }
DataTable.Column = Column

export default DataTable

