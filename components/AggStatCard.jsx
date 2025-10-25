"use client";

import React, { useMemo } from 'react';
import Sparkline from './Sparkline';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AggStatCard({ title, seriesLabel, points = [], color = '#2563eb', valueFormatter = (v)=>v.toFixed(2) }) {
  // points: [{ x: number|string, y: number }]
  const { values, first, last, min, max, trend } = useMemo(() => {
    const vals = points.map(p => Number(p.y) || 0);
    const f = vals[0] ?? 0;
    const l = vals[vals.length - 1] ?? 0;
    const mn = vals.length ? Math.min(...vals) : 0;
    const mx = vals.length ? Math.max(...vals) : 0;
    const tr = (f === 0) ? 0 : ((l - f) / Math.abs(f)) * 100;
    return { values: vals, first: f, last: l, min: mn, max: mx, trend: tr };
  }, [points]);

  const TrendIcon = trend >= 0 ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend >= 0 ? 'text-green-600' : 'text-rose-600';
  const trendText = `${trend >= 0 ? '' : ''}${isFinite(trend) ? Math.abs(trend).toFixed(1) : '0.0'}%`;

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
      <div className="flex justify-between mb-5">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 pb-2">{valueFormatter(max)}
          </h5>
          <p className="text-base font-normal text-gray-500">Peak across {seriesLabel}</p>
        </div>
        <div className={`flex items-center px-2.5 py-0.5 text-base font-semibold ${trendColor}`}>
          {trendText}
          <TrendIcon className="w-4 h-4 ms-1" />
        </div>
      </div>
      <div className="[&>div]:mx-auto">
        <Sparkline values={values} width={320} height={72} stroke={color} />
      </div>
      <div className="grid grid-cols-1 items-center border-gray-200 border-t justify-between mt-5">
        <div className="flex justify-between items-center pt-5 text-sm text-gray-600">
          <div>Range: <span className="font-medium text-gray-800">{valueFormatter(min)}</span> – <span className="font-medium text-gray-800">{valueFormatter(max)}</span></div>
          <div>Last: <span className="font-medium text-gray-800">{valueFormatter(last)}</span></div>
        </div>
      </div>
    </div>
  );
}
