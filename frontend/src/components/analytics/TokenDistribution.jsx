import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TokenDistribution = ({ data }) => {
  // Only show top 5 tokens, combine the rest into "Others"
  const topTokens = data.slice(0, 5);
  
  const othersValue = data.slice(5).reduce((sum, token) => sum + token.value, 0);
  const hasOthers = othersValue > 0;
  
  // Generate chart data
  const chartData = {
    labels: [...topTokens.map(token => token.symbol || token.name), hasOthers ? 'Others' : null].filter(Boolean),
    datasets: [
      {
        data: [...topTokens.map(token => token.value), hasOthers ? othersValue : null].filter(Boolean),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue-500
          'rgba(16, 185, 129, 0.8)', // green-500
          'rgba(139, 92, 246, 0.8)', // purple-500
          'rgba(245, 158, 11, 0.8)', // amber-500
          'rgba(239, 68, 68, 0.8)',  // red-500
          'rgba(107, 114, 128, 0.8)', // gray-500
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = context.dataset.data.reduce((sum, val) => sum + val, 0) > 0
              ? (value / context.dataset.data.reduce((sum, val) => sum + val, 0) * 100).toFixed(1)
              : 0;
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };
  
  return <Pie data={chartData} options={options} />;
};

export default TokenDistribution;