import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";

import Main from "../pages/Main";
import Article from "../pages/Article";
export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <div>tes</div>,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/article",
    element: <Article />,
  },
]);
