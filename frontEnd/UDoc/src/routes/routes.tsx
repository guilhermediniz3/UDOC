import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home/Home";

import Admin from "../pages/Home/Admin/Admin";

import AdminListCards
  from "../pages/AdminListCards/AdminListCards";
  import UserCardView
from "../pages/UserCardView/UserCardView";

function AppRoutes() {

  return (
    <Routes>

      {/* USER */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* ADMIN LIST */}
      <Route
        path="/admin/cards"
        element={<AdminListCards />}
      />

      {/* CREATE */}
      <Route
        path="/admin/card"
        element={<Admin />}
      />

      {/* EDIT */}
      <Route
        path="/admin/card/:id"
        element={<Admin />}
      />
         <Route
          path="/view/card/:id"
          element={<UserCardView />}
        />

    </Routes>
  );
}

export default AppRoutes;