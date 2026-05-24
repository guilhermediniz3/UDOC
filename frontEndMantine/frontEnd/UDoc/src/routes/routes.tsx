import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Admin from "../pages/Home/Admin/Admin";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default AppRoutes;