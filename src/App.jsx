import { Routes, Route } from "react-router";
import MapView from "./components/MapView";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import CalendarPage from "./pages/CalendarPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapView />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/admin-0311" element={<AdminPage />} />
    </Routes>
  );
}
