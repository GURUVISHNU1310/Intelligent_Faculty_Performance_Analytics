import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

export function showTeachingChart(labels, teachingScores) {
  return {
    labels,
    datasets: [
      {
        label: 'Teaching Score',
        data: teachingScores,
        backgroundColor: 'rgba(56, 189, 248, 0.7)',
        borderColor: 'rgb(56, 189, 248)',
        borderWidth: 1,
      },
    ],
  };
}

export default function PerformanceChart({ data }) {
  if (!data || !data.labels?.length) return <p style={{ color: 'var(--text-muted)' }}>No data to display</p>;
  return (
    <div style={{ height: '280px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
