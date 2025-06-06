import { useState, useEffect, useRef } from "react";
import { ChevronDown, Bookmark, Search, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { scrollToTop } from "../utils/ScrollToTop";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    const query = searchQuery.trim();
    if (query) {
      // Navigate to search page with query parameter
      navigate(`/search-page?q=${encodeURIComponent(query)}`);

      // Close mobile search if open
      if (isSearchOpen) {
        setIsSearchOpen(false);
      }

      // Clear search query after submission (optional)
      setSearchQuery("");
    }
    scrollToTop(); // Scroll to top after search
    return false; // Extra safety to prevent default form submission
  };

  // Function to truncate username
  const truncateUsername = (username) => {
    if (!username) return "";
    return username.length > 10 ? username.substring(0, 10) + "..." : username;
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);

        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Decode the token to get user ID
        // Split the token into its parts: header, payload, signature
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          localStorage.removeItem("token"); // Invalid token format
          setUser(null);
          setLoading(false);
          return;
        }

        // Decode the payload (second part)
        try {
          const payload = JSON.parse(atob(tokenParts[1]));

          // Check if token is expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem("token"); // Token expired
            setUser(null);
            setLoading(false);
            return;
          }

          // Get user ID from token
          const userId = payload.id || payload.userId || payload.sub;

          if (!userId) {
            setUser(null);
            setLoading(false);
            return;
          }

          // Fetch user data using the ID
          const response = await fetch(
            `http://localhost:3000/api/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();

          if (userData.success) {
            setUser(userData.data.data);
          } else {
            throw new Error(userData.message || "Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error parsing token:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsDropdownOpen(false);
  };

  // Determine avatar URL - handle relative paths correctly
  const getAvatarUrl = () => {
    if (!user || !user.avatar)
      return "https://cdn.builder.io/api/v1/image/assets/TEMP/65a45d88f10ad10c818d420053bb5bec70cff7d2";

    // Check if avatar starts with 'uploads\' or 'uploads/'
    if (
      user.avatar.startsWith("uploads\\") ||
      user.avatar.startsWith("uploads/") ||
      user.avatar.startsWith("images\\") ||
      user.avatar.startsWith("images/")
    ) {
      const path = user.avatar.replace("\\", "/");
      return `http://localhost:3000/${path}`;
    }

    return user.avatar;
  };

  return (
    <>
      <header className="flex justify-between items-center px-5 py-3 mx-auto my-0 h-16 max-w-[1512px] shadow-sm sticky top-0 bg-white z-100">
        <div className="flex gap-16 items-center max-md:gap-4">
          <NavLink to={"/"} className="flex items-center" onClick={scrollToTop}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e2ae9fabd01951bee1bbe437117d47b03ea3cc9"
              className="object-contain h-10 w-[120px] md:h-12 md:w-[163px]"
              alt="Ingfokan News"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-9 items-center">
            <NavLink
              onClick={scrollToTop}
              to={"/contact-us"}
              className="text-base font-medium text-stone-700"
            >
              Contact us
            </NavLink>
            <NavLink
              onClick={scrollToTop}
              to={"/about-us"}
              className="text-base font-medium text-stone-700"
            >
              About us
            </NavLink>
          </nav>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleSearch}
            className="flex items-center justify-center p-2"
            aria-label="Search"
          >
            <Search size={22} />
          </button>
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex gap-6 items-center">
          <div className="flex items-center">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="flex gap-5 items-center px-4 py-3 rounded-xl bg-neutral-100">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search anything"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="text-xs text-stone-700 text-opacity-80 w-[287px] bg-transparent border-none outline-none"
                />
                <button type="submit" aria-label="Search">
                  <i className="ti ti-adjustments-horizontal text-xl text-stone-700 text-opacity-80" />
                </button>
              </div>
            </form>
          </div>

          {/* Authenticated UI vs Login/Signup UI */}
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 animate-pulse"></div>
            </div>
          ) : user ? (
            <div className="flex gap-8 items-center">
              <img
                src={getAvatarUrl()}
                className="object-cover w-10 h-10 rounded-xl"
                alt="User avatar"
              />
              <span
                className="text-base font-medium text-black"
                title={user.username || user.name} // Show full username on hover
              >
                {truncateUsername(user.username || user.name)}
              </span>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  aria-label="User menu"
                >
                  <ChevronDown size={18} />
                </button>
                {isDropdownOpen && (
                  <ul className="absolute right-0 bg-white rounded-lg z-10 w-48 p-2 shadow-md">
                    <li className="py-2 px-3 hover:bg-gray-100 rounded-md">
                      <NavLink
                        to={`/edit-profile/${user.id}`}
                        className="block w-full"
                      >
                        Update Profile
                      </NavLink>
                    </li>
                    <li className="py-2 px-3 hover:bg-gray-100 rounded-md">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left text-red-500"
                      >
                        Log Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              <NavLink
                onClick={scrollToTop}
                to={`/favorites/${user.id}`}
                className="flex justify-center items-center w-10 h-10 rounded-xl bg-neutral-100"
                aria-label="Bookmarks"
              >
                <Bookmark size={18} />
              </NavLink>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-stone-700 border border-stone-300 rounded-lg hover:bg-stone-50"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-secondarycus rounded-lg hover:bg-primarycus"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 py-3 bg-white shadow-md">
          <form onSubmit={handleSearchSubmit} method="get" role="search">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 w-full">
              <Search size={16} />
              <input
                type="text"
                name="search"
                placeholder="Search anything"
                value={searchQuery}
                onChange={handleSearchChange}
                className="text-xs text-stone-700 text-opacity-80 flex-1 bg-transparent border-none outline-none"
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                onClick={toggleSearch}
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden z-20">
          <nav className="flex flex-col py-4">
            <NavLink
              onClick={scrollToTop}
              to={"/contact-us"}
              className="px-5 py-3 text-base font-medium text-stone-700"
            >
              Contact us
            </NavLink>
            <NavLink
              onClick={scrollToTop}
              to={"/about-us"}
              className="px-5 py-3 text-base font-medium text-stone-700"
            >
              About us
            </NavLink>

            {/* Mobile Auth UI */}
            {loading ? (
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                <div className="flex justify-between items-center px-5 py-3">
                  <div className="flex gap-3 items-center">
                    <img
                      src={getAvatarUrl()}
                      className="object-cover w-10 h-10 rounded-xl"
                      alt="User avatar"
                    />
                    <span
                      className="text-base font-medium text-black"
                      title={user.username || user.name} // Show full username on hover
                    >
                      {truncateUsername(user.username || user.name)}
                    </span>
                  </div>
                  <NavLink
                    onClick={scrollToTop}
                    to={`/favorites/${user.id}`}
                    className="flex justify-center items-center w-10 h-10 rounded-xl bg-neutral-100"
                    aria-label="Bookmarks"
                  >
                    <Bookmark size={16} />
                  </NavLink>
                </div>

                <div className="border-t border-gray-200 mt-2">
                  <NavLink
                    to={`/edit-profile/${user.id}`}
                    className="block px-5 py-3 text-base font-medium text-stone-700"
                  >
                    Update Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-3 text-base font-medium text-red-500"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-5 py-3">
                <a
                  href="/login"
                  className="block w-full py-2 text-center text-base font-medium text-stone-700 border border-stone-300 rounded-lg"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="block w-full py-2 text-center text-base font-medium text-white bg-secondarycus  hover:bg-primarycus rounded-lg"
                >
                  Sign Up
                </a>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export default Navbar;
