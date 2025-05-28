import React from "react";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "../components/Admin/ProtectedRoute";
import UserProtectedRoute from "../components/UserProtectedRoute";

import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";

import Main from "../pages/Main";
import Article from "../pages/Article";
import AuthorProfile from "../pages/AuthorProfile";
import CategoryPage from "../pages/CategoryPage";
import ContactUs from "../pages/ContactUs";
import AboutUs from "../pages/AboutUs";
import NotFound from "../pages/NotFound";
import NotAuthorized from "../pages/NotAuthorized";
import SearchPage from "../pages/SearchPage";
import UserFavorites from "../pages/UserFavorites";

import Test from "../pages/Admin/Test";
import Dashboard from "../pages/Admin/Dashboard";
import ControlArticles from "../pages/Admin/ControlArticles";
import ControlBanners from "../pages/Admin/ControlBanners";
import ControlCategories from "../pages/Admin/ControlCategories";
import ControlAuthors from "../pages/Admin/ControlAuthors";
import LoginAdmin from "../pages/Admin/LoginAdmin";

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
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/favorites/:idUser",
    element: (
      <UserProtectedRoute>
        <UserFavorites />
      </UserProtectedRoute>
    ),
  },

  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },

  {
    path: "/article/:slug",
    element: <Article />,
  },
  {
    path: "/author/:slug",
    element: <AuthorProfile />,
  },
  {
    path: "/category/:slug",
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
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/article",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <ControlArticles />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/banners",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <ControlBanners />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/categories",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <ControlCategories />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/authors",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <ControlAuthors />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/login",
    element: <LoginAdmin />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
]);
