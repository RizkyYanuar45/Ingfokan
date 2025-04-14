import React, { useState, useEffect } from "react";
import Office from "../assets/Office.jpg";
import { ChevronRight, ChevronLeft, Bookmark } from "lucide-react";

function RelatedPost() {
  const items = [
    {
      id: 1,
      title: "Item 1",
      image: Office,
      avatar: Office,
      isi: "isi sementara",
      tanggal: "tanggal",
      penulis: "penulis",
    },
    {
      id: 2,
      title: "Item 2",
      image: Office,
      avatar: Office,
      isi: "isi sementara",
      tanggal: "tanggal",
      penulis: "penulis",
    },
    {
      id: 3,
      title: "Item 3",
      image: Office,
      avatar: Office,
      isi: "isi sementara",
      tanggal: "tanggal",
      penulis: "penulis",
    },
    {
      id: 4,
      title: "Item 4",
      image: Office,
      avatar: Office,
      isi: "isi sementara",
      tanggal: "tanggal",
      penulis: "penulis",
    },
    {
      id: 5,
      title: "Item 5",
      image: Office,
      avatar: Office,
      isi: "isi sementara",
      tanggal: "tanggal",
      penulis: "penulis",
    },
    {
      id: 6,
      title: "Item 6",
      image: Office,
      avatar: Office,
      isi: "isi sementara",
      tanggal: "tanggal",
      penulis: "penulis",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Update itemsToShow based on screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dynamically set itemsToShow based on screen size
  const itemsToShow = isMobile ? 1 : 4;
  const totalItems = items.length;

  const handleSlide = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    if (direction === "next") {
      setStartIndex((prev) => {
        // Calculate the new index, ensuring we don't go beyond available items
        const maxStartIndex = Math.max(0, totalItems - itemsToShow);
        return prev >= maxStartIndex ? 0 : prev + 1;
      });
    } else {
      setStartIndex((prev) =>
        prev <= 0 ? Math.max(0, totalItems - itemsToShow) : prev - 1
      );
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const nextSlide = () => handleSlide("next");
  const prevSlide = () => handleSlide("prev");

  // Calculate translate value based on screen size
  const getTranslateValue = () => {
    const percentPerItem = isMobile ? 100 : 25;
    return `translateX(-${startIndex * percentPerItem}%)`;
  };
  return (
    <div className="contain-content my-8 md:my-14 mx-4 md:mx-9">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div className="flex items-center">
          <div className="bg-primarycus w-1 h-3 rounded-4xl mx-2"></div>
          <h2 className="font-bold text-base md:text-lg">Related Post</h2>
        </div>

        <div className="px-2 md:px-16 space-x-2 md:space-x-3">
          <button
            className="bg-gray-100 hover:bg-gray-200 rounded-md p-1 md:p-2 disabled:opacity-50"
            onClick={prevSlide}
            disabled={isAnimating}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 rounded-md p-1 md:p-2 disabled:opacity-50"
            onClick={nextSlide}
            disabled={isAnimating}
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Slider container with overflow hidden */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: getTranslateValue() }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`${
                isMobile ? "w-full min-w-full" : "w-1/4 min-w-[25%]"
              } px-2 flex-shrink-0`}
            >
              <div className="card bg-base-100 shadow-md rounded-xl h-full">
                <figure>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 md:h-48 object-cover rounded-t-xl"
                  />
                </figure>
                <div className="card-body p-3 md:p-4">
                  <h2 className="card-title text-base md:text-lg font-bold">
                    {item.isi}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    {item.title}
                  </p>
                  <div className="card-actions justify-between items-center bg-gray-200 p-2 md:p-3 rounded-xl mt-3 md:mt-4">
                    <div className="flex items-center">
                      <img
                        src={item.avatar}
                        alt=""
                        width={32}
                        height={32}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-xl"
                      />
                      <div className="flex flex-col ml-2">
                        <h2 className="font-bold text-sm md:text-base">
                          {item.penulis}
                        </h2>
                        <p className="font-light text-xs md:text-sm">
                          {item.tanggal}
                        </p>
                      </div>
                    </div>
                    <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RelatedPost;
