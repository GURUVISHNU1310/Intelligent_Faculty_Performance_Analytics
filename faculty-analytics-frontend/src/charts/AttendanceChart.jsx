import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
  },
};

export function showAttendanceChart(labels, attendanceValues) {
  return {
    labels,
    datasets: [
      {
        data: attendanceValues,
        backgroundColor: ['#38bdf8', '#22c55e', '#eab308', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };
}

export default function AttendanceChart({ data }) {
  if (!data || !data.labels?.length) return <p style={{ color: 'var(--text-muted)' }}>No data to display</p>;
  return (
    <div style={{ height: '260px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
