"use client";

import React from 'react';
import MetricCard from './MetricCard';

export default function ResultCard({ title, text, metrics }) {
  return (
    <div className="bg-sky-50 dark:bg-gray-800 rounded-2xl shadow-lg border border-sky-100 dark:border-gray-700 p-5 w-full flex flex-col">
      <div className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</div>
      <div className="overflow-auto rounded-lg border border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 leading-relaxed text-[15px] md:text-base min-h-[220px] max-h-[360px]">
        {text || <span className="text-gray-400">No output</span>}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <MetricCard title="TTR" value={metrics?.ttr} unit="%" precision={1} />
        <MetricCard title="Coverage" value={metrics?.coverage} unit="%" precision={1} />
        <MetricCard title="FK Grade" value={metrics?.fkGrade} precision={1} />
        <MetricCard title="Non‑Repetition" value={metrics?.nonRepetition} precision={1} />
      </div>
    </div>
  );
}
