import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { fetchInventory } from '../features/inventory/inventorySlice'

export default function useFetchInventory(){
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.inventory.status)
  const error = useAppSelector(s => s.inventory.error)

  useEffect(()=>{
    if(status === 'idle'){
      dispatch(fetchInventory())
    }
  },[status, dispatch])

  return { status, error }
}
