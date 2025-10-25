import React from 'react';
import Controls from '../components/Controls';
import MetricsIntro from '../components/MetricsIntro';
import RevealOnScroll from '../components/RevealOnScroll';
import ResultsView from '../components/ResultsView';
import { SlidersHorizontal } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export const dynamic = 'force-static'; // SSR page with dynamic charts disabled on server

export default function Page() {
  // Client parts live inside child components with 'use client'
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto mb-4 flex justify-end">
        <ThemeToggle />
      </div>
      <header className="text-center mb-10 animate-fade-in-up animation-delay-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center">
          <SlidersHorizontal className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 mr-3 transition-transform duration-300 will-change-transform hover:scale-105" />
          LLM Parameter Visualizer
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Analyze the objective quality impact of Temperature (Creativity) and Top-P (Focus) on LLM response characteristics.
        </p>
        <div className="mt-6">
          <a href="#controls" className="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition">
            Try it out
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        <RevealOnScroll delayClass="animation-delay-1"><MetricsIntro /></RevealOnScroll>
        <RevealOnScroll delayClass="animation-delay-2"><Controls /></RevealOnScroll>
        <RevealOnScroll delayClass="animation-delay-3"><ResultsView /></RevealOnScroll>
      </main>
    </div>
  );
}

