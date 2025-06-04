import React, { useState, useEffect } from "react";
import { ChevronRight, BookmarkPlus } from "lucide-react";
import { NavLink } from "react-router-dom";

function NewPost() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/article");
        const data = await response.json();

        if (data.success) {
          // Filter artikel yang category.name === "trending"
          const trendingArticles = data.data.articles.filter(
            (article) => article.category?.name?.toLowerCase() === "trending"
          );

          // Urutkan berdasarkan published_date dan ambil 6 terbaru
          const sortedArticles = trendingArticles
            .sort(
              (a, b) => new Date(b.published_date) - new Date(a.published_date)
            )
            .slice(0, 6);

          setArticles(sortedArticles);
        } else {
          setError("Failed to fetch articles");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("An error occurred while fetching articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fungsi untuk mendapatkan excerpt yang lebih pendek dari konten artikel
  const getExcerpt = (content) => {
    if (!content) return "";

    // Menghapus semua tag HTML
    const strippedContent = content.replace(/<[^>]*>/g, "");

    // Memastikan teks tidak terlalu panjang (maximum 80 karakter)
    const maxLength = 80;
    if (strippedContent.length <= maxLength) {
      return strippedContent;
    }

    // Cari posisi spasi terakhir sebelum batas untuk memotong pada kata utuh
    let cutoff = strippedContent.lastIndexOf(" ", maxLength);
    if (cutoff === -1) cutoff = maxLength;

    return strippedContent.substring(0, cutoff) + "...";
  };

  // Format tanggal agar lebih readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold flex items-center">
            <span className="bg-secondarycus w-1 h-3 mr-2 rounded-lg"></span>
            Trending
          </h1>
          <NavLink
            to={`/category/trending`}
            className="text-gray-500 text-sm flex items-center"
          >
            Show All
            <ChevronRight size={16} className="ml-1" />
          </NavLink>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading articles...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No trending articles found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {articles.map((article) => (
              <NavLink
                to={`/article/${article.slug}`}
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={
                      article.thumbnail
                        ? `http://localhost:3000/${article.thumbnail}`
                        : "/api/placeholder/400/200"
                    }
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-secondarycus text-white text-xs px-2 py-1 rounded-full">
                    {article.category?.name || "Unknown Category"}
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="font-bold text-lg mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {getExcerpt(article.content)}
                  </p>

                  <div className="flex justify-between items-center">
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
                      <span className="text-xs text-gray-700">
                        {article.author?.name || "Unknown Author"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.published_date)}
                      </span>
                      <button className="text-gray-400 hover:text-blue-500">
                        <BookmarkPlus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewPost;
