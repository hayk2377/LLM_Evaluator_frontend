import React from 'react';

const ChartTitle = ({ icon: Icon, title }) => (
  <h2 className="flex items-center text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
    {Icon ? <Icon className="w-5 h-5 mr-2 text-indigo-500" /> : null}
    {title}
  </h2>
);

export default ChartTitle;
