import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";

export const Router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <div>tes</div>,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
]);
