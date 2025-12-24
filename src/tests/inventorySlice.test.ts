import inventoryReducer, { setItems, upsertProduct, removeProduct } from '../features/inventory/inventorySlice'

describe('inventory reducer', ()=>{
  it('upserts product correctly', ()=>{
    const initialState = { ids: [], entities: {}, status: 'idle', error: null }
    const state1 = inventoryReducer(initialState, setItems([{ id: 1, name: 'A', qty: 5, price: 2 }]))
    expect(state1.ids).toContain(1)
    expect(state1.entities[1].name).toBe('A')

    const state2 = inventoryReducer(state1, upsertProduct({ id: 1, name: 'A v2', qty: 3, price: 2 }))
    expect(state2.entities[1].name).toBe('A v2')

    const state3 = inventoryReducer(state2, upsertProduct({ id: 2, name: 'B', qty: 1, price: 5 }))
    expect(state3.ids).toContain(2)
    expect(state3.entities[2].name).toBe('B')

    const state4 = inventoryReducer(state3, removeProduct(1))
    expect(state4.ids).not.toContain(1)
  })
})
