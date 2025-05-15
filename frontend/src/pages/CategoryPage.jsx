import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import Office from "../assets/Office.jpg";

function CategoryPage() {
  const { slug } = useParams(); // Get the category slug from URL parameters
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articlesWithAuthors, setArticlesWithAuthors] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState(currentPage.toString());
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 12; // 12 items per page (3 rows of 4 columns)

  // Two-step fetch process: First get category by slug, then get articles by category_id
  useEffect(() => {
    const fetchCategoryAndArticles = async () => {
      setLoading(true);
      try {
        // Step 1: Fetch the category by slug to get its ID
        const categoryResponse = await fetch(
          `http://localhost:3000/api/category/slug/${slug}`
        );

        if (!categoryResponse.ok) {
          throw new Error(
            `Failed to fetch category: ${categoryResponse.status}`
          );
        }

        const categoryData = await categoryResponse.json();
        setCategory(categoryData.data);

        // Step 2: Use the category ID to fetch all articles with that category_id
        const articlesResponse = await fetch(
          `http://localhost:3000/api/article/category?category_id=${categoryData.data.id}`
        );

        if (!articlesResponse.ok) {
          throw new Error(
            `Failed to fetch articles: ${articlesResponse.status}`
          );
        }

        const articlesData = await articlesResponse.json();
        // Ensure articlesData is an array before setting it
        const articlesArray = Array.isArray(articlesData) ? articlesData : [];
        setArticles(articlesArray);
        setTotalPages(Math.ceil(articlesArray.length / articlesPerPage));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndArticles();
    }
  }, [slug]);

  useEffect(() => {
    const fetchAuthorsForArticles = async () => {
      if (!Array.isArray(articles) || articles.length === 0) return;

      try {
        const articlesWithAuthorData = await Promise.all(
          articles.map(async (article) => {
            try {
              const authorResponse = await fetch(
                `http://localhost:3000/api/author/${article.author_id}`
              );

              if (!authorResponse.ok) {
                throw new Error(
                  `Failed to fetch author: ${authorResponse.status}`
                );
              }

              const authorData = await authorResponse.json();

              // Corrected data access - use authorData.data directly
              return {
                ...article,
                author: authorData.data.data || {
                  // Changed from authorData.data.data
                  name: "Unknown Author",
                  avatar: "https://placehold.co/100?text=?",
                },
              };
            } catch (err) {
              console.error(
                `Error fetching author for article ${article.id}:`,
                err
              );
              return {
                ...article,
                author: {
                  name: "Unknown Author",
                  avatar: "https://placehold.co/100?text=?",
                },
              };
            }
          })
        );

        setArticlesWithAuthors(articlesWithAuthorData);
      } catch (err) {
        console.error("Error fetching authors:", err);
      }
    };

    fetchAuthorsForArticles();
  }, [articles]);

  // Get current articles for pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articlesWithAuthors.slice(
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
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Navbar />
      <div className="breadcrumbs text-sm p-5">
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>{category ? category.name : slug}</a>
          </li>
        </ul>
      </div>
      <div className="p-6 flex items-center justify-center">
        <div className="w-[1440px] h-32 bg-yellow-400 text-center  ">
          Banner
        </div>
      </div>
      <div className=" flex">
        <h1></h1>
      </div>
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <header className="flex items-center mb-5">
          <div className="bg-primarycus w-1 h-3 rounded-4xl mx-2"></div>
          <h2 className="font-bold text-base md:text-lg">
            Category : {category ? category.name : slug}
          </h2>
        </header>

        {/* Articles Grid */}
        <main className="px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading articles...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : articlesWithAuthors.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No articles found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {currentArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-md overflow-hidden shadow-sm"
                >
                  {/* Article Image */}
                  <img
                    src={
                      article.thumbnail
                        ? `http://localhost:3000/${article.thumbnail.replace(
                            /\\/g,
                            "/"
                          )}`
                        : "https://placehold.co/300x200?text=No+Image"
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
                      {article.content
                        ? article.content.substring(0, 100) + "..."
                        : "No excerpt available"}
                    </p>

                    {/* Author & Engagement */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <img
                          src={
                            article.author?.avatar
                              ? `http://localhost:3000/${article.author.avatar.replace(
                                  /\\/g,
                                  "/"
                                )}`
                              : "https://placehold.co/100?text=?"
                          }
                          alt={article.author?.name || "Unknown Author"}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <div>
                          <p className="text-xs font-medium">
                            {article.author?.name || "Unknown Author"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(article.published_date) || "No date"}
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
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Pagination Controls - Only show if articles exist AND there's more than one page */}
        {!loading &&
          !error &&
          articlesWithAuthors.length > 0 &&
          totalPages > 1 && (
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

export default CategoryPage;
