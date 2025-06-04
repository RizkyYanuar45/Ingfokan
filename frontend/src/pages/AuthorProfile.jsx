// src/App.jsx
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AuthorProfile() {
  const { slug } = useParams(); // Get slug from URL parameters
  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState(currentPage.toString());
  const articlesPerPage = 12; // 12 items per page (3 rows of 4 columns)
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        // Fetch author data
        const authorResponse = await fetch(
          `http://localhost:3000/api/author/slug/${slug}`
        );
        if (!authorResponse.ok) {
          throw new Error("Failed to fetch author data");
        }
        const authorData = await authorResponse.json();

        if (!authorData.success) {
          throw new Error(authorData.message || "Failed to fetch author data");
        }

        setAuthor(authorData.data.data);

        // Fetch articles by author
        const articlesResponse = await fetch(
          `http://localhost:3000/api/article/author?author_id=${authorData.data.data.id}`
        );
        if (!articlesResponse.ok) {
          throw new Error("Failed to fetch author's articles");
        }
        const articlesData = await articlesResponse.json();
        setArticles(articlesData);

        // Fetch banners
        const bannersResponse = await fetch(`http://localhost:3000/api/banner`);
        if (bannersResponse.ok) {
          const bannersData = await bannersResponse.json();
          if (bannersData.success) {
            // Filter only active banners
            const activeBanners = bannersData.data.data.filter(
              (banner) => banner.is_active === "active"
            );

            // Randomly select one banner from active banners
            if (activeBanners.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * activeBanners.length
              );
              const selectedBanner = activeBanners[randomIndex];
              setBanners([selectedBanner]); // Set as array with single banner
            }
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAuthorData();
    }
  }, [slug]);

  // Get current articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
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

  // Handle banner click
  const handleBannerClick = (banner) => {
    if (banner.link) {
      window.open(banner.link, "_blank", "noopener,noreferrer");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show no author found
  if (!author) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Author Not Found
            </h2>
            <p className="text-gray-700">
              The author you're looking for doesn't exist.
            </p>
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
            <a>Authors</a>
          </li>
          <li>
            <a>{author.name}</a>
          </li>
        </ul>
      </div>

      {/* Banner Section */}
      <div className="p-6 flex items-center justify-center">
        {banners.length > 0 ? (
          <div className="w-full max-w-[1440px] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="w-full cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => handleBannerClick(banner)}
              >
                <img
                  src={`http://localhost:3000/${banner.thumbnail}`}
                  alt="Banner"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-32 bg-yellow-400 text-center flex items-center justify-center text-lg font-medium"
                  style={{ display: "none" }}
                >
                  Banner
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-[1440px] h-32 bg-yellow-400 text-center flex items-center justify-center text-lg font-medium rounded-lg">
            Banner
          </div>
        )}
      </div>

      <div className="bg-gray-200 w-full flex items-center justify-evenly p-4">
        <div className="flex items-center">
          <img
            src={`http://localhost:3000/${author.avatar}`}
            alt={author.name}
            className="w-12 h-12 rounded-full mr-3 object-cover"
          />
          <p className="text-lg font-medium">{author.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Newspaper className="text-gray-600" />
          <p className="text-gray-700">Total Posts:</p>
          <p className="font-semibold">{articles.length}</p>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <header className="px-4 py-3">
          <h1 className="text-lg font-semibold">Latest Posts</h1>
        </header>

        {/* Articles Grid */}
        <main className="px-4">
          {articles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No articles found for this author.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {currentArticles.map((article) => (
                <NavLink
                  to={`/article/${article.slug}`}
                  key={article.id}
                  className="bg-white rounded-md overflow-hidden shadow-sm"
                >
                  {/* Article Image */}
                  <img
                    src={`http://localhost:3000/${article.thumbnail}`}
                    alt={article.title}
                    className="w-full h-32 object-cover"
                  />

                  {/* Article Content */}
                  <div className="p-3">
                    <h3 className="font-medium text-xs leading-tight line-clamp-2 h-10 mb-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 h-8 mb-2">
                      {article.content
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 100)}
                      ...
                    </p>

                    {/* Author & Publication Date */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <img
                          src={`http://localhost:3000/${author.avatar}`}
                          alt={author.name}
                          className="w-6 h-6 rounded-full mr-2 object-cover"
                        />
                        <div>
                          <p className="text-xs font-medium">{author.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              article.published_date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Heart size={14} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MessageCircle size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </main>

        {/* Pagination Controls - Only show if articles exist and more than one page */}
        {articles.length > 0 && totalPages > 1 && (
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
                  <label htmlFor="Page">
                    <span className="sr-only">Page</span>
                    <input
                      type="text"
                      id="Page"
                      value={pageInputValue}
                      onChange={handlePageInputChange}
                      onBlur={handlePageInputSubmit}
                      className="h-8 w-16 rounded border border-gray-200 text-center sm:text-sm"
                    />
                  </label>
                </form>
              </li>

              <li className="flex items-center">
                <span className="text-sm text-gray-500">of {totalPages}</span>
              </li>

              <li>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`grid size-8 place-content-center rounded border border-gray-200 transition-colors ${
                    currentPage === totalPages
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

export default AuthorProfile;
