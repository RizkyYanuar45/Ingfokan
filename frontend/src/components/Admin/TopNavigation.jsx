import React from "react";
import { Bell, Search, Menu } from "lucide-react";

export default function TopNavigation({ toggleSidebar }) {
  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <Bell className="h-6 w-6 text-gray-500" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </div>

          <div className="flex items-center">
            <img
              src="/api/placeholder/40/40"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <span className="ml-2 font-medium text-gray-700 hidden md:inline-block">
              Admin User
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
