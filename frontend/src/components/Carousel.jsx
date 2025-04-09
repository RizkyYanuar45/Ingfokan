import React, { useState } from "react";

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      image:
        "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp", // Placeholder for: https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp
    },
    {
      id: 1,
      image:
        "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp", // Placeholder for: https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp
    },
    {
      id: 2,
      image:
        "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp", // Placeholder for: https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp
    },
    {
      id: 3,
      image:
        "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp", // Placeholder for: https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp
    },
  ];

  const totalSlides = slides.length;

  const goToSlide = (slideIndex) => {
    // Handle wrapping around at the ends
    if (slideIndex < 0) {
      setCurrentSlide(totalSlides - 1);
    } else if (slideIndex >= totalSlides) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(slideIndex);
    }
  };

  const goToPrevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  const goToNextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  return (
    <div className="carousel w-full md:h-[443px] relative overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-item absolute w-full h-full transition-transform duration-300 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          <img
            src={slide.image}
            className="w-full h-full object-cover"
            alt={`Slide ${index + 1}`}
          />
        </div>
      ))}

      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
        <button onClick={goToPrevSlide} className="btn btn-circle">
          ❮
        </button>
        <button onClick={goToNextSlide} className="btn btn-circle">
          ❯
        </button>
      </div>

      {/* Optional: Add slide indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
