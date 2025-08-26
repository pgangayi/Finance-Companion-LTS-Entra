import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = ({ type, data, title }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar options={chartOptions} data={data} />;
      case 'line':
        return <Line options={chartOptions} data={data} />;
      case 'pie':
        return <Pie options={chartOptions} data={data} />;
      default:
        return <Bar options={chartOptions} data={data} />;
    }
  };

  return (
    <div className="chart-container bg-white p-4 rounded-lg shadow">
      {renderChart()}
    </div>
  );
};

export default ChartContainer;