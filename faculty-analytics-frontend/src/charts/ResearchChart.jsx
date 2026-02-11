import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { position: 'top' },
  },
  scales: {
    x: { beginAtZero: true, max: 100 },
  },
};

export function showResearchChart(labels, researchValues) {
  return {
    labels,
    datasets: [
      {
        label: 'Research Score',
        data: researchValues,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };
}

export default function ResearchChart({ data }) {
  if (!data || !data.labels?.length) return <p style={{ color: 'var(--text-muted)' }}>No data to display</p>;
  return (
    <div style={{ height: '280px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
