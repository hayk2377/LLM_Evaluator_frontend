"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { calculateTTR, calculateQueryCoverage } from '../../lib/metrics';
import { getComparisonSets } from '../../lib/utils';
import { postPromptTest } from '../../lib/api';
import { rotateModels } from '../../lib/modelRotation';

export const generateAndEvaluate = createAsyncThunk(
  'results/generateAndEvaluate',
  async (_, { getState }) => {
    const state = getState();
    const { comparisonMode, baseTemperature, baseTopP, customSets, prompt } = state.settings;

    const parameterSets = getComparisonSets({
      mode: comparisonMode,
      baseTemperature,
      baseTopP,
      customSets,
    });

    // Build batch payload for /test-prompt
    const param_pairs = parameterSets.map(s => ({ temperature: s.T, top_p: s.P }));
    // Choose model for the batch (API requires single model). If you want rotation per pair, implement server-side.
    const batchModel = rotateModels(state.models.available, 0);

  const batch = await postPromptTest({ prompt, model: batchModel, param_pairs });

    // Map backend outputs to our results array preserving labels and order
    const results = parameterSets.map((set, i) => {
      const entry = batch[i] || {};
      const responseText = entry.output || entry.text || entry.response || '';
      const m = entry.metrics || null;
      const metrics = m ? {
        ttr: m.lexical_diversity ?? m.ttr ?? 0,
        coverage: m.query_coverage ?? m.coverage ?? 0,
        // New metrics (use if provided by backend)
        fkGrade: m.fk_grade ?? m.fkGrade ?? m.norm_fk_grade ?? null,
        nonRepetition: m.repetition_penalty ?? m.non_repetition ?? m.norm_repetition_penalty ?? null,
        wordCount: responseText ? (responseText.split(/\s+/).filter(w=>w).length) : 0,
      } : {
        // Fallback: compute ttr and coverage client-side; leave new metrics as null
        ttr: calculateTTR(responseText),
        coverage: calculateQueryCoverage(prompt, responseText),
        wordCount: responseText ? (responseText.split(/\s+/).filter(w=>w).length) : 0,
        fkGrade: null,
        nonRepetition: null,
      };
      return {
        id: i,
        label: set.label || `T=${set.T.toFixed(2)} P=${set.P.toFixed(2)}`,
        temperature: (entry.temperature ?? set.T).toFixed(2),
        topP: (entry.top_p ?? set.P).toFixed(2),
        response: responseText,
        ...metrics,
      };
    });

    return results;
  }
);

const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearResults(state) { state.items = []; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAndEvaluate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAndEvaluate.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(generateAndEvaluate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to generate evaluations';
      });
  }
});

export const { clearResults } = resultsSlice.actions;
export default resultsSlice.reducer;
