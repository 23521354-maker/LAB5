import React from 'react'
import { useAppSelector } from '../../app/hooks'
import withRole from '../../hocs/withRole'

type Props = {
  item: { id:number; sku:string; name:string; qty:number; price?:number }
  onEdit: (item:any)=>void
  onDelete: (item:any)=>void
}

function InventoryRowInner({ item, onEdit, onDelete }: Props){
  const user = useAppSelector((s)=> s.auth.user)

  const DeleteAction: React.FC = () => (
    <button onClick={()=>onDelete(item)} className="text-sm px-2 py-1 bg-red-50 text-red-700 rounded">Delete</button>
  )

  const AdminDelete = withRole('admin')(DeleteAction)

  return (
    <tr className="border-t text-sm">
      <td className="px-3 py-2">{item.id}</td>
      <td className="px-3 py-2">{item.sku}</td>
      <td className="px-3 py-2">{item.name}</td>
      <td className="px-3 py-2">{item.qty}</td>
      <td className="px-3 py-2">${(item.price||0).toFixed(2)}</td>
      <td className="px-3 py-2">
        <div className="flex gap-2">
          <button onClick={()=>onEdit(item)} className="text-sm px-2 py-1 bg-slate-100 rounded">Edit</button>
          <AdminDelete />
        </div>
      </td>
    </tr>
  )
}

export default React.memo(InventoryRowInner)
