import { useRef, useState } from "react";

/**
 * Hook quản lý video stream (webcam + video upload)
 */
export const useVideoStream = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamMode, setStreamMode] = useState(null); // 'webcam' | 'video'
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRecordingWebcam, setIsRecordingWebcam] = useState(false);
  const [uploadedVideoFile, setUploadedVideoFile] = useState(null);

  const videoWidth = 640;
  const videoHeight = 480;

  const startWebcam = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { width: videoWidth, height: videoHeight },
      });

      videoRef.current.srcObject = streamRef.current;
      setStreamMode("webcam");
      setIsStreaming(true);

      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        setUploadedVideoFile(blob);
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "video/mp4",
      "video/avi",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Vui lòng tải lên file video hợp lệ (MP4, AVI, MOV, WebM)");
      return;
    }

    setUploadedVideoFile(file);

    const url = URL.createObjectURL(file);
    videoRef.current.src = url;
    videoRef.current.srcObject = null;
    setStreamMode("video");
    setIsStreaming(true);

    videoRef.current.onloadedmetadata = () => {
      setVideoDuration(Math.round(videoRef.current.duration));
    };
  };

  const stopStream = () => {
    if (streamMode === "webcam" && streamRef.current) {
      if (mediaRecorderRef.current && isRecordingWebcam) {
        mediaRecorderRef.current.stop();
        setIsRecordingWebcam(false);
      }
      streamRef.current.getTracks().forEach((track) => track.stop());
    } else if (streamMode === "video" && videoRef.current) {
      videoRef.current.pause();
    }

    setIsStreaming(false);
    setStreamMode(null);
  };

  const toggleWebcamRecording = () => {
    if (!isRecordingWebcam) {
      recordedChunksRef.current = [];
      mediaRecorderRef.current?.start();
      setIsRecordingWebcam(true);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecordingWebcam(false);
    }
  };

  return {
    videoRef,
    streamRef,
    mediaRecorderRef,
    recordedChunksRef,
    isStreaming,
    streamMode,
    videoDuration,
    currentTime,
    setCurrentTime,
    isRecordingWebcam,
    uploadedVideoFile,
    videoWidth,
    videoHeight,
    startWebcam,
    handleVideoUpload,
    stopStream,
    toggleWebcamRecording,
  };
};
