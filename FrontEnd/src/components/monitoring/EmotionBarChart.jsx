// src/components/monitoring/EmotionBarChart.jsx
import { useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EMOTION_COLORS = {
  "Vui vẻ": "#28a745",
  Buồn: "#007bff",
  "Giận dữ": "#dc3545",
  "Ngạc nhiên": "#ffc107",
  "Bình thường": "#6c757d",
  "Ghê tởm": "#e83e8c",
  "Sợ hãi": "#fd7e14",
  Happy: "#28a745",
  Sad: "#007bff",
  Angry: "#dc3545",
  Surprise: "#ffc107",
  Neutral: "#6c757d",
  Disgust: "#e83e8c",
  Fear: "#fd7e14",
};

export default function EmotionBarChart({ data = [], emotionCounts = {} }) {
  // Handle both array and object formats
  let chartData = [];

  if (typeof emotionCounts === "object" && !Array.isArray(emotionCounts)) {
    // New format: emotionCounts object
    chartData = Object.entries(emotionCounts)
      .filter(([_, value]) => value > 0)
      .map(([emotion, value]) => ({
        name: emotion,
        value: value,
        color: EMOTION_COLORS[emotion] || "#0d6efd",
      }));
  } else if (Array.isArray(data) && data.length > 0) {
    // Legacy format: array
    const labels = [
      "Happy",
      "Sad",
      "Angry",
      "Surprise",
      "Neutral",
      "Disgust",
      "Fear",
    ];
    chartData = labels
      .filter((_, idx) => data[idx] > 0)
      .map((emotion, idx) => ({
        name: emotion,
        value: data[idx],
        color: EMOTION_COLORS[emotion] || "#0d6efd",
      }));
  }

  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.value, 0) || 1;

  // If no data, show placeholder
  if (chartData.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          color: "#6c757d",
          fontSize: "14px",
        }}
      >
        <i
          className="fas fa-chart-pie"
          style={{ marginRight: "10px", fontSize: "24px" }}
        ></i>
        Chưa có dữ liệu cảm xúc
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => {
            const percent = ((value / total) * 100).toFixed(1);
            return `${name}: ${percent}%`;
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((item, index) => (
            <Cell key={`cell-${index}`} fill={item.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => {
            const percent = ((value / total) * 100).toFixed(1);
            return [`${value} frame (${percent}%)`, "Số lần"];
          }}
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            border: "none",
            borderRadius: "8px",
            color: "white",
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          formatter={(value) => {
            const item = chartData.find((d) => d.name === value);
            return `${value}`;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
