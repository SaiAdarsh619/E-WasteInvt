import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchSales = createAsyncThunk('sales/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/sales', { params });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales');
  }
});

export const createSale = createAsyncThunk('sales/create', async (saleData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/sales', saleData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create sale');
  }
});

export const fetchDisposals = createAsyncThunk('sales/fetchDisposals', async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/sales/disposals', { params });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch disposals');
  }
});

export const createDisposal = createAsyncThunk('sales/createDisposal', async (disposalData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/sales/dispose', disposalData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create disposal');
  }
});

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    sales: [],
    disposals: [],
    totalSales: 0,
    totalDisposals: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => { state.loading = true; })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.sales;
        state.totalSales = action.payload.total;
      })
      .addCase(fetchSales.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createSale.fulfilled, (state, action) => { state.sales.unshift(action.payload); })
      .addCase(fetchDisposals.fulfilled, (state, action) => {
        state.disposals = action.payload.disposals;
        state.totalDisposals = action.payload.total;
      })
      .addCase(createDisposal.fulfilled, (state, action) => { state.disposals.unshift(action.payload); });
  },
});

export const { clearError: clearSalesError } = salesSlice.actions;
export default salesSlice.reducer;
