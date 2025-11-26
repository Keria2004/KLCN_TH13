import { useEffect, useRef } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "../../styles/analytics/EmotionPie.css";

Chart.register(ArcElement, Tooltip, Legend);

export default function EmotionPie({ data }) {
  const canvasRef = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (chart.current) chart.current.destroy();

    const ctx = canvasRef.current.getContext("2d");

    chart.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: [
          "Happy",
          "Sad",
          "Angry",
          "Surprise",
          "Fear",
          "Neutral",
          "Disgust",
        ],
        datasets: [
          {
            data,
            backgroundColor: [
              "#4caf50",
              "#2196f3",
              "#f44336",
              "#ff9800",
              "#9c27b0",
              "#9e9e9e",
              "#795548",
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" },
        },
      },
    });

    return () => chart.current?.destroy();
  }, [data]);

  return (
    <div className="pie-box">
      <p className="pie-title">Emotion Distribution</p>
      <canvas ref={canvasRef} className="pie-canvas"></canvas>
    </div>
  );
}
