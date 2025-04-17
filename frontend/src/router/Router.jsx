import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";

import Main from "../pages/Main";
import Article from "../pages/Article";
import AuthorProfile from "../pages/AuthorProfile";
import CategoryPage from "../pages/CategoryPage";
import ContactUs from "../pages/ContactUs";
import AboutUs from "../pages/AboutUs";
import NotFound from "../pages/NotFound";
import NotAuthorized from "../pages/NotAuthorized";
import SearchPage from "../pages/SearchPage";

import Test from "../pages/Admin/Test";
import Dashboard from "../pages/Admin/Dashboard";
import ControlArticles from "../pages/Admin/ControlArticles";

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
  {
    path: "/author-profile",
    element: <AuthorProfile />,
  },
  {
    path: "/category-page",
    element: <CategoryPage />,
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
  },

  {
    path: "/not-authorized",
    element: <NotAuthorized />,
  },
  {
    path: "/search-page",
    element: <SearchPage />,
  },
  {
    path: "/admin/test",
    element: <Test />,
  },

  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin/article",
    element: <ControlArticles />,
  },

  {
    path: "/*",
    element: <NotFound />,
  },
]);
