import { Routes, Route } from "react-router";
import MapView from "./components/MapView";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapView />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/admin-0311" element={<AdminPage />} />
    </Routes>
  );
}
