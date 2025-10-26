"use client";

import React from 'react';
import MetricCard from './MetricCard';
import ChartTitle from './ChartTitle';
import { BookOpen } from 'lucide-react';

export default function ResultsTable({ results }) {
  if (!results || results.length === 0) return null;
  return (
    <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow-xl">
      <ChartTitle icon={BookOpen} title="Response Samples and Detailed Metrics" />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[120px]">Sample</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Response Text</th>
            <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[70px]">TTR (%)</th>
            <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[70px]">Coverage (%)</th>
            <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[70px]">FK Grade</th>
            <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[90px]">Non‑Repetition</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((r) => (
            <tr key={r.id} className="hover:bg-indigo-50/50 transition duration-150">
              <td className="px-3 py-4 whitespace-nowrap align-top">
                <div className="text-sm font-semibold text-gray-900">{r.label}</div>
                <div className="text-xs text-gray-600 font-mono mt-1">T: {r.temperature} | P: {r.topP}</div>
                <div className="text-xs text-gray-500 mt-1">Words: {r.wordCount}</div>
              </td>
              <td className="px-6 py-4 max-w-lg text-sm text-gray-800 align-top">
                <div className="max-h-40 overflow-y-auto pr-2">{r.response}</div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium"><MetricCard title="TTR" value={r.ttr} unit="%" color="text-red-500" precision={1} /></td>
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium"><MetricCard title="Coverage" value={r.coverage} unit="%" color="text-green-600" precision={1} /></td>
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium"><MetricCard title="FK Grade" value={r.fkGrade} color="text-yellow-600" precision={1} /></td>
              <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium"><MetricCard title="Non‑Repetition" value={r.nonRepetition} color="text-blue-600" precision={1} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
