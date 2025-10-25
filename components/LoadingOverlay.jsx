"use client";

import React from 'react';

export default function LoadingOverlay({ show, label = 'Processing…' }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="animate-fade-in-up bg-white shadow-xl rounded-2xl p-6 border border-gray-100 text-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <div className="text-gray-800 font-semibold">{label}</div>
        <div className="text-gray-500 text-sm mt-1">This may take a moment while your backend completes the run.</div>
      </div>
    </div>
  );
}
