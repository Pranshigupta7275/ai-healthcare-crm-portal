import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/interactions/';

// Async actions for API calls
export const fetchInteractions = createAsyncThunk('interactions/fetch', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const createInteraction = createAsyncThunk('interactions/create', async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
});

export const updateInteraction = createAsyncThunk('interactions/update', async ({ id, notes }) => {
  const response = await axios.put(`${API_URL}${id}`, { notes });
  return response.data;
});

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch interactions
      .addCase(fetchInteractions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create interaction
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update interaction
      .addCase(updateInteraction.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default interactionsSlice.reducer;