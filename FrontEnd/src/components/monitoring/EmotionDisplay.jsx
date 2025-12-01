import React from "react";

/**
 * Component hiển thị thống kê cảm xúc
 */
export const EmotionDisplay = ({
  currentEmotion,
  positiveRate,
  emotionCounts,
  isDetecting,
}) => {
  const getEmotionColor = (emotion) => {
    const colors = {
      Happy: "#28a745",
      Surprise: "#ffc107",
      Neutral: "#6c757d",
      Sad: "#007bff",
      Angry: "#dc3545",
      Disgust: "#e83e8c",
      Fear: "#fd7e14",
    };
    return colors[emotion] || "#6c757d";
  };

  const emotionIcons = {
    Happy: "😊",
    Surprise: "😮",
    Neutral: "😐",
    Sad: "😢",
    Angry: "😠",
    Disgust: "🤢",
    Fear: "😨",
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            border: `3px solid ${getEmotionColor(currentEmotion)}`,
          }}
        >
          <span style={{ fontSize: "48px" }}>
            {emotionIcons[currentEmotion] || "😐"}
          </span>
          <div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              Cam xuc hien tai
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: getEmotionColor(currentEmotion),
              }}
            >
              {currentEmotion}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            Ty le tich cuc (Happy + Surprise)
          </span>
          <span style={{ color: "#28a745", fontWeight: "bold" }}>
            {positiveRate}%
          </span>
        </div>
        <div
          style={{
            backgroundColor: "#e9ecef",
            borderRadius: "4px",
            overflow: "hidden",
            height: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#28a745",
              width: `${positiveRate}%`,
              height: "100%",
              transition: "width 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "8px",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {positiveRate > 5 && `${positiveRate}%`}
          </div>
        </div>
      </div>

      {isDetecting &&
        emotionCounts &&
        Object.keys(emotionCounts).length > 0 && (
          <div>
            <div
              style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}
            >
              Phan bo cam xuc
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "10px",
              }}
            >
              {Object.entries(emotionCounts).map(([emotion, count]) => (
                <div
                  key={emotion}
                  style={{
                    padding: "10px",
                    backgroundColor: "white",
                    borderLeft: `4px solid ${getEmotionColor(emotion)}`,
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "20px", marginBottom: "5px" }}>
                    {emotionIcons[emotion] || "😐"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {emotion}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: getEmotionColor(emotion),
                    }}
                  >
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};
