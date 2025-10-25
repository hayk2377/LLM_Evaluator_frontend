"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import ChartTitle from './ChartTitle';
import { BarChart3 } from 'lucide-react';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(m => m.Legend), { ssr: false });

export default function WordCountBar({ results }) {
  const data = (results || []).map(r => ({ name: r.label, WordCount: Number(r.wordCount) }));
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <ChartTitle icon={BarChart3} title="Word Count Comparison (Volume)" />
      <p className='text-sm text-gray-500 mb-4'>Raw word count showing how parameters affect verbosity.</p>
      <div className='chart-container'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#4b5563" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="WordCount" name="Word Count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
