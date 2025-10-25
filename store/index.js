"use client";

import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';
import resultsReducer from './slices/resultsSlice';
import analyticsReducer from './slices/analyticsSlice';
import modelsReducer from './slices/modelsSlice';

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    results: resultsReducer,
    models: modelsReducer,
    analytics: analyticsReducer,
  }
});

export default store;
export const AppDispatch = store.dispatch;
