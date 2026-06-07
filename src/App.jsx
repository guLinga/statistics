import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import DutyPage from "./pages/DutyPage.jsx";
import { routerBasename } from "./routerBasename.js";

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/attendance" replace />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="duty" element={<DutyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
