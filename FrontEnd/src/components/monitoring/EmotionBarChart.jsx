// src/components/monitoring/EmotionBarChart.jsx
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DEFAULT_LABELS = [
  "Vui vẻ",
  "Buồn",
  "Giận dữ",
  "Ngạc nhiên",
  "Bình thường",
  "Ghê tởm",
  "Sợ hãi",
];

const EMOTION_COLORS = {
  "Vui vẻ": "rgba(40, 167, 69, 0.7)",
  Buồn: "rgba(0, 123, 255, 0.7)",
  "Giận dữ": "rgba(220, 53, 69, 0.7)",
  "Ngạc nhiên": "rgba(255, 193, 7, 0.7)",
  "Bình thường": "rgba(108, 117, 125, 0.7)",
  "Ghê tởm": "rgba(232, 62, 140, 0.7)",
  "Sợ hãi": "rgba(253, 126, 20, 0.7)",
  Happy: "rgba(40, 167, 69, 0.7)",
  Sad: "rgba(0, 123, 255, 0.7)",
  Angry: "rgba(220, 53, 69, 0.7)",
  Surprise: "rgba(255, 193, 7, 0.7)",
  Neutral: "rgba(108, 117, 125, 0.7)",
  Disgust: "rgba(232, 62, 140, 0.7)",
  Fear: "rgba(253, 126, 20, 0.7)",
};

export default function EmotionBarChart({ data = [], emotionCounts = {} }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");

    // Handle both array and object formats
    let labels, datasetData, colors;

    if (typeof emotionCounts === "object" && !Array.isArray(emotionCounts)) {
      // New format: emotionCounts object
      labels = Object.keys(emotionCounts);
      datasetData = Object.values(emotionCounts);
      colors = labels.map(
        (emotion) => EMOTION_COLORS[emotion] || "rgba(13, 110, 253, 0.7)"
      );
    } else if (Array.isArray(data) && data.length > 0) {
      // Legacy format: array
      labels = DEFAULT_LABELS;
      datasetData =
        data && data.length === labels.length
          ? data
          : labels.map((_, idx) => data[idx] ?? 0);
      colors = labels.map(
        (emotion) => EMOTION_COLORS[emotion] || "rgba(13, 110, 253, 0.7)"
      );
    } else {
      // Empty state
      labels = DEFAULT_LABELS;
      datasetData = labels.map(() => 0);
      colors = labels.map(
        (emotion) => EMOTION_COLORS[emotion] || "rgba(13, 110, 253, 0.7)"
      );
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Số Lần Cảm Xúc",
            data: datasetData,
            backgroundColor: colors,
            borderColor: colors.map((c) => c.replace("0.7", "1")),
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, emotionCounts]);

  return <canvas ref={canvasRef} style={{ maxHeight: "250px" }} />;
}
