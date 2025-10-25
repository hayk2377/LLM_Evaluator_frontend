"use client";

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setView } from '../store/slices/settingsSlice';
import { fetchAnalytics } from '../store/slices/analyticsSlice';
import ResultsCarousel from './ResultsCarousel';
import AnalyticsDashboard from './AnalyticsDashboard';
import LoadingOverlay from './LoadingOverlay';

export default function ResultsView(){
  const dispatch = useDispatch();
  const { view, selectedMetric, prompt } = useSelector(s => s.settings);
  const results = useSelector(s => s.results.items);
  const analytics = useSelector(s => s.analytics.items);
  const loadingResults = useSelector(s => s.results.loading);
  const loadingAnalytics = useSelector(s => s.analytics.loading);

  const showAnalytics = () => {
    dispatch(setView('analytics'));
    // Backend analytics endpoint aggregates DB and may not require a prompt
    dispatch(fetchAnalytics());
  };
  const backToResults = () => dispatch(setView('results'));

  // After results finish loading, auto-scroll to carousel
  useEffect(() => {
    if (!loadingResults && view === 'results' && results && results.length > 0) {
      const el = document.getElementById('results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [loadingResults, view, results]);

  return (
    <>
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{view === 'results' ? 'Prompt Results' : 'Analytics'}</h2>
          {view === 'results' ? (
            <button onClick={showAnalytics} className="px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Show Analytics
            </button>
          ) : (
            <button onClick={backToResults} className="px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Back to Results
            </button>
          )}
        </div>

        {view === 'results' ? (
          results && results.length > 0 ? (
            <ResultsCarousel results={results} />
          ) : (
            <p className="text-gray-500">Run a test to see results here.</p>
          )
        ) : (
          <AnalyticsDashboard analytics={analytics} selectedMetric={selectedMetric} />
        )}
      </section>

      <LoadingOverlay show={loadingResults || loadingAnalytics} label={loadingResults ? 'Testing prompt…' : (loadingAnalytics ? 'Loading analytics…' : 'Processing…')} />
    </>
  );
}
