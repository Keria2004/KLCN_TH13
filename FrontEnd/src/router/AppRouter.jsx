import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Admin/Home";
import CreateClass from "../pages/Teacher/CreateClass";
import CreateSession from "../pages/Teacher/CreateSession";
import EmotionDashboard from "../pages/Teacher/EmotionDashboard";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher/create-class" element={<CreateClass />} />
        <Route path="/teacher/create-session" element={<CreateSession />} />
        <Route
          path="/teacher/emotion-dashboard"
          element={<EmotionDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
};
