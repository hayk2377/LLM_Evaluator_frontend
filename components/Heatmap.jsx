"use client";

import React, { useMemo } from 'react';
import { valueToColorFiveStop } from '../lib/utils';
import ChartTitle from './ChartTitle';
import { TrendingUp } from 'lucide-react';

// Scatter-style heatmap with 0.1 increments on both axes, circles sized by duplicate count.
export default function Heatmap({ results, selectedMetric }) {
  const model = useMemo(() => buildModel(results, selectedMetric), [results, selectedMetric]);

  const cellSize = 26; // distance between points
  const padLeft = 28, padTop = 18, padBottom = 26, padRight = 12;
  const width = padLeft + padRight + cellSize * model.tArr.length;
  const height = padTop + padBottom + cellSize * model.pArr.length;

  const xFor = (ti) => padLeft + ti * cellSize + cellSize / 2;
  const yFor = (pi) => padTop + (model.pArr.length - 1 - pi) * cellSize + cellSize / 2; // invert y so higher P is up

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
      <ChartTitle icon={TrendingUp} title={`Heatmap: ${readableName(selectedMetric)}`} />
      <div className="overflow-auto">
        <svg width={width} height={height} role="img" aria-label="heatmap">
          {/* Axis labels */}
          <text x={padLeft} y={12} fontSize="10" fill="currentColor" className="text-gray-600 dark:text-gray-300">Top‑P ↑</text>
          <text x={padLeft + cellSize * (model.tArr.length / 2)} y={height - 4} fontSize="10" textAnchor="middle" fill="currentColor" className="text-gray-600 dark:text-gray-300">Temperature →</text>

          {/* X ticks */}
          {model.tArr.map((t, ti) => (
            <text key={`tx-${ti}`} x={xFor(ti)} y={height - 10} fontSize="9" textAnchor="middle" fill="currentColor" className="text-gray-500 dark:text-gray-400">{t.toFixed(1)}</text>
          ))}
          {/* Y ticks */}
          {model.pArr.map((p, pi) => (
            <text key={`py-${pi}`} x={padLeft - 8} y={yFor(pi) + 3} fontSize="9" textAnchor="end" fill="currentColor" className="text-gray-500 dark:text-gray-400">{p.toFixed(1)}</text>
          ))}

          {/* Points as circles, no grid lines */}
          {model.points.map((pt, idx) => (
            <circle
              key={idx}
              cx={xFor(pt.ti)}
              cy={yFor(pt.pi)}
              r={radiusFor(pt.count, model.maxCount)}
              fill={pt.value==null? '#e5e7eb' : valueToColorFiveStop(pt.value, model.min, model.max)}
            >
              <title>{`T=${pt.t.toFixed(1)}, P=${pt.p.toFixed(1)}\n${readableName(selectedMetric)}: ${fmt(pt.value)}\nCount: ${pt.count}`}</title>
            </circle>
          ))}
        </svg>

        {/* Legend */}
  <div className="flex items-center mt-3 text-xs text-gray-600 dark:text-gray-300">
          <span className="mr-2">Low</span>
          <div className="h-2 w-48 rounded" style={{ background: 'linear-gradient(90deg, #7f1d1d 0%, #ef4444 25%, #22c55e 50%, #3b82f6 75%, #1e3a8a 100%)' }} />
          <span className="ml-2">High</span>
          <span className="ml-4">• size ∝ count</span>
        </div>
      </div>
    </div>
  );
}

function buildModel(results, selectedMetric){
  const tArr = Array.from({ length: 11 }, (_, i) => Number((i * 0.1).toFixed(1)));
  const pArr = Array.from({ length: 11 }, (_, i) => Number((i * 0.1).toFixed(1)));
  const keyFor = (t, p) => `${t.toFixed(1)}|${p.toFixed(1)}`;

  // Aggregate values and counts per (t,p) bin rounded to 0.1
  const bin = new Map();
  for (const r of results || []) {
    const t = Number(r.temperature);
    const p = Number(r.topP);
    const rt = Number((Math.round(t * 10) / 10).toFixed(1));
    const rp = Number((Math.round(p * 10) / 10).toFixed(1));
    if (rt < 0 || rt > 1 || rp < 0 || rp > 1) continue;
    const val = metricValue(r, selectedMetric);
    const key = keyFor(rt, rp);
    const curr = bin.get(key) || { sum: 0, count: 0, t: rt, p: rp };
    if (isFinite(val)) { curr.sum += val; curr.count += 1; }
    bin.set(key, curr);
  }

  // Build points array aligned to axes
  let min = Infinity, max = -Infinity, maxCount = 0;
  const points = [];
  pArr.forEach((p, pi) => {
    tArr.forEach((t, ti) => {
      const b = bin.get(keyFor(t, p));
      const value = b && b.count > 0 ? (b.sum / b.count) : null;
      const count = b ? b.count : 0;
      if (value != null) { min = Math.min(min, value); max = Math.max(max, value); }
      maxCount = Math.max(maxCount, count);
      points.push({ t, p, ti, pi, value, count });
    });
  });
  if (!isFinite(min)) { min = 0; max = 1; }
  return { tArr, pArr, points, min, max, maxCount };
}

function metricValue(r, key) {
  switch (key) {
    case 'ttr': return Number(r.ttr);
    case 'coverage': return Number(r.coverage);
    case 'fkGrade': return Number(r.fkGrade);
    case 'nonRepetition': return Number(r.nonRepetition);
    default: return 0;
  }
}

function readableName(key) {
  switch (key) {
    case 'ttr': return 'Lexical Diversity (TTR)';
    case 'coverage': return 'Query Coverage';
    case 'fkGrade': return 'Readability (FK Grade, norm)';
    case 'nonRepetition': return 'Non‑Repetition (norm)';
    default: return key;
  }
}

function fmt(v){ return v==null ? 'n/a' : Number(v).toFixed(2); }

function radiusFor(count, maxCount){
  if (!count) return 5;
  const c = Math.max(1, count);
  const mc = Math.max(1, maxCount);
  const t = Math.sqrt(c / mc); // area-proportional
  return 5 + t * 6; // base 5px plus up to +6px
}
