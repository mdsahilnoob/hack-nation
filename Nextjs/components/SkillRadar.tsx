"use client";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

type SkillRadarProps = {
  data: {
    category: string;
    score: number;
  }[];
};

export default function SkillRadar({ data }: SkillRadarProps) {
  const labels = data.map((d) => d.category);
  const scores = data.map((d) => Math.round(d.score * 100));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Skill Strength (%)",
        data: scores,
        backgroundColor: "rgba(99, 102, 241, 0.3)",
        borderColor: "rgba(99, 102, 241, 1)",
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          backdropColor: "transparent",
          color: "#6b7280",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
        angleLines: {
          color: "rgba(156, 163, 175, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow w-full max-w-xl mx-auto">
      <h2 className="text-lg font-semibold text-center mb-4">Skill Distribution</h2>
      <Radar data={chartData} options={options} />
    </div>
  );
}
