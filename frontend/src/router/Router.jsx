import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";

export const Router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <div>tes</div>,
  },
]);
