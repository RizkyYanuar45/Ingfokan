import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Office from "./../assets/Office.jpg";

const items = [
  {
    id: 1,
    title: "Item 1",
    image: Office,
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
  const itemsToShow = 7;
  const totalItems = items.length;

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

  // Calculate items to display
  const getVisibleItems = () => {
    // Create a circular array by concatenating the items
    const circularItems = [...items, ...items];
    return circularItems.slice(startIndex, startIndex + itemsToShow);
  };

  const translateValue = `-${startIndex * (100 / itemsToShow)}%`;

  return (
    <div className="h-40 bg-gray-100 p-8">
      <div className="max-w-[90rem] mx-auto">
        <div className="relative overflow-hidden">
          {/* Carousel container */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${translateValue})` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="w-1/7 flex-shrink-0 px-2 min-w-[14.28%]"
              >
                <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-20 object-cover blur-[2px]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-white text-lg font-bold">
                      {item.title}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 bg-white/80 hover:bg-white rounded-full shadow-md p-2 focus:outline-none disabled:opacity-50 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 bg-white/80 hover:bg-white rounded-full shadow-md p-2 focus:outline-none disabled:opacity-50 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoriesBar;
