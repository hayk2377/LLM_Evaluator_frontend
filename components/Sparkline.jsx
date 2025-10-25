"use client";

import React, { useMemo } from 'react';

export default function Sparkline({ values = [], width = 280, height = 64, stroke = '#2563eb', strokeWidth = 2 }) {
  const { path } = useMemo(() => {
    if (!values || values.length === 0) return { path: '' };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const stepX = width / Math.max(values.length - 1, 1);
    const points = values.map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    const d = `M ${points[0]} L ${points.slice(1).join(' ')}`;
    return { path: d };
  }, [values, width, height]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="sparkline">
      <path d={path} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
