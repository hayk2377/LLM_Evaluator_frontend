"use client";

import React, { useMemo } from 'react';

// props:
// - data: array of { x: number|string, [k1]: number, [k2]: number }
// - series: [ { key: 'a', label: 'TTR', color: '#...' }, { key: 'b', label: 'Coverage', color: '#...' } ]
// - width, height
export default function MultiLineChart({ data = [], series = [], width = 420, height = 220 }) {
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerW = Math.max(10, width - padding.left - padding.right);
  const innerH = Math.max(10, height - padding.top - padding.bottom);

  const { xTicks, yMin, yMax, lines } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(series) || series.length === 0) {
      return { xTicks: [], yMin: 0, yMax: 1, lines: [] };
    }
    // Determine y-domain across all series
    let minV = Infinity, maxV = -Infinity;
    for (const row of data) {
      for (const s of series) {
        const v = Number(row[s.key]);
        if (isFinite(v)) { minV = Math.min(minV, v); maxV = Math.max(maxV, v); }
      }
    }
    if (!isFinite(minV) || !isFinite(maxV)) { minV = 0; maxV = 1; }
    if (minV === maxV) { maxV = minV + 1; }

    const xs = data.map(d => d.x);
    const linesCalc = series.map((s) => {
      const pts = data.map((d, i) => ({ i, v: Number(d[s.key]) }));
      return { key: s.key, color: s.color, pts };
    });
    return { xTicks: xs, yMin: minV, yMax: maxV, lines: linesCalc };
  }, [data, series]);

  const xToPx = (i) => {
    const n = Math.max(data.length - 1, 1);
    return padding.left + (innerW * (i / n));
  };
  const yToPx = (v) => {
    const t = (v - yMin) / (yMax - yMin || 1);
    return padding.top + innerH * (1 - t);
  };

  const makePath = (pts) => {
    if (!pts || pts.length === 0) return '';
    const move = `M ${xToPx(pts[0].i).toFixed(2)} ${yToPx(pts[0].v).toFixed(2)}`;
    const segments = pts.slice(1).map(p => `L ${xToPx(p.i).toFixed(2)} ${yToPx(p.v).toFixed(2)}`);
    return [move, ...segments].join(' ');
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} role="img">
        {/* Axes */}
  <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} className="stroke-gray-200 dark:stroke-gray-700" />
  <line x1={padding.left} y1={padding.top + innerH} x2={padding.left + innerW} y2={padding.top + innerH} className="stroke-gray-200 dark:stroke-gray-700" />

        {/* Y tick labels (min/mid/max) */}
        {[yMin, (yMin + yMax) / 2, yMax].map((v, idx) => (
          <g key={idx}>
            <line x1={padding.left - 4} y1={yToPx(v)} x2={padding.left} y2={yToPx(v)} className="stroke-gray-200 dark:stroke-gray-700" />
            <text x={4} y={yToPx(v) + 4} fontSize="10" fill="currentColor" className="text-gray-600 dark:text-gray-300">{Number(v).toFixed(1)}</text>
          </g>
        ))}

        {/* X tick labels (first, middle, last) if many */}
        {xTicks.length > 0 && (
          <>
            <text x={padding.left} y={padding.top + innerH + 18} fontSize="10" fill="currentColor" className="text-gray-600 dark:text-gray-300">{String(xTicks[0])}</text>
            <text x={padding.left + innerW / 2} y={padding.top + innerH + 18} fontSize="10" textAnchor="middle" fill="currentColor" className="text-gray-600 dark:text-gray-300">{String(xTicks[Math.floor((xTicks.length - 1)/2)])}</text>
            <text x={padding.left + innerW} y={padding.top + innerH + 18} fontSize="10" textAnchor="end" fill="currentColor" className="text-gray-600 dark:text-gray-300">{String(xTicks[xTicks.length - 1])}</text>
          </>
        )}

        {/* Lines */}
        {lines.map((ln) => (
          <path key={ln.key} d={makePath(ln.pts)} fill="none" stroke={ln.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-sm text-gray-700 dark:text-gray-200">
        {series.map(s => (
          <div key={s.key} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: s.color }} />
            <span className="text-current">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
