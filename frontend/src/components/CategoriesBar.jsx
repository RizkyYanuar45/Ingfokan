import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { scrollToTop } from "../utils/ScrollToTop";

function CategoriesBar() {
  const api = import.meta.env.VITE_API_URL; // Ensure this is set in your .env file
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure this is set in your .env file

  // State variables
  const [startIndex, setStartIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(7);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(false);

      // Replace with your actual API URL
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${apiUrl}/category`);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(true);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Update number of items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsToShow(2);
      } else if (width < 768) {
        setItemsToShow(3);
      } else if (width < 1024) {
        setItemsToShow(4);
      } else if (width < 1280) {
        setItemsToShow(5);
      } else {
        setItemsToShow(7);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if we have items to display
  const totalItems = categories.length;

  // Function to handle slide navigation with debounce
  const handleSlide = (direction) => {
    if (isAnimating || totalItems <= itemsToShow) return;

    setIsAnimating(true);

    if (direction === "next") {
      setStartIndex((prev) => {
        const maxIndex = totalItems - itemsToShow;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    } else {
      setStartIndex((prev) => {
        const maxIndex = totalItems - itemsToShow;
        return prev <= 0 ? maxIndex : prev - 1;
      });
    }

    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Match this to transition duration
  };

  const nextSlide = () => handleSlide("next");
  const prevSlide = () => handleSlide("prev");

  const translateValue = `-${startIndex * (100 / itemsToShow)}%`;
  const itemWidth = `${100 / itemsToShow}%`;

  if (loading) {
    return (
      <div className="h-auto py-6 md:py-8 bg-gray-100">
        <div className="max-w-full px-4 md:max-w-6xl md:mx-auto">
          <div className="flex justify-center">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || categories.length === 0) {
    return (
      <div className="h-auto py-6 md:py-8 bg-gray-100">
        <div className="max-w-full px-4 md:max-w-6xl md:mx-auto">
          <div className="flex justify-center">
            <p className="text-gray-500">No categories available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto py-6 md:py-8 bg-gray-100">
      <div className="max-w-full px-4 md:max-w-6xl md:mx-auto">
        <div className="relative overflow-hidden">
          {/* Carousel container */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${translateValue})` }}
          >
            {categories.map((item) => (
              <NavLink
                onClick={scrollToTop}
                to={`/category/${item.slug}`}
                key={item.id}
                className="flex-shrink-0 px-1 sm:px-2"
                style={{ width: itemWidth }}
              >
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer">
                  <img
                    src={`${backendUrl}/${item.thumbnail.replace(/\\/g, "/")}`}
                    alt={item.name}
                    className="w-full h-16 sm:h-20 object-cover blur-[4px] "
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white text-sm sm:text-base md:text-lg  px-2 text-center truncate font-bold ">
                      #{item.name}
                    </h2>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>

          {/* Navigation buttons - only show if we have more items than can be displayed */}
          {totalItems > itemsToShow && (
            <>
              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md p-1 sm:p-2 focus:outline-none disabled:opacity-50 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md p-1 sm:p-2 focus:outline-none disabled:opacity-50 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesBar;
