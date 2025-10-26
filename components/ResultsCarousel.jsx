"use client";

import React, { useEffect, useRef, useState } from 'react';
import ResultCard from './ResultCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ResultsCarousel({ results }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % Math.max(results.length, 1));
    }, 3500);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [results.length, paused]);

  const prev = () => setIndex(i => (i - 1 + results.length) % results.length);
  const next = () => setIndex(i => (i + 1) % results.length);

  if (!results || results.length === 0) return null;
  const current = results[index];

  return (
    <div
      id="results"
      className="relative w-full max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      tabIndex={0}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-2xl">
        <div className="transition-transform duration-500 will-change-transform">
          <ResultCard
            key={current.id}
            title={`${current.label} (T=${current.temperature}, P=${current.topP})`}
            text={current.response}
            metrics={{
              ttr: current.ttr,
              coverage: current.coverage,
              fkGrade: current.fkGrade,
              nonRepetition: current.nonRepetition,
            }}
          />
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button onClick={prev} className="m-2 text-gray-700 hover:text-gray-900 transition" aria-label="Previous">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button onClick={next} className="m-2 text-gray-700 hover:text-gray-900 transition" aria-label="Next">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="flex justify-center mt-3 space-x-1">
        {results.map((_, i) => (
          <span key={i} className={`h-2 w-2 rounded-full ${i===index? 'bg-indigo-600':'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
}
