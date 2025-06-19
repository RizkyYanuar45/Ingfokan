// src/SearchPage.jsx
import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { scrollToTop } from "../utils/ScrollToTop";

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data state - now only need articles since they include author data
  const [articles, setArticles] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState(currentPage.toString());
  const articlesPerPage = 12; // 12 items per page (3 rows of 4 columns)

  // Extract search query from URL on component mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Fetch all articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/article");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();

        if (data.success) {
          // Articles already include author and category data
          setArticles(data.data.articles);
          setError(null);
        } else {
          throw new Error("Failed to fetch articles");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filteredResults = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        (article.content &&
          article.content.toLowerCase().includes(lowercaseQuery)) ||
        (article.author?.name &&
          article.author.name.toLowerCase().includes(lowercaseQuery)) ||
        (article.category?.name &&
          article.category.name.toLowerCase().includes(lowercaseQuery))
    );

    setSearchResults(filteredResults);
    setCurrentPage(1);
    setPageInputValue("1");
    setIsSearching(true);
  }, [searchQuery, articles]);

  // Get total pages
  const totalPages = Math.ceil(searchResults.length / articlesPerPage);

  // Get current articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = searchResults.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setPageInputValue(nextPage.toString());
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setPageInputValue(prevPage.toString());
    }
  };

  // Handle input changes
  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };

  // Handle input submission
  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInputValue);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      // Reset to current page if invalid
      setPageInputValue(currentPage.toString());
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search query
      navigate(`/search-page?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearching(true);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "1d ago";
    if (diffDays <= 7) return `${diffDays}d ago`;

    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Function to extract a text excerpt from HTML content
  const getExcerpt = (content, maxLength = 100) => {
    if (!content) return "";

    // Remove HTML tags if present
    const plainText = content.replace(/<[^>]+>/g, "");

    if (plainText.length <= maxLength) return plainText;

    return plainText.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="breadcrumbs text-sm p-5">
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Search</a>
          </li>
        </ul>
      </div>

      {/* Search Input */}
      <div className="flex justify-center px-4 py-6">
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles, topics, authors..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>

      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <header className="flex items-center mb-5 px-4">
          <div className="bg-primarycus w-1 h-3 rounded-lg mx-2"></div>
          <h2 className="font-bold text-base md:text-lg">
            {searchQuery
              ? `Search Results for: "${searchQuery}" (${searchResults.length} results)`
              : "Search Results"}
          </h2>
        </header>

        {/* Articles Grid */}
        <main className="px-4">
          {searchQuery && searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-medium text-gray-600">
                No results found for "{searchQuery}"
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Try different keywords or browse our categories
              </p>
            </div>
          ) : searchQuery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {currentArticles.map((article) => (
                <NavLink
                  onClick={scrollToTop}
                  to={`/article/${article.slug}`}
                  key={article.id}
                  className="bg-white rounded-md overflow-hidden shadow-sm"
                >
                  {/* Article Image */}
                  <img
                    src={
                      article.thumbnail
                        ? `http://localhost:3000/${article.thumbnail}`
                        : "/api/placeholder/300/200"
                    }
                    alt={article.title}
                    className="w-full h-32 object-cover"
                  />

                  {/* Article Content */}
                  <div className="p-3">
                    <h3 className="font-medium text-xs leading-tight line-clamp-2 h-10 mb-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 h-8 mb-2">
                      {getExcerpt(article.content)}
                    </p>

                    {/* Author & Engagement */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <img
                          src={
                            article.author?.avatar
                              ? `http://localhost:3000/${article.author.avatar}`
                              : "/api/placeholder/24/24"
                          }
                          alt={article.author?.name || "Unknown Author"}
                          className="w-6 h-6 rounded-full mr-2 object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium">
                            {article.author?.name || "Unknown Author"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(article.published_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-medium text-gray-600">
                Enter a search term to find articles
              </p>
              <p className="text-sm text-gray-500 mt-2">
                You can search by title, content, author name, or category
              </p>
            </div>
          )}
        </main>

        {/* Pagination Controls - Only show when we have search results */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <ul className="flex justify-center gap-1 text-gray-900">
              <li>
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`grid size-8 place-content-center rounded border border-gray-200 transition-colors ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
              </li>

              <li>
                <form onSubmit={handlePageInputSubmit}>
                  <label htmlFor="PageInput">
                    <span className="sr-only">Page</span>
                    <input
                      type="text"
                      id="PageInput"
                      value={pageInputValue}
                      onChange={handlePageInputChange}
                      onBlur={handlePageInputSubmit}
                      className="h-8 w-16 rounded border border-gray-200 text-center sm:text-sm"
                    />
                  </label>
                </form>
              </li>

              <li className="flex items-center">
                <span className="text-sm text-gray-500">
                  of {totalPages || 1}
                </span>
              </li>

              <li>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`grid size-8 place-content-center rounded border border-gray-200 transition-colors ${
                    currentPage === totalPages || totalPages === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;
