import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
  },
  scales: {
    y: { beginAtZero: true, max: 100 },
  },
};

export function showOverallPerformanceChart(labels, totalScores) {
  return {
    labels,
    datasets: [
      {
        label: 'Overall Score',
        data: totalScores,
        borderColor: 'rgb(56, 189, 248)',
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
}

export default function OverallPerformanceChart({ data }) {
  if (!data || !data.labels?.length) return <p style={{ color: 'var(--text-muted)' }}>No data to display</p>;
  return (
    <div style={{ height: '280px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
