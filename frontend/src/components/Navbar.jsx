import React, { useState } from "react";
import { ChevronDown, Bookmark, Search, Menu, X } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex justify-between items-center px-5 py-3 mx-auto my-0 h-16 max-w-[1512px] shadow-sm relative">
      <div className="flex gap-16 items-center max-md:gap-4">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e2ae9fabd01951bee1bbe437117d47b03ea3cc9"
          className="object-contain h-10 w-[120px] md:h-12 md:w-[163px]"
          alt="Ingfokan News"
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-9 items-center">
          <button className="flex gap-0.5 items-center text-base font-medium text-stone-700">
            <span>Categories</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="flex gap-0.5 items-center text-base font-medium text-stone-700">
            <span>Authors</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <a href="/contact" className="text-base font-medium text-stone-700">
            Contact us
          </a>
          <a href="/about" className="text-base font-medium text-stone-700">
            About us
          </a>
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex items-center justify-center p-2"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Controls */}
      <div className="hidden md:flex gap-6 items-center">
        <div className="flex items-center">
          <div className="flex gap-5 items-center px-4 py-3 rounded-xl bg-neutral-100">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search anything"
              className="text-xs text-stone-700 text-opacity-80 w-[287px] bg-transparent border-none outline-none"
            />
            <button aria-label="Adjust search settings">
              <i className="ti ti-adjustments-horizontal text-xl text-stone-700 text-opacity-80" />
            </button>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/65a45d88f10ad10c818d420053bb5bec70cff7d2"
            className="object-cover w-10 h-10 rounded-xl"
            alt="User avatar"
          />
          <span className="text-base font-medium text-black">Behzad</span>
          <div className="relative group">
            <button className="flex items-center">
              <ChevronDown size={18} />
            </button>
            <ul className="absolute right-0 hidden group-hover:block bg-white rounded-lg z-10 w-48 p-2 shadow-md">
              <li className="py-2 px-3 hover:bg-gray-100 rounded-md">
                <a href="#" className="block w-full">
                  Update Profile
                </a>
              </li>
              <li className="py-2 px-3 hover:bg-gray-100 rounded-md">
                <a href="#" className="block w-full text-red-500">
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
        <button
          className="flex justify-center items-center w-10 h-10 rounded-xl bg-neutral-100"
          aria-label="Bookmarks"
        >
          <Bookmark size={18} />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden z-20">
          <nav className="flex flex-col py-4">
            <button className="flex gap-2 items-center px-5 py-3 text-base font-medium text-stone-700">
              <span>Categories</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex gap-2 items-center px-5 py-3 text-base font-medium text-stone-700">
              <span>Authors</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <a
              href="/contact"
              className="px-5 py-3 text-base font-medium text-stone-700"
            >
              Contact us
            </a>
            <a
              href="/about"
              className="px-5 py-3 text-base font-medium text-stone-700"
            >
              About us
            </a>

            <div className="flex items-center px-5 py-3">
              <div className="flex gap-3 items-center px-3 py-2 rounded-lg bg-neutral-100 w-full">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search anything"
                  className="text-xs text-stone-700 text-opacity-80 flex-1 bg-transparent border-none outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center px-5 py-3">
              <div className="flex gap-3 items-center">
                <img
                  src="/api/placeholder/40/40"
                  className="object-cover w-10 h-10 rounded-xl"
                  alt="User avatar"
                />
                <span className="text-base font-medium text-black">Behzad</span>
              </div>
              <button
                className="flex justify-center items-center w-10 h-10 rounded-xl bg-neutral-100"
                aria-label="Bookmarks"
              >
                <Bookmark size={16} />
              </button>
            </div>

            <div className="border-t border-gray-200 mt-2">
              <a
                href="#"
                className="block px-5 py-3 text-base font-medium text-stone-700"
              >
                Update Profile
              </a>
              <a
                href="#"
                className="block px-5 py-3 text-base font-medium text-red-500"
              >
                Log Out
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
