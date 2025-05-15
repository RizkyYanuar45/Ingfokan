import React, { useState, useEffect } from "react";
import { ChevronRight, BookmarkPlus } from "lucide-react";

function NewPost() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]); // State untuk kategori
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories
        const categoryResponse = await fetch(
          "http://localhost:3000/api/category"
        );
        const categoryData = await categoryResponse.json();

        if (categoryData.success) {
          const categoriesData = categoryData.data.category; // Sesuaikan dengan struktur API Anda
          setCategories(categoriesData);

          // Cari category_id untuk kategori "trending"
          const trendingCategory = categoriesData.find(
            (cat) => cat.name.toLowerCase() === "trending"
          );

          if (!trendingCategory) {
            setError('Category "trending" not found');
            setLoading(false);
            return;
          }

          // Fetch all articles
          const articlesResponse = await fetch(
            "http://localhost:3000/api/article"
          );
          const articlesData = await articlesResponse.json();

          if (articlesData.success) {
            // Filter artikel yang category_id-nya sama dengan trendingCategory.id
            const filteredArticles = articlesData.data.article.filter(
              (article) => article.category_id === trendingCategory.id
            );

            // Urutkan berdasarkan published_date dan ambil 6 terbaru
            const sortedArticles = filteredArticles
              .sort(
                (a, b) =>
                  new Date(b.published_date) - new Date(a.published_date)
              )
              .slice(0, 6);

            // Fetch author details untuk setiap artikel
            const articlesWithAuthors = await Promise.all(
              sortedArticles.map(async (article) => {
                try {
                  const authorResponse = await fetch(
                    `http://localhost:3000/api/author/${article.author_id}`
                  );
                  const authorData = await authorResponse.json();

                  return {
                    ...article,
                    author: authorData.success
                      ? authorData.data.data
                      : {
                          name: "Unknown Author",
                          avatar: null,
                        },
                  };
                } catch (error) {
                  console.error(
                    `Error fetching author for article ${article.id}:`,
                    error
                  );
                  return {
                    ...article,
                    author: {
                      name: "Unknown Author",
                      avatar: null,
                    },
                  };
                }
              })
            );

            setArticles(articlesWithAuthors);
          } else {
            setError("Failed to fetch articles");
          }
        } else {
          setError("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk mendapatkan excerpt dari konten artikel
  const getExcerpt = (content) => {
    if (!content) return "";

    if (content.includes("<p>")) {
      const match = content.match(/<p>(.*?)<\/p>/);
      if (match && match[1]) {
        return match[1];
      }
    }

    return content.substring(0, 100) + (content.length > 100 ? "..." : "");
  };

  // Format tanggal agar lebih readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fungsi untuk mendapatkan nama kategori berdasarkan category_id
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold flex items-center">
            <span className="bg-primarycus w-1 h-3 mr-2 rounded-lg"></span>
            Trending
          </h1>
          <button className="text-gray-500 text-sm flex items-center">
            Show All
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading articles...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={
                      article.thumbnail
                        ? `http://localhost:3000/${article.thumbnail}`
                        : "/placeholder-image.jpg"
                    }
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-primarycus text-white text-xs px-2 py-1 rounded-full">
                    {getCategoryName(article.category_id)}
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
                            : "/default-avatar.jpg"
                        }
                        alt={article.author?.name || "Unknown Author"}
                        className="w-6 h-6 rounded-full mr-2"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewPost;
