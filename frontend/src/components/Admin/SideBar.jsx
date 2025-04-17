import React, { useState } from "react";
import {
  Home,
  FileText,
  Users,
  BarChart2,
  Settings,
  X,
  PenTool,
  Image,
  Tag,
  LogOut,
} from "lucide-react";

export default function SideBar({ sidebarOpen, toggleSidebar }) {
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
            <span className="text-xl font-bold">NewsAdmin</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-4 py-3">
            <div className="flex items-center mb-4 px-4 py-2 bg-secondarycus rounded-lg">
              <Home className="h-5 w-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </div>

            <div className="flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400">
              <FileText className="h-5 w-5 mr-3" />
              <span>Articles</span>
            </div>

            <div className="flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400">
              <PenTool className="h-5 w-5 mr-3" />
              <span>Create Article</span>
            </div>

            <div className="flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400">
              <Tag className="h-5 w-5 mr-3" />
              <span>Categories</span>
            </div>

            <div className="flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400">
              <Image className="h-5 w-5 mr-3" />
              <span>Media</span>
            </div>

            <div className="flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400">
              <Users className="h-5 w-5 mr-3" />
              <span>Users</span>
            </div>

            <div className="flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400">
              <BarChart2 className="h-5 w-5 mr-3" />
              <span>Analytics</span>
            </div>

            <div className="flex items-center mb-4 px-4 py-2 rounded-lg hover:bg-orange-400">
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </div>
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
