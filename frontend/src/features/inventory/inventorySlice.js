import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchInventory = createAsyncThunk('inventory/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/inventory', { params });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
  }
});

export const stockIn = createAsyncThunk('inventory/stockIn', async (stockData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/inventory/stock-in', stockData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Stock in failed');
  }
});

export const stockOut = createAsyncThunk('inventory/stockOut', async (stockData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/inventory/stock-out', stockData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Stock out failed');
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventory: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.loading = true; })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload.inventory;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchInventory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(stockIn.fulfilled, (state, action) => {
        const idx = state.inventory.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) {
          state.inventory[idx] = action.payload;
        } else {
          state.inventory.unshift(action.payload);
        }
      })
      .addCase(stockOut.fulfilled, (state, action) => {
        const idx = state.inventory.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.inventory[idx] = action.payload;
      });
  },
});

export const { clearError: clearInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;
