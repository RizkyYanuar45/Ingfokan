import { ChevronRight } from "lucide-react";

export default function Sidebar({ author, category, randomArticles }) {
  const formatRelativeDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "1 day ago";
    } else {
      return `${diffDays} days ago`;
    }
  };

  return (
    <div className="w-full lg:w-1/3 p-4 bg-white lg:bg-gray-50">
      <div className="lg:sticky lg:top-4">
        {/* Author Profile Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-red-500 mr-3">
              {author?.avatar && (
                <img
                  src={`http://localhost:3000/${author.avatar}`}
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="font-medium">{author?.name || "Unknown Author"}</p>
              <button className="mt-1 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                See Author
              </button>
            </div>
          </div>
          {author?.bio && (
            <p className="text-sm text-gray-600 mt-3">{author.bio}</p>
          )}
        </div>

        {/* Category Section */}
        {category && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="font-bold text-lg mb-2">Category</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gray-200 mr-3 flex-shrink-0">
                <img
                  src={`http://localhost:3000/${category.thumbnail}`}
                  alt={category.name}
                  className="w-12 h-12 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "http://localhost:3000/api/placeholder/48/48";
                  }}
                />
              </div>
              <div>
                <p className="font-medium capitalize">{category.name}</p>
                <p className="text-sm text-gray-500">Category</p>
              </div>
            </div>
          </div>
        )}

        {/* Random Posts */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="font-bold text-lg mb-4">Random Posts</h3>

          {randomArticles.length > 0
            ? randomArticles.map((randomArticle) => (
                <div
                  key={randomArticle.id}
                  className="flex items-start mb-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex-shrink-0">
                    <img
                      src={`http://localhost:3000/${randomArticle.thumbnail}`}
                      alt={randomArticle.title}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "http://localhost:3000/api/placeholder/64/64";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">
                      {randomArticle.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeDate(randomArticle.published_date)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0 mt-2" />
                </div>
              ))
            : // Show loading skeleton while fetching random articles
              Array(5)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start mb-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0"
                  >
                    <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-md mr-3 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4 mb-2"></div>
                      <div className="bg-gray-200 animate-pulse h-3 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
        </div>

        {/* Advertisement */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 rounded-lg shadow-md mb-4 text-white">
          <h3 className="font-bold text-lg mb-2">Subscribe Now</h3>
          <p className="text-sm mb-4">
            Get exclusive travel tips and destination guides delivered to your
            inbox
          </p>
          <button className="bg-white text-purple-600 font-medium py-2 px-4 rounded-lg w-full">
            Learn More
          </button>
        </div>

        {/* Second Advertisement */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 rounded-lg shadow-md text-white">
          <h3 className="font-bold text-lg mb-2">Summer Deals</h3>
          <p className="text-sm mb-4">
            Discover our exclusive summer packages with up to 30% off!
          </p>
          <button className="bg-white text-blue-600 font-medium py-2 px-4 rounded-lg w-full">
            View Offers
          </button>
        </div>
      </div>
    </div>
  );
}
