import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchDevices = createAsyncThunk('devices/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/devices', { params });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch devices');
  }
});

export const createDevice = createAsyncThunk('devices/create', async (deviceData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/devices', deviceData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create device');
  }
});

export const updateDevice = createAsyncThunk('devices/update', async ({ id, deviceData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/devices/${id}`, deviceData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update device');
  }
});

export const deleteDevice = createAsyncThunk('devices/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/devices/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete device');
  }
});

const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    devices: [],
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
      .addCase(fetchDevices.pending, (state) => { state.loading = true; })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.devices;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchDevices.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.devices.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const idx = state.devices.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) state.devices[idx] = action.payload;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.devices = state.devices.filter((d) => d._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { clearError: clearDeviceError } = deviceSlice.actions;
export default deviceSlice.reducer;
