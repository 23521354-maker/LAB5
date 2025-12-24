import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'

export const fetchInventory = createAsyncThunk('inventory/fetch', async (_arg, thunkAPI) => {
  try{
    await new Promise((res)=> setTimeout(res, 2000))
    // simulate data (include price)
    const items = Array.from({length:5000}).map((_,i)=> ({ id: i+1, sku: `SKU-${i+1}`, name: `Product ${i+1}`, qty: Math.floor(Math.random()*200), price: Number((Math.random()*200).toFixed(2)), category: ['Electronics','Apparel','Home'][i%3] }))
    return items
  }catch(e){
    try{ thunkAPI.dispatch(require('../ui/uiSlice').pushToast({ type: 'error', title: 'Inventory', message: 'Failed to fetch inventory' })) }catch(e){}
    return thunkAPI.rejectWithValue('Failed')
  }
})

export const updateProduct = createAsyncThunk('inventory/update', async (product: any, thunkAPI) => {
  try{
    await new Promise((res)=> setTimeout(res, 500))
    try{ thunkAPI.dispatch(require('../ui/uiSlice').pushToast({ type: 'success', title: 'Updated', message: `${product.name} updated` })) }catch(e){}
    return product
  }catch(e){
    try{ thunkAPI.dispatch(require('../ui/uiSlice').pushToast({ type: 'error', title: 'Update failed', message: `Could not update ${product.name}` })) }catch(e){}
    return thunkAPI.rejectWithValue('Update failed')
  }
})

const adapter = createEntityAdapter<any>({ selectId: (e) => e.id })

const initialState = adapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as null | string
})

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems: (state, action) => {
      adapter.setAll(state, action.payload)
    },
    removeProduct: (state, action) => {
      adapter.removeOne(state, action.payload)
    },
    upsertProduct: (state, action) => {
      const p = { ...action.payload }
      p.updatedAt = new Date().toISOString()
      adapter.upsertOne(state, p)
    }
  },
  extraReducers: (builder)=>{
    builder
      .addCase(fetchInventory.pending, (state)=>{ state.status = 'loading'; state.error = null })
      .addCase(fetchInventory.fulfilled, (state, action)=>{ state.status = 'succeeded'; adapter.setAll(state, action.payload) })
      .addCase(fetchInventory.rejected, (state, action)=>{ state.status = 'failed'; state.error = action.payload as string || 'Failed' })
      .addCase(updateProduct.fulfilled, (state, action)=>{
        adapter.upsertOne(state, action.payload)
      })
  }
})

export const { setItems, removeProduct, upsertProduct } = inventorySlice.actions
export default inventorySlice.reducer

// Selectors
const inventorySelectors = adapter.getSelectors((state:any)=> state.inventory)

export const selectAllProducts = inventorySelectors.selectAll
export const selectProductById = inventorySelectors.selectById

export const selectTotalQuantity = createSelector(selectAllProducts, (products)=> products.reduce((s:any,p:any)=> s + (p.qty||0), 0))

export const selectTotalInventoryValue = createSelector(selectAllProducts, (products)=> products.reduce((s:any,p:any)=> s + ((p.qty||0) * (p.price||0)), 0))

export const selectCategoryBreakdown = createSelector(selectAllProducts, (products)=>{
  const map: Record<string, { value: number; quantity: number }> = {}
  products.forEach(p=>{
    const cat = p.category || 'Uncategorized'
    const val = (p.price||0) * (p.qty||0)
    if(!map[cat]) map[cat] = { value: 0, quantity: 0 }
    map[cat].value += val
    map[cat].quantity += p.qty || 0
  })
  const arr = Object.keys(map).map(cat=> ({ category: cat, value: map[cat].value, quantity: map[cat].quantity }))
  arr.sort((a,b)=> b.value - a.value)
  return arr
})
