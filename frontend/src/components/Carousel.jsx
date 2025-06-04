import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [articleContent, setArticleContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticleContent();
  }, []);

  const fetchArticleContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/article");
      const data = await response.json();

      if (data.success) {
        // Get 4 random articles from the response
        const randomArticles = getRandomArticles(data.data.articles, 4);
        setArticleContent(randomArticles);
      } else {
        console.error("Failed to fetch articles:", data.message);
      }
    } catch (error) {
      console.error("Error fetching article content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to get random articles
  const getRandomArticles = (articles, count) => {
    const articlesCopy = [...articles];
    const result = [];

    for (let i = 0; i < count && articlesCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * articlesCopy.length);
      result.push(articlesCopy.splice(randomIndex, 1)[0]);
    }

    return result;
  };

  // Function to create excerpt from HTML content
  const createExcerpt = (htmlContent, maxLength = 150) => {
    // Create temporary div element for HTML parsing
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Get text content only (without HTML tags)
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    // Limit text length and add ellipsis if truncated
    if (textContent.length <= maxLength) {
      return textContent;
    }

    return textContent.substring(0, maxLength).trim() + "...";
  };

  const totalSlides = articleContent.length;

  const goToSlide = (slideIndex) => {
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

  // Format date for display (optional, if you want to show publish date)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading articles...
      </div>
    );
  }

  if (articleContent.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        No articles available
      </div>
    );
  }

  return (
    <div className="carousel w-full md:h-96 relative overflow-hidden">
      {articleContent.map((article, index) => {
        // Access embedded author and category data
        const author = article.author || {};
        const category = article.category || {};

        return (
          <NavLink
            to={`/article/${article.slug}`}
            key={article.id}
            className={`carousel-item absolute w-full h-full transition-transform duration-300 ease-in-out ${
              index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
            aria-hidden={index !== currentSlide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${totalSlides}`}
          >
            <img
              src={`http://localhost:3000/${article.thumbnail}`}
              className="w-full h-full object-cover"
              alt={article.title}
            />

            {/* Article title and category */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 text-white">
              {category.name && (
                <span className="inline-block bg-secondarycus text-white text-xs px-2 py-1 rounded mb-2">
                  {category.name}
                </span>
              )}
              <h2 className="text-lg font-bold">{article.title}</h2>
            </div>

            {/* Article excerpt and author info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
              <p className="line-clamp-3 mb-3">
                {createExcerpt(article.content)}
              </p>

              {/* Author and date info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {author.avatar && (
                    <img
                      src={`http://localhost:3000/${author.avatar}`}
                      alt={author.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {author.name || "Unknown Author"}
                    </p>
                    <p className="text-xs text-gray-300">
                      {formatDate(article.published_date)}
                    </p>
                  </div>
                </div>

                <button className="text-sm text-blue-300 hover:underline">
                  Baca Selengkapnya
                </button>
              </div>
            </div>
          </NavLink>
        );
      })}

      {/* Navigation buttons */}
      {totalSlides > 1 && (
        <>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
            <button
              onClick={goToPrevSlide}
              className="btn btn-circle bg-black/50 border-none text-white hover:bg-black/70"
              aria-label="Previous Slide"
            >
              ❮
            </button>
            <button
              onClick={goToNextSlide}
              className="btn btn-circle bg-black/50 border-none text-white hover:bg-black/70"
              aria-label="Next Slide"
            >
              ❯
            </button>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {articleContent.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Carousel;
