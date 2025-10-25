"use client";

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  available: [
    'gemini-2.5-flash',
    'gpt-4o-mini',
    'llama-3-8b-instruct',
    'mistral-small',
  ]
};

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setAvailableModels(state, { payload }) { state.available = payload; },
  }
});

export const { setAvailableModels } = modelsSlice.actions;
export default modelsSlice.reducer;
