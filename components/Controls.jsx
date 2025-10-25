"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, Plus, X } from 'lucide-react';
import { 
  setComparisonMode, setBaseTemperature, setBaseTopP, setPrompt,
  addCustomSet, removeCustomSet,setView
} from '../store/slices/settingsSlice';
import { generateId } from '../lib/utils';
import { generateAndEvaluate } from '../store/slices/resultsSlice';

const ParameterInput = ({ label, value, min, max, step, onChange, disabled }) => (
  <div className={`flex flex-col space-y-2 p-4 rounded-xl transition duration-300 ${disabled ? 'bg-gray-200 dark:bg-gray-700 opacity-60' : 'bg-gray-100/50 dark:bg-gray-700/50'}`}>
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-between">
      <span>{label}</span>
      <span className="font-mono text-lg text-indigo-600">{Number(value).toFixed(2)}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-lg"
      style={{accentColor: disabled ? '#9ca3af' : '#4f46e5'}}
      disabled={disabled}
    />
  </div>
);

const CustomNumInput = ({ label, value, onChange, disabled }) => (
  <div className="flex flex-col w-1/2">
    <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-1">{label}</label>
    <input
      type="number"
      min="0.0"
      max="1.0"
      step="0.05"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2 border rounded-lg text-sm font-mono focus:ring-indigo-500 focus:border-indigo-500 ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-900'} border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100`}
      disabled={disabled}
    />
  </div>
);

export default function Controls() {
  const dispatch = useDispatch();
  const settings = useSelector(s => s.settings);
  const resultsLoading = useSelector(s => s.results.loading);

  const [newCustomTemp, setNewCustomTemp] = useState("0.5");
  const [newCustomTopP, setNewCustomTopP] = useState("0.8");

  const addSet = () => {
    let T = parseFloat(newCustomTemp) || 0.0;
    let P = parseFloat(newCustomTopP) || 0.0;
    T = Math.min(1.0, Math.max(0.0, T));
    P = Math.min(1.0, Math.max(0.0, P));
    dispatch(addCustomSet({ id: generateId(), T, P }));
    setNewCustomTemp(T.toFixed(2));
    setNewCustomTopP(P.toFixed(2));
  };

  return (
    <section id="controls" className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-indigo-100/50 dark:border-gray-700">
      <h2 className="flex items-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
        <SlidersHorizontal className="w-6 h-6 mr-2" />
        Generation Controls
      </h2>

      <div className='flex justify-center mb-8'>
        <button
          onClick={() => {
            dispatch(setComparisonMode(settings.comparisonMode === 'baseline' ? 'custom' : 'baseline'));
          }}
          className={`flex items-center px-6 py-3 rounded-full font-bold text-sm shadow-md transition duration-300 ease-in-out ${
            settings.comparisonMode === 'baseline'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {settings.comparisonMode === 'baseline' 
            ? 'Current Mode: Baseline Comparisons (T/P Deltas)' 
            : 'Current Mode: Custom Parameter Sets'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-4 rounded-xl transition duration-300 ${settings.comparisonMode === 'custom' ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">1. Define Baseline Parameters (Compares 5 fixed sets)</h3>
          <div className='space-y-4'>
            <ParameterInput label="Baseline Temperature (0.0 - 1.0)" value={settings.baseTemperature} min={0.0} max={1.0} step={0.05} onChange={(v)=>dispatch(setBaseTemperature(v))} disabled={settings.comparisonMode === 'custom'} />
            <ParameterInput label="Baseline Top-P (0.0 - 1.0)" value={settings.baseTopP} min={0.0} max={1.0} step={0.05} onChange={(v)=>dispatch(setBaseTopP(v))} disabled={settings.comparisonMode === 'custom'} />
          </div>
        </div>

        <div className={`p-4 rounded-xl transition duration-300 ${settings.comparisonMode === 'baseline' ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">2. Define Custom Parameter Sets</h3>
          <div className="flex space-x-2 mb-4 items-end">
            <CustomNumInput label="Temperature (T)" value={newCustomTemp} onChange={setNewCustomTemp} disabled={settings.comparisonMode === 'baseline'} />
            <CustomNumInput label="Top-P (P)" value={newCustomTopP} onChange={setNewCustomTopP} disabled={settings.comparisonMode === 'baseline'} />
            <button onClick={addSet} className="bg-indigo-500 text-white h-10 w-10 p-1 rounded-lg hover:bg-indigo-600 transition flex-shrink-0" title="Add Parameter Set" disabled={settings.comparisonMode === 'baseline' || (settings.comparisonMode === 'custom' && (!newCustomTemp.trim() || !newCustomTopP.trim()))}>
              <Plus className="w-5 h-5 mx-auto" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-gray-300 rounded-lg bg-white shadow-inner">
            {settings.customSets.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No custom sets added. Click '+' to add a set.</p>
            ) : (
              settings.customSets.map(set => (
                <div key={set.id} className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                  T={Number(set.T).toFixed(2)}, P={Number(set.P).toFixed(2)}
                  <button onClick={() => dispatch(removeCustomSet(set.id))} className="ml-2 text-indigo-500 hover:text-indigo-700 transition" title="Remove">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4 pt-4 border-t border-gray-200">
  <label className="block text-lg font-medium text-gray-700 dark:text-gray-100">Prompt for Analysis</label>
  <textarea value={settings.prompt} onChange={(e) => dispatch(setPrompt(e.target.value))} rows={4} className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 shadow-inner resize-none" placeholder="Enter your prompt here..." />

        {/* Removed heatmap metric controllers and filters for simplicity */}

        <button onClick={() => {dispatch(setView('results')); dispatch(generateAndEvaluate())}} disabled={resultsLoading || !settings.prompt.trim() || (settings.comparisonMode === 'custom' && settings.customSets.length === 0)} className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition duration-300 ease-in-out flex items-center justify-center ${resultsLoading ? 'bg-indigo-300 text-indigo-700 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}>
          {resultsLoading ? 'Generating Responses & Calculating Metrics...' : 'Generate & Analyze Comparison Sets'}
        </button>
      </div>
    </section>
  );
}
