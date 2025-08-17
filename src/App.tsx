import { Routes, Route } from "react-router-dom";
import InputPage from "./pages/InputPage";
import VideoPage from "./pages/VideoPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InputPage />} />
      <Route path="/video" element={<VideoPage />} />
    </Routes>
  );
}
