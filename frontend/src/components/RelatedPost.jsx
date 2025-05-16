import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Bookmark } from "lucide-react";

function RelatedPost({ authorId }) {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [articles, setArticles] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles related to author
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Use the correct API endpoint for fetching articles by author ID
        const response = await fetch(
          `http://localhost:3000/api/article/author?author_id=${authorId}`
        );

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        // Based on the provided response example, the data is an array directly
        const articlesData = await response.json();

        if (Array.isArray(articlesData)) {
          // Sort articles by published_date (newest first)
          const sortedArticles = articlesData
            .sort(
              (a, b) =>
                new Date(b.published_date).getTime() -
                new Date(a.published_date).getTime()
            )
            .slice(0, 6); // Take up to 6 newest articles

          setArticles(sortedArticles);

          // Fetch author info after articles are loaded
          if (sortedArticles.length > 0) {
            await fetchAuthors(sortedArticles);
          }
        } else {
          setError("Invalid response format from API");
          console.error("Unexpected API response:", articlesData);
        }
      } catch (err) {
        setError("Error fetching articles: " + err.message);
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchArticles();
    } else {
      setLoading(false);
      setError("Author ID is required");
    }
  }, [authorId]);

  // Fetch author information for each article
  const fetchAuthors = async (articlesData) => {
    const authorsData = {};
    const uniqueAuthorIds = [
      ...new Set(articlesData.map((article) => article.author_id)),
    ];

    for (const authorId of uniqueAuthorIds) {
      if (!authorId) continue;

      try {
        const response = await fetch(
          `http://localhost:3000/api/author/${authorId}`
        );

        if (!response.ok) {
          console.error(
            `Failed to fetch author ${authorId}: ${response.status}`
          );
          continue;
        }

        const result = await response.json();

        if (result.success && result.data && result.data.data) {
          // Store author data correctly according to the API response structure
          authorsData[authorId] = result.data.data;
        }
      } catch (err) {
        console.error(`Error fetching author ${authorId}:`, err);
      }
    }

    setAuthors(authorsData);
  };

  // Create excerpt from HTML content
  const createExcerpt = (htmlContent, maxLength = 80) => {
    if (!htmlContent) return "";

    // Create a temporary div element to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Get text content only (without HTML tags)
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    // Limit text length and add ellipsis if needed
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

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dynamically set itemsToShow based on screen size
  const itemsToShow = isMobile ? 1 : 4;
  const totalItems = articles.length;

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid date";
    }
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
            {"Related Post By " + (authors[authorId]?.name || "Unknown Author")}
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
          No articles found for this author
        </div>
      ) : (
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: getTranslateValue() }}
          >
            {articles.map((article) => {
              const author = authors[article.author_id] || {};
              return (
                <div
                  key={article.id}
                  className={`${
                    isMobile ? "w-full min-w-full" : "w-1/4 min-w-[25%]"
                  } px-2 flex-shrink-0`}
                >
                  <div className="card bg-base-100 shadow-md rounded-xl h-full">
                    <figure>
                      <img
                        src={
                          article.thumbnail
                            ? `http://localhost:3000/${article.thumbnail}`
                            : "/api/placeholder/400/200"
                        }
                        alt={article.title || "Article thumbnail"}
                        className="w-full h-40 md:h-48 object-cover rounded-t-xl"
                      />
                    </figure>
                    <div className="card-body p-3 md:p-4">
                      <h2 className="card-title text-base md:text-lg font-bold">
                        {article.title || "Untitled Article"}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                        {createExcerpt(article.content)}
                      </p>
                      <div className="card-actions justify-between items-center bg-gray-200 p-2 md:p-3 rounded-xl mt-3 md:mt-4">
                        <div className="flex items-center">
                          <img
                            src={
                              author.avatar
                                ? `http://localhost:3000/${author.avatar}`
                                : "/api/placeholder/32/32"
                            }
                            alt={author.name || "Author avatar"}
                            width={32}
                            height={32}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-xl"
                          />
                          <div className="flex flex-col ml-2">
                            <h2 className="font-bold text-sm md:text-base">
                              {author.name || "Unknown Author"}
                            </h2>
                            <p className="font-light text-xs md:text-sm">
                              {formatDate(article.published_date)}
                            </p>
                          </div>
                        </div>
                        <Bookmark className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default RelatedPost;
