"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postAnalytics } from '../../lib/api';
import { getComparisonSets } from '../../lib/utils';
import { rotateModels } from '../../lib/modelRotation';

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetch',
  async (_, { getState }) => {
    const state = getState();
    const { comparisonMode, baseTemperature, baseTopP, customSets, prompt } = state.settings;
    const parameterSets = getComparisonSets({
      mode: comparisonMode,
      baseTemperature,
      baseTopP,
      customSets,
    });
    const param_pairs = parameterSets.map(s => ({ temperature: s.T, top_p: s.P }));
    const model = rotateModels(state.models.available, 0);
    const analytics = await postAnalytics({ prompt, model, param_pairs });
    // Expect analytics.scatter_data: rows with avg_* (raw) and norm_* (0-100) fields
    const rows = Array.isArray(analytics?.scatter_data) ? analytics.scatter_data : [];
    return rows.map((r, i) => ({
      id: i,
      model: r.model,
      temperature: Number(r.temperature),
      top_p: Number(r.top_p),
      run_count: Number(r.run_count ?? 0),
      // Provide both raw and normalized metrics
      metrics: {
        // raw
        lexical_diversity: Number(r.avg_lexical_diversity ?? 0),
        query_coverage: Number(r.avg_query_coverage ?? 0),
        fk_grade: Number(r.avg_fk_grade ?? 0),
        repetition_penalty: Number(r.avg_repetition_penalty ?? 0),
        // normalized 0-100 (when provided by backend)
        norm_lexical_diversity: Number(r.norm_lexical_diversity ?? r.avg_lexical_diversity ?? 0),
        norm_query_coverage: Number(r.norm_query_coverage ?? r.avg_query_coverage ?? 0),
        norm_fk_grade: Number(r.norm_fk_grade ?? 0),
        norm_repetition_penalty: Number(r.norm_repetition_penalty ?? 0),
      },
    }));
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { items: [], loading: false, error: null },
  reducers: { clearAnalytics(state){ state.items = []; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAnalytics.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(fetchAnalytics.rejected, (state, action) => { state.loading = false; state.error = action.error?.message || 'Failed to fetch analytics'; });
  }
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
