import { useRef, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

/**
 * Hook quản lý session và lưu data
 */
export const useSessionManagement = (videoRef, uploadedVideoFile) => {
  const [sessionId, setSessionId] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const sessionStartTimeRef = useRef(null);
  const sessionDurationIntervalRef = useRef(null);

  const startSession = async (classId, subjectId, className, subjectName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/session/start`, {
        class_id: classId,
        subject_id: subjectId,
      });

      const id = response.data?.session_id;
      setSessionId(id);
      setSessionName(`${className} - ${subjectName}`);
      setIsSessionActive(true);
      setSessionDuration(0);
      setErrorMessage("");

      sessionStartTimeRef.current = Date.now();

      if (sessionDurationIntervalRef.current) {
        clearInterval(sessionDurationIntervalRef.current);
      }

      sessionDurationIntervalRef.current = setInterval(() => {
        const elapsed = Math.round(
          (Date.now() - sessionStartTimeRef.current) / 1000
        );
        setSessionDuration(elapsed);
      }, 1000);

      return id;
    } catch (error) {
      const msg = `Loi bat dau session: ${
        error.response?.data?.detail || error.message
      }`;
      setErrorMessage(msg);
      console.error(msg);
      return null;
    }
  };

  const endSession = async (emotionData) => {
    try {
      if (sessionDurationIntervalRef.current) {
        clearInterval(sessionDurationIntervalRef.current);
      }

      let videoBase64 = null;
      if (uploadedVideoFile && emotionData.includeVideo) {
        try {
          videoBase64 = await fileToBase64(uploadedVideoFile);
        } catch (err) {
          console.warn("Video encoding failed, proceeding without video", err);
        }
      }

      const payload = {
        session_id: sessionId,
        emotion_array: emotionData.emotionArray,
        positive_rate: emotionData.positiveRate,
        engagement_rate: emotionData.engagementRate,
        ...(videoBase64 && { video_base64: videoBase64 }),
      };

      const response = await axios.post(
        `${API_BASE_URL}/session/end`,
        payload,
        { timeout: 30000 }
      );

      setIsSessionActive(false);
      setErrorMessage("");

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const msg = `Loi ket thuc session: ${
        error.response?.data?.detail || error.message
      }`;
      setErrorMessage(msg);
      console.error(msg);

      return {
        success: false,
        error: msg,
      };
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
    });
  };

  return {
    sessionId,
    sessionName,
    isSessionActive,
    sessionDuration,
    errorMessage,
    sessionStartTimeRef,
    startSession,
    endSession,
  };
};
