import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { scrollToTop } from "../utils/ScrollToTop";
import { NavLink } from "react-router-dom";

function RandomCategory() {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert string to title case
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Fetch categories and articles
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all categories
        const categoryResponse = await fetch(
          "http://localhost:3000/api/category"
        );
        const categoryResult = await categoryResponse.json();

        if (!categoryResult.success) {
          throw new Error("Failed to fetch categories");
        }

        const allCategories = categoryResult.data.category || [];
        setCategories(allCategories);

        if (allCategories.length === 0) {
          setError("No categories found");
          setLoading(false);
          return;
        }

        // Recursive function to select random category excluding "trending"
        const selectRandomCategory = (categories, depth = 0) => {
          // Prevent infinite recursion (max 100 attempts)
          if (depth > 100) {
            // Fallback: filter and get first non-trending category
            const nonTrendingCategories = categories.filter(
              (cat) => cat.name !== "trending"
            );
            return nonTrendingCategories.length > 0
              ? nonTrendingCategories[0]
              : null;
          }

          const randomIndex = Math.floor(Math.random() * categories.length);
          const selectedCategory = categories[randomIndex];

          // If trending, recursively try again
          if (selectedCategory.name === "trending") {
            return selectRandomCategory(categories, depth + 1);
          }

          return selectedCategory;
        };

        const randomCategory = selectRandomCategory(allCategories);

        if (!randomCategory) {
          setError("No suitable categories found");
          setLoading(false);
          return;
        }

        setSelectedCategory(randomCategory);

        // Fetch all articles (now includes author and category data)
        const articleResponse = await fetch(
          "http://localhost:3000/api/article"
        );
        const articleResult = await articleResponse.json();

        if (!articleResult.success) {
          throw new Error("Failed to fetch articles");
        }

        const allArticles = articleResult.data.articles || [];

        // Filter articles by the selected random category
        const filteredArticles = allArticles.filter(
          (article) => article.category_id === randomCategory.id
        );

        // Sort articles by published_date (newest first) and take first 6
        const sortedArticles = filteredArticles
          .sort(
            (a, b) =>
              new Date(b.published_date).getTime() -
              new Date(a.published_date).getTime()
          )
          .slice(0, 6);

        setArticles(sortedArticles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create excerpt from HTML content
  const createExcerpt = (htmlContent, maxLength = 80) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    if (textContent.length <= maxLength) {
      return textContent;
    }

    return textContent.substring(0, maxLength).trim() + "...";
  };

  // Update itemsToShow based on screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const itemsToShow = isMobile ? 1 : 4;
  const totalItems = articles.length;

  const handleSlide = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    if (direction === "next") {
      setStartIndex((prev) => {
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

  const getTranslateValue = () => {
    const percentPerItem = isMobile ? 100 : 25;
    return `translateX(-${startIndex * percentPerItem}%)`;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="contain-content my-8 md:my-14 mx-4 md:mx-9">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div className="flex items-center">
          <div className="bg-primarycus w-1 h-3 rounded-4xl mx-2"></div>
          <h2 className="font-bold text-base md:text-lg">
            About{" "}
            {toTitleCase(
              selectedCategory ? selectedCategory.name : "Random Category"
            )}
          </h2>
        </div>

        <div className="px-2 md:px-16 space-x-2 md:space-x-3">
          <button
            className="bg-gray-100 hover:bg-gray-200 rounded-md p-1 md:p-2 disabled:opacity-50"
            onClick={prevSlide}
            disabled={isAnimating || articles.length <= itemsToShow}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 rounded-md p-1 md:p-2 disabled:opacity-50"
            onClick={nextSlide}
            disabled={isAnimating || articles.length <= itemsToShow}
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-8">
          No articles found in category "{selectedCategory?.name}"
        </div>
      ) : (
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: getTranslateValue() }}
          >
            {articles.map((article) => {
              return (
                <NavLink
                  onClick={scrollToTop}
                  to={`/article/${article.slug}`}
                  key={article.id}
                  className={`${
                    isMobile ? "w-full min-w-full" : "w-1/4 min-w-[25%]"
                  } px-2 flex-shrink-0`}
                >
                  <div className="card bg-base-100 shadow-md rounded-xl h-full">
                    <figure>
                      <img
                        src={`http://localhost:3000/${article.thumbnail}`}
                        alt={article.title}
                        className="w-full h-40 md:h-48 object-cover rounded-t-xl"
                      />
                    </figure>
                    <div className="card-body p-3 md:p-4">
                      <h2 className="card-title text-base md:text-lg font-bold">
                        {article.title}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                        {createExcerpt(article.content)}
                      </p>
                      {article.category && (
                        <div className="badge badge-outline text-xs mt-2 text-white bg-secondarycus">
                          {article.category.name}
                        </div>
                      )}

                      <div className="card-actions justify-between items-center bg-gray-200 p-2 md:p-3 rounded-xl mt-3 md:mt-4">
                        <div className="flex items-center">
                          <img
                            src={
                              article.author?.avatar
                                ? `http://localhost:3000/${article.author.avatar}`
                                : "/api/placeholder/32/32"
                            }
                            alt=""
                            width={32}
                            height={32}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover"
                          />
                          <div className="flex flex-col ml-2">
                            <h2 className="font-bold text-sm md:text-base">
                              {article.author?.name || "Unknown Author"}
                            </h2>
                            <p className="font-light text-xs md:text-sm">
                              {formatDate(article.published_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default RandomCategory;
