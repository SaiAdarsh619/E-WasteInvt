import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchStats = createAsyncThunk('dashboard/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/dashboard/stats');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
  }
});

export const fetchMonthlyStats = createAsyncThunk('dashboard/fetchMonthly', async (year, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/dashboard/monthly', { params: { year } });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly stats');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    monthlyData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => { state.loading = true; })
      .addCase(fetchStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
      .addCase(fetchStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMonthlyStats.fulfilled, (state, action) => { state.monthlyData = action.payload; });
  },
});

export default dashboardSlice.reducer;
