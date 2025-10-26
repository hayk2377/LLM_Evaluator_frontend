import React from 'react';

const MetricCard = ({ title, value, unit = '', color = 'text-indigo-500', precision }) => {
  const num = Number(value);
  const isNum = Number.isFinite(num);
  const display = isNum ? (typeof precision === 'number' ? num.toFixed(precision) : num) : 'n/a';
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-gray-100 min-w-[70px]">
      <div className={`text-xl font-bold text-gray-900 leading-none ${color}`}>{display}{isNum ? unit : ''}</div>
      <div className="text-xs font-medium text-gray-500 text-center mt-1">{title}</div>
    </div>
  );
};

export default MetricCard;
