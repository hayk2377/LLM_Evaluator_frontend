import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, BookOpen, RefreshCcw } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

const metricDescriptions = [
  { icon: TrendingUp, title: "Lexical Diversity (TTR)", explanation: "Vocabulary richness (unique words / total words). Higher values suggest less repetition and more nuanced language." },
  { icon: CheckCircle, title: "Query Coverage", explanation: "Percent of prompt keywords present in the response. Proxy for completeness and on‑topic relevance." },
  { icon: BookOpen, title: "Readability Grade (FKGL)", explanation: "Estimated U.S. school grade level (Flesch–Kincaid). Lower is easier; normalized view shows relative complexity (higher = more complex)." },
  { icon: RefreshCcw, title: "Non‑Repetition", explanation: "Fluency via absence of repeated trigrams (inverse repetition). Higher means cleaner, less loopy text." },
];

export default function MetricsIntro() {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-red-100/50 dark:border-gray-700">
  <h2 className="flex items-center text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        <BarChart3 className="w-6 h-6 mr-2 text-red-500" />
        Objective Quality Metrics
      </h2>
  <p className='text-gray-600 dark:text-gray-300 mb-6'>We analyze diversity, coverage, readability (FKGL), and non‑repetition to quantify how Temperature and Top‑P affect outputs.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {metricDescriptions.map((m, idx) => {
          const anims = ['animate-slide-in-left','animate-slide-in-right','animate-zoom-in','animate-fade-in-up-slow'];
          const animationClass = anims[idx % anims.length];
          return (
          <RevealOnScroll key={m.title} delayClass={`animation-delay-${idx}`} animationClass={animationClass}> 
            <div className="p-4 bg-red-50 dark:bg-gray-700/50 rounded-xl border border-red-200 dark:border-gray-600 hover:shadow-lg transition-shadow">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                <m.icon className="w-5 h-5 mr-2 text-red-500" />
                {m.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{m.explanation}</p>
            </div>
          </RevealOnScroll>
        );})}
      </div>
    </section>
  );
}
