import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchComponents = createAsyncThunk('components/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/components', { params });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch components');
  }
});

export const createComponent = createAsyncThunk('components/create', async (compData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/components', compData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create component');
  }
});

export const updateComponent = createAsyncThunk('components/update', async ({ id, compData }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/components/${id}`, compData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update component');
  }
});

export const deleteComponent = createAsyncThunk('components/delete', async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/components/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete component');
  }
});

const componentSlice = createSlice({
  name: 'components',
  initialState: {
    components: [],
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
      .addCase(fetchComponents.pending, (state) => { state.loading = true; })
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.loading = false;
        state.components = action.payload.components;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchComponents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createComponent.fulfilled, (state, action) => {
        state.components.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateComponent.fulfilled, (state, action) => {
        const idx = state.components.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.components[idx] = action.payload;
      })
      .addCase(deleteComponent.fulfilled, (state, action) => {
        state.components = state.components.filter((c) => c._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { clearError: clearComponentError } = componentSlice.actions;
export default componentSlice.reducer;
