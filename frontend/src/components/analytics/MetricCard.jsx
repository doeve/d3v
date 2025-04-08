import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const MetricCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-2 flex items-center">
          {trend === 'up' ? (
            <span className="text-green-500 flex items-center text-sm">
              <FaArrowUp className="mr-1" /> {trendValue}
            </span>
          ) : (
            <span className="text-red-500 flex items-center text-sm">
              <FaArrowDown className="mr-1" /> {trendValue}
            </span>
          )}
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">from previous period</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;