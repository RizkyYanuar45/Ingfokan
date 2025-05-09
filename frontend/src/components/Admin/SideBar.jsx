import React, { useState } from "react";
import { Home, FileText, Users, X, Image, Tag, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SideBar({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path
      ? "bg-secondarycus"
      : "hover:bg-orange-400";
  };
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-500 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b ">
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">IngfokanAdmin</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-4 py-3">
            <Link
              to="/admin/dashboard"
              className={`flex items-center mb-4 px-4 py-2  rounded-lg ${isActive(
                "/admin/dashboard"
              )}`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/admin/article"
              className={`flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400 ${isActive(
                "/admin/article"
              )}`}
            >
              <FileText className="h-5 w-5 mr-3" />
              <span>Articles</span>
            </Link>

            <Link
              to="/admin/categories"
              className={`flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400 ${isActive(
                "/admin/categories"
              )}`}
            >
              <Tag className="h-5 w-5 mr-3" />
              <span>Categories</span>
            </Link>

            <Link
              to="/admin/banners"
              className={`flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400 ${isActive(
                "/admin/banners"
              )}`}
            >
              <Image className="h-5 w-5 mr-3" />
              <span>Banner</span>
            </Link>

            <Link
              to="/admin/authors"
              className={`flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400 ${isActive(
                "/admin/authors"
              )}`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Author</span>
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-indigo-700 p-4">
          <div className="flex items-center px-4 py-2 rounded-lg hover:bg-orange-400 cursor-pointer">
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
}
