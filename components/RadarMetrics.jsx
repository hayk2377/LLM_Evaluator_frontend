"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import ChartTitle from './ChartTitle';
import { Target } from 'lucide-react';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const RadarChart = dynamic(() => import('recharts').then(m => m.RadarChart), { ssr: false });
const PolarGrid = dynamic(() => import('recharts').then(m => m.PolarGrid), { ssr: false });
const PolarAngleAxis = dynamic(() => import('recharts').then(m => m.PolarAngleAxis), { ssr: false });
const PolarRadiusAxis = dynamic(() => import('recharts').then(m => m.PolarRadiusAxis), { ssr: false });
const Radar = dynamic(() => import('recharts').then(m => m.Radar), { ssr: false });
const Legend = dynamic(() => import('recharts').then(m => m.Legend), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });

function transposeForRadar(results) {
  if (!results || results.length === 0) return [];

  const chartData = results.map(r => ({
    name: r.label,
    TTR: Number(r.ttr),
    Coverage: Number(r.coverage),
    Sentences: Number(r.sentenceCount),
    AvgWL: Number(r.avgWordLength) * 10,
  }));

  const aggregated = {
    ttrMax: Math.max(...chartData.map(d => d.TTR), 1),
    coverageMax: Math.max(...chartData.map(d => d.Coverage), 1),
    sentencesMax: Math.max(...chartData.map(d => d.Sentences), 1),
    avgWLMax: Math.max(...chartData.map(d => d.AvgWL), 1),
  };

  const metrics = [
    { key: 'TTR', subject: 'Lexical Diversity', max: aggregated.ttrMax },
    { key: 'Coverage', subject: 'Query Coverage', max: aggregated.coverageMax },
    { key: 'Sentences', subject: 'Structural Depth', max: aggregated.sentencesMax },
    { key: 'AvgWL', subject: 'Complexity Proxy', max: aggregated.avgWLMax },
  ];

  return metrics.map(metric => {
    const dataPoint = { subject: metric.subject, fullMark: 100 };
    chartData.forEach(sample => {
      const normalizedValue = (sample[metric.key] / metric.max) * 100;
      dataPoint[sample.name] = normalizedValue;
    });
    return dataPoint;
  });
}

export default function RadarMetrics({ results }) {
  const data = transposeForRadar(results);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <ChartTitle icon={Target} title="Comparative Metrics Profile (Normalized)" />
      <p className='text-sm text-gray-500 mb-4'>The radar chart shows the normalized distribution of all four metrics across the samples. A larger polygon indicates relatively higher overall values.</p>
      <div className='chart-container'>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={90} data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" stroke="#4b5563" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#e5e7eb" />
            {results.map((r, index) => (
              <Radar key={r.id} name={r.label} dataKey={r.label} stroke={`hsl(${index * 40 + 20}, 70%, 50%)`} fill={`hsl(${index * 40 + 20}, 70%, 50%)`} fillOpacity={0.4} dot />
            ))}
            <Legend wrapperStyle={{ position: 'relative', marginTop: '10px' }} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(0)}%`]} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
