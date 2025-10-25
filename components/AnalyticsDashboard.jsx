"use client";

import React, { useMemo } from 'react';
import Heatmap from './Heatmap';
import ChartTitle from './ChartTitle';
import MultiLineChart from './MultiLineChart';
import { BarChart3 } from 'lucide-react';

// Convert analytics items to the shape Heatmap expects: array of results-like entries with metric keys
export default function AnalyticsDashboard({ analytics, selectedMetric }) {
  // Normalize analytics items (from scatter_data mapping) to a shape Heatmap expects
  const resultsLike = useMemo(() => {
    return (analytics || []).map((a, idx) => {
      const m = a.metrics || {};
      const t = Number(a.temperature);
      const p = Number(a.top_p);
      return {
        id: idx,
        label: `T=${t.toFixed(2)} P=${p.toFixed(2)}`,
        temperature: t.toFixed(2),
        topP: p.toFixed(2),
        response: '',
        // prefer normalized values when available for consistent 0-100 scale
        ttr: Number(m.norm_lexical_diversity ?? m.lexical_diversity ?? 0),
        coverage: Number(m.norm_query_coverage ?? m.query_coverage ?? 0),
        fkGrade: Number(m.norm_fk_grade ?? m.fk_grade ?? 0),
        nonRepetition: Number(m.norm_repetition_penalty ?? 0),
        wordCount: 0,
      };
    });
  }, [analytics]);

  function metricPick(d, key) {
    switch (key) {
      case 'ttr': return d.ttr;
      case 'coverage': return d.coverage;
      case 'fkGrade': return d.fkGrade;
      case 'nonRepetition': return d.nonRepetition;
      default: return d.ttr;
    }
  }

  // Aggregate by Temperature (average across all top_p) and by Top-P (average across all temperature)
  const aggByTemperature = useMemo(() => {
    const map = new Map();
    for (const a of analytics || []) {
      const t = Number(a.temperature);
      const m = a.metrics || {};
      const entry = map.get(t) || { count: 0, sum: { ttr: 0, coverage: 0, fkGrade: 0, nonRepetition: 0 } };
      entry.count += 1;
      entry.sum.ttr += Number(m.norm_lexical_diversity ?? m.lexical_diversity ?? 0);
      entry.sum.coverage += Number(m.norm_query_coverage ?? m.query_coverage ?? 0);
      entry.sum.fkGrade += Number(m.norm_fk_grade ?? m.fk_grade ?? 0);
      entry.sum.nonRepetition += Number(m.norm_repetition_penalty ?? 0);
      map.set(t, entry);
    }
    return Array.from(map.entries())
      .sort((a,b)=>a[0]-b[0])
      .map(([t, e]) => ({
        x: Number(t.toFixed(2)),
        ttr: e.sum.ttr / e.count,
        coverage: e.sum.coverage / e.count,
        fkGrade: e.sum.fkGrade / e.count,
        nonRepetition: e.sum.nonRepetition / e.count,
      }));
  }, [analytics]);

  const aggByTopP = useMemo(() => {
    const map = new Map();
    for (const a of analytics || []) {
      const p = Number(a.top_p);
      const m = a.metrics || {};
      const entry = map.get(p) || { count: 0, sum: { ttr: 0, coverage: 0, fkGrade: 0, nonRepetition: 0 } };
      entry.count += 1;
      entry.sum.ttr += Number(m.norm_lexical_diversity ?? m.lexical_diversity ?? 0);
      entry.sum.coverage += Number(m.norm_query_coverage ?? m.query_coverage ?? 0);
      entry.sum.fkGrade += Number(m.norm_fk_grade ?? m.fk_grade ?? 0);
      entry.sum.nonRepetition += Number(m.norm_repetition_penalty ?? 0);
      map.set(p, entry);
    }
    return Array.from(map.entries())
      .sort((a,b)=>a[0]-b[0])
      .map(([p, e]) => ({
        x: Number(p.toFixed(2)),
        ttr: e.sum.ttr / e.count,
        coverage: e.sum.coverage / e.count,
        fkGrade: e.sum.fkGrade / e.count,
        nonRepetition: e.sum.nonRepetition / e.count,
      }));
  }, [analytics]);

  return (
    <section className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
        <ChartTitle icon={BarChart3} title="Analytics Overview" />
        <p className="text-sm text-gray-500 dark:text-gray-300">Aggregated averages by Temperature and Top‑P. Explore trends with the charts below.</p>
        {resultsLike.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">By Temperature: TTR (norm) & Coverage (norm)</h4>
              <MultiLineChart
                data={aggByTemperature.map(d => ({ x: d.x, ttr: d.ttr, coverage: d.coverage }))}
                series={[
                  { key: 'ttr', label: 'TTR', color: '#2563eb' },
                  { key: 'coverage', label: 'Coverage', color: '#10b981' },
                ]}
                width={520}
                height={240}
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">By Temperature: FK Grade (norm) & Non‑Repetition (norm)</h4>
              <MultiLineChart
                data={aggByTemperature.map(d => ({ x: d.x, fk: d.fkGrade, nr: d.nonRepetition }))}
                series={[
                  { key: 'fk', label: 'FK Grade', color: '#f59e0b' },
                  { key: 'nr', label: 'Non‑Repetition', color: '#ef4444' },
                ]}
                width={520}
                height={240}
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">By Top‑P: TTR (norm) & Coverage (norm)</h4>
              <MultiLineChart
                data={aggByTopP.map(d => ({ x: d.x, ttr: d.ttr, coverage: d.coverage }))}
                series={[
                  { key: 'ttr', label: 'TTR', color: '#2563eb' },
                  { key: 'coverage', label: 'Coverage', color: '#10b981' },
                ]}
                width={520}
                height={240}
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">By Top‑P: FK Grade (norm) & Non‑Repetition (norm)</h4>
              <MultiLineChart
                data={aggByTopP.map(d => ({ x: d.x, fk: d.fkGrade, nr: d.nonRepetition }))}
                series={[
                  { key: 'fk', label: 'FK Grade', color: '#f59e0b' },
                  { key: 'nr', label: 'Non‑Repetition', color: '#ef4444' },
                ]}
                width={520}
                height={240}
              />
            </div>
          </div>
        )}
      </div>
      {resultsLike.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Lexical Diversity (TTR)</h4>
            <Heatmap results={resultsLike} selectedMetric="ttr" />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Query Coverage</h4>
            <Heatmap results={resultsLike} selectedMetric="coverage" />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Readability (FK Grade)</h4>
            <Heatmap results={resultsLike} selectedMetric="fkGrade" />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Non‑Repetition</h4>
            <Heatmap results={resultsLike} selectedMetric="nonRepetition" />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-xl text-gray-600">
          Enter a prompt and click "Show Analytics" to compute averages for your chosen parameter sets.
        </div>
      )}

      {/* Charts moved into the Overview card above; removed duplicates here */}
    </section>
  );
}
