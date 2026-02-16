import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Waitlist from "./pages/Waitlist";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Waitlist />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="*" element={<Navigate to="/waitlist" replace />} />
      </Routes>
    </BrowserRouter>
  );
}