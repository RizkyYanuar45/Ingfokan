import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  ChevronRight,
  Send,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RelatedPost from "../components/RelatedPost";

export default function Article() {
  const { slug } = useParams(); // Get slug from URL params
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomArticles, setRandomArticles] = useState([]);

  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Fetch random articles for sidebar
  useEffect(() => {
    const fetchRandomArticles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/article");

        if (!response.ok) {
          throw new Error("Failed to fetch random articles");
        }

        const data = await response.json();

        if (data.success && data.data && data.data.article) {
          // Get all articles
          const allArticles = data.data.article;

          // Shuffle array and take first 5
          const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 5);

          setRandomArticles(selected);
        }
      } catch (err) {
        console.error("Error fetching random articles:", err);
      }
    };

    fetchRandomArticles();
  }, []);

  // Fetch article data and then author data
  useEffect(() => {
    const fetchArticleAndAuthor = async () => {
      setLoading(true);
      try {
        // Fetch article data using slug
        const articleResponse = await fetch(
          `http://localhost:3000/api/article/slug/${slug}`
        );

        if (!articleResponse.ok) {
          throw new Error("Failed to fetch article data");
        }

        const articleData = await articleResponse.json();
        setArticle(articleData.data.article);

        // Fetch author data using author_id from article
        if (articleData.data.article.author_id) {
          const authorResponse = await fetch(
            `http://localhost:3000/api/author/${articleData.data.article.author_id}`
          );

          if (!authorResponse.ok) {
            throw new Error("Failed to fetch author data");
          }

          const authorData = await authorResponse.json();
          setAuthor(authorData.data.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticleAndAuthor();
    }
  }, [slug]);

  // Fetch comments for the article
  useEffect(() => {
    const fetchComments = async () => {
      if (!article || !article.id) return;

      setLoadingComments(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/article/comment/${article.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await response.json();

        if (data.success && data.data && data.data.comments) {
          setComments(data.data.comments);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [article]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    // You would typically send this to your API
    // For now, we'll just add it to the local state
    const newComment = {
      id: Date.now(), // Temporary ID
      content: commentText,
      user_id: 1, // Assuming logged in user has ID 1
      article_id: article.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComments([newComment, ...comments]);
    setCommentText("");

    // Here you would make an API call to save the comment
    // Example:
    // fetch('http://localhost:3000/api/article/comment', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     content: commentText,
    //     article_id: article.id,
    //     user_id: 1, // You would get this from authentication context
    //   }),
    // })
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date as "X days ago"
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

  // Show loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-xl font-medium text-gray-600">
            Loading article...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-xl font-medium text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!article) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-xl font-medium text-gray-600">
            Article not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Article */}
            <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <h1 className="text-2xl md:text-3xl font-bold p-4 lg:p-6">
                {article.title}
              </h1>

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
                    <p className="font-medium">
                      {author?.name || "Unknown Author"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {author?.role || "Writer"}
                    </p>
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
                      <span className="ml-1 text-sm">{comments.length}</span>
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

            {/* Comment Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 lg:p-6 border-b">
                <h2 className="text-xl font-bold flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Comments ({comments.length})
                </h2>
              </div>

              {/* Comment Form */}
              <div className="p-4 lg:p-6 border-b">
                <form onSubmit={handleCommentSubmit} className="flex flex-col">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 flex items-center"
                      disabled={commentText.trim() === ""}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="divide-y">
                {loadingComments
                  ? // Loading skeleton for comments
                    Array(3)
                      .fill()
                      .map((_, index) => (
                        <div key={index} className="p-4 lg:p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center mb-1">
                                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                                <div className="bg-gray-200 animate-pulse h-3 w-16 rounded ml-2"></div>
                              </div>
                              <div className="bg-gray-200 animate-pulse h-4 w-full rounded mb-3"></div>
                              <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded"></div>
                            </div>
                          </div>
                        </div>
                      ))
                  : comments.map((comment) => (
                      <div key={comment.id} className="p-4 lg:p-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <img
                              src="/api/placeholder/40/40"
                              alt="User Avatar"
                              className="w-10 h-10 rounded-full"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center mb-1">
                              <h4 className="font-medium">
                                User #{comment.user_id}
                              </h4>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatRelativeDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {comment.content}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <button className="flex items-center mr-4 hover:text-red-500">
                                <Heart className="w-4 h-4 mr-1" />
                                <span>Like</span>
                              </button>
                              <button className="flex items-center mr-4 hover:text-blue-500">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                <span>Reply</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                {!loadingComments && comments.length === 0 && (
                  <div className="p-4 lg:p-6 text-center text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
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
                  <p className="font-medium">
                    {author?.name || "Unknown Author"}
                  </p>
                  <button className="mt-1 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    Follow
                  </button>
                </div>
              </div>
              {author?.bio && (
                <p className="text-sm text-gray-600 mt-3">{author.bio}</p>
              )}
            </div>

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
                            e.target.src = "/api/placeholder/64/64";
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
                Get exclusive travel tips and destination guides delivered to
                your inbox
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
      </div>
      <RelatedPost authorId={article.author_id} />
      <Footer />
    </div>
  );
}
