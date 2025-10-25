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
        <MetricCard title="TTR" value={Number(metrics?.ttr ?? 0).toFixed(1)} unit="%" />
        <MetricCard title="Coverage" value={Number(metrics?.coverage ?? 0).toFixed(1)} unit="%" />
        <MetricCard title="Sentences" value={Number(metrics?.sentenceCount ?? metrics?.sentence_count ?? 0)} />
        <MetricCard title="Avg WL" value={Number(metrics?.avgWordLength ?? metrics?.avg_word_length ?? 0).toFixed(2)} />
      </div>
    </div>
  );
}
