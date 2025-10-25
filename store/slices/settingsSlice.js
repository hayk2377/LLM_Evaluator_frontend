"use client";

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comparisonMode: 'baseline', // 'baseline' | 'custom'
  baseTemperature: 0.5,
  baseTopP: 0.8,
  customSets: [], // {id, T, P}
  prompt: 'Write a detailed, three-paragraph explanation of the difference between quantum computing and classical computing.',
  view: 'results', // 'results' | 'analytics'
  selectedMetric: 'ttr', // for heatmap
  filters: {
    tMin: 0.0,
    tMax: 1.0,
    pMin: 0.0,
    pMax: 1.0,
    step: 0.1,
  }
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setComparisonMode(state, { payload }) { state.comparisonMode = payload; },
    setBaseTemperature(state, { payload }) { state.baseTemperature = payload; },
    setBaseTopP(state, { payload }) { state.baseTopP = payload; },
    setPrompt(state, { payload }) { state.prompt = payload; },
  setView(state, { payload }) { state.view = payload; },

    addCustomSet(state, { payload }) { state.customSets.push(payload); },
    removeCustomSet(state, { payload }) { state.customSets = state.customSets.filter(s => s.id !== payload); },
    clearCustomSets(state) { state.customSets = []; },

    setSelectedMetric(state, { payload }) { state.selectedMetric = payload; },
    setFilters(state, { payload }) { state.filters = { ...state.filters, ...payload }; },
  }
});

export const {
  setComparisonMode,
  setBaseTemperature,
  setBaseTopP,
  setPrompt,
  setView,
  addCustomSet,
  removeCustomSet,
  clearCustomSets,
  setSelectedMetric,
  setFilters,
} = slice.actions;

export default slice.reducer;
