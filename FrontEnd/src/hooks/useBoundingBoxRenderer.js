import { useRef, useEffect } from "react";

/**
 * Hook render bounding box cho face detection
 */
export const useBoundingBoxRenderer = (
  videoRef,
  canvasRef,
  faceDetectionsRef,
  getEmotionColor
) => {
  const animationRef = useRef(null);
  const isRenderingRef = useRef(false);

  const getEmotionColorInternal = (emotion) => {
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

  const colorFn = getEmotionColor || getEmotionColorInternal;

  const drawFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      if (isRenderingRef.current) {
        animationRef.current = requestAnimationFrame(drawFrame);
      }
      return;
    }

    // Get video metadata dimensions
    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;

    // Get display dimensions
    const displayWidth = video.offsetWidth || 640;
    const displayHeight = video.offsetHeight || 480;

    // Calculate scale factor
    const scaleX = displayWidth / videoWidth;
    const scaleY = displayHeight / videoHeight;

    // Canvas = display size
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Draw bounding boxes
    if (
      faceDetectionsRef?.current &&
      Array.isArray(faceDetectionsRef.current)
    ) {
      faceDetectionsRef.current.forEach((face) => {
        if (!face.bbox || face.bbox.length < 4) return;

        const [x1, y1, x2, y2] = face.bbox;
        const scaledX = x1 * scaleX;
        const scaledY = y1 * scaleY;
        const scaledW = (x2 - x1) * scaleX;
        const scaledH = (y2 - y1) * scaleY;

        // Draw bounding box
        ctx.strokeStyle = colorFn(face.emotion);
        ctx.lineWidth = Math.max(2, 3 * Math.min(scaleX, scaleY));
        ctx.strokeRect(scaledX, scaledY, scaledW, scaledH);

        // Draw emotion label
        const fontSize = Math.max(12, 16 * Math.min(scaleX, scaleY));
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = colorFn(face.emotion);
        ctx.textBaseline = "top";

        const text = `${face.emotion} (${(face.confidence * 100).toFixed(0)}%)`;
        const textMetrics = ctx.measureText(text);
        const textHeight = fontSize + 4;

        ctx.fillRect(
          scaledX,
          scaledY - textHeight - 4,
          textMetrics.width + 8,
          textHeight + 4
        );

        ctx.fillStyle = "#fff";
        ctx.fillText(text, scaledX + 4, scaledY - textHeight);
      });
    }

    if (isRenderingRef.current) {
      animationRef.current = requestAnimationFrame(drawFrame);
    }
  };

  const startRendering = () => {
    if (isRenderingRef.current) return;
    isRenderingRef.current = true;
    animationRef.current = requestAnimationFrame(drawFrame);
  };

  const stopRendering = () => {
    isRenderingRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (canvasRef?.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    return () => {
      stopRendering();
    };
  }, []);

  return {
    startRendering,
    stopRendering,
    drawFrame,
    isRenderingRef,
  };
};
