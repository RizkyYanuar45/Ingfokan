import { useState, useEffect } from "react";
import { Share2, BookmarkPlus, Bookmark } from "lucide-react";

export default function ArticleContent({ article, author, category, user }) {
  const api = import.meta.env.VITE_API_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isCheckingBookmark, setIsCheckingBookmark] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const checkBookmarkStatus = async () => {
    if (!user?.id || !article?.id) return;

    setIsCheckingBookmark(true);

    try {
      const response = await fetch(`${api}/favorite/user/${user.id}`);

      if (response.ok) {
        const json = await response.json();
        const favoriteArticles = json.data?.result || [];

        console.log("Favorite articles from API:", favoriteArticles);
        console.log("Current article ID:", article.id);

        const isCurrentArticleBookmarked = favoriteArticles.some((fav) => {
          const favId = fav.article_id;
          return String(favId) === String(article.id);
        });

        setIsBookmarked(isCurrentArticleBookmarked);
      } else {
        console.error(
          "Failed to fetch user favorites, status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    } finally {
      setIsCheckingBookmark(false);
    }
  };

  useEffect(() => {
    if (user?.id && article?.id) {
      checkBookmarkStatus();
    }
  }, [user?.id, article?.id]);

  const handleBookmark = async () => {
    if (!user?.id || !article?.id || isBookmarking) return;

    setIsBookmarking(true);

    try {
      let response;

      if (isBookmarked) {
        // Remove bookmark - menggunakan method DELETE
        response = await fetch(`${api}/favorite/${article.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            article_id: article.id,
          }),
        });
      } else {
        // Add bookmark - menggunakan method POST
        response = await fetch(`${api}/favorite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            article_id: article.id,
          }),
        });
      }

      if (response.ok) {
        setIsBookmarked((prev) => !prev);
        console.log("Bookmark status updated successfully");
      } else {
        const errorData = await response.text();
        console.error(
          "Failed to update bookmark status:",
          response.status,
          errorData
        );
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <article
      key={article.id}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
    >
      <h1 className="text-2xl md:text-3xl font-bold p-4 lg:p-6">
        {article.title}
      </h1>

      {category && (
        <div className="px-4 lg:px-6 pb-2">
          <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
            {category.name}
          </span>
        </div>
      )}

      <div className="relative">
        <img
          src={
            article.thumbnail
              ? `${backendUrl}/${article.thumbnail}`
              : "/api/placeholder/800/400"
          }
          alt={article.title}
          className="w-full h-auto object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-70 p-2 rounded-full">
          <span className="text-sm font-medium text-gray-800">
            {formatDate(article.published_date)}
          </span>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500 mr-3">
            {author?.avatar && (
              <img
                src={`${backendUrl}/${author.avatar}`}
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-medium">{author?.name || "Unknown Author"}</p>
            <p className="text-xs text-gray-500">Writer</p>
          </div>
          <div className="ml-auto flex space-x-3">
            <button className="flex items-center text-gray-500 hover:text-green-500">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleBookmark}
              disabled={isBookmarking || isCheckingBookmark}
              className={`flex items-center transition-colors ${
                isBookmarked
                  ? "text-purple-500 hover:text-purple-600"
                  : "text-gray-500 hover:text-purple-500"
              } ${
                isBookmarking || isCheckingBookmark
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isBookmarked ? (
                <Bookmark className="w-5 h-5" fill="currentColor" />
              ) : (
                <BookmarkPlus className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div
          className="text-gray-700 mb-6"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </article>
  );
}
