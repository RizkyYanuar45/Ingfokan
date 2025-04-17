import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const items = [
  {
    id: 1,
    title: "Item 1",
    image: "/api/placeholder/300/200",
  },
  {
    id: 2,
    title: "Item 2",
    image: "/api/placeholder/300/200",
  },
  {
    id: 3,
    title: "Item 3",
    image: "/api/placeholder/300/200",
  },
  {
    id: 4,
    title: "Item 4",
    image: "/api/placeholder/300/200",
  },
  {
    id: 5,
    title: "Item 5",
    image: "/api/placeholder/300/200",
  },
  {
    id: 6,
    title: "Item 6",
    image: "/api/placeholder/300/200",
  },
  {
    id: 7,
    title: "Item 7",
    image: "/api/placeholder/300/200",
  },
  {
    id: 8,
    title: "Item 8",
    image: "/api/placeholder/300/200",
  },
  {
    id: 9,
    title: "Item 9",
    image: "/api/placeholder/300/200",
  },
  {
    id: 10,
    title: "Item 10",
    image: "/api/placeholder/300/200",
  },
  {
    id: 11,
    title: "Item 11",
    image: "/api/placeholder/300/200",
  },
  {
    id: 12,
    title: "Item 12",
    image: "/api/placeholder/300/200",
  },
  {
    id: 13,
    title: "Item 13",
    image: "/api/placeholder/300/200",
  },
  {
    id: 14,
    title: "Item 14",
    image: "/api/placeholder/300/200",
  },
];

function CategoriesBar() {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(7);
  const totalItems = items.length;

  // Update number of items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Small mobile
        setItemsToShow(2);
      } else if (width < 768) {
        // Large mobile
        setItemsToShow(3);
      } else if (width < 1024) {
        // Tablet
        setItemsToShow(4);
      } else if (width < 1280) {
        // Small desktop
        setItemsToShow(5);
      } else {
        // Large desktop
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

  // Function to handle slide navigation with debounce
  const handleSlide = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (direction === "next") {
      setStartIndex((prev) => (prev + 1) % (totalItems - itemsToShow + 1));
    } else {
      setStartIndex((prev) =>
        prev - 1 < 0 ? totalItems - itemsToShow : prev - 1
      );
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

  return (
    <div className="h-auto py-6 md:py-8 bg-gray-100">
      <div className="max-w-full px-4 md:max-w-[90rem] md:mx-auto">
        <div className="relative overflow-hidden">
          {/* Carousel container */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${translateValue})` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 px-1 sm:px-2"
                style={{ width: itemWidth }}
              >
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-16 sm:h-20 object-cover blur-[2px]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white text-sm sm:text-base md:text-lg font-bold px-2 text-center truncate">
                      {item.title}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons - now smaller on mobile */}
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
        </div>
      </div>
    </div>
  );
}

export default CategoriesBar;
