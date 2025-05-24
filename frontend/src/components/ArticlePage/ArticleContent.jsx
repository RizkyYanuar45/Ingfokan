import { useState } from "react";
import { Heart, MessageCircle, Share2, BookmarkPlus } from "lucide-react";

export default function ArticleContent({ article, author, category }) {
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <h1 className="text-2xl md:text-3xl font-bold p-4 lg:p-6">
        {article.title}
      </h1>

      {/* Category Badge */}
      {category && (
        <div className="px-4 lg:px-6 pb-2">
          <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
            {category.name}
          </span>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative">
        <img
          src={
            `http://localhost:3000/${article.thumbnail}` ||
            "/api/placeholder/800/400"
          }
          alt={article.title}
          className="w-full h-auto object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-70 p-2 rounded-full">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-800">
              {formatDate(article.published_date)}
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-4 lg:p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500 mr-3">
            {author?.avatar && (
              <img
                src={`http://localhost:3000/${author.avatar}`}
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
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center text-gray-500 hover:text-red-500"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="ml-1 text-sm">{article.likes || 0}</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-blue-500">
              <MessageCircle className="w-5 h-5" />
              <span className="ml-1 text-sm">
                {article.comments_count || 0}
              </span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-green-500">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="flex items-center text-gray-500 hover:text-purple-500">
              <BookmarkPlus className="w-5 h-5" />
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
