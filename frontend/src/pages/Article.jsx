import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RelatedPost from "../components/RelatedPost";
import ArticleContent from "../components/ArticlePage/ArticleContent";
import CommentSection from "../components/ArticlePage/CommentSection";
import Sidebar from "../components/ArticlePage/SideBarComponent";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";

export default function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomArticles, setRandomArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch random articles for sidebar
  useEffect(() => {
    const fetchRandomArticles = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/article");
        if (!response.ok) throw new Error("Failed to fetch random articles");

        const data = await response.json();
        if (data.success && data.data && data.data.articles) {
          const allArticles = data.data.articles;
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

  // Fetch article data
  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/article/author-category/${slug}`
        );

        if (!response.ok) throw new Error("Failed to fetch article data");

        const data = await response.json();
        if (data.success && data.data && data.data.article) {
          const articleData = data.data.article;
          setArticle(articleData);

          if (articleData.author) setAuthor(articleData.author);
          if (articleData.category) setCategory(articleData.category);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticleData();
    }
  }, [slug]);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userId = getUserIdFromToken(token);
          if (userId) {
            const response = await fetch(
              `http://localhost:3000/api/user/${userId}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data && data.data.data) {
                setCurrentUser(data.data.data);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchCommentsWithUsers = async () => {
      if (!article || !article.id) return;

      setLoadingComments(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/comment/user/${article.id}`
        );

        if (!response.ok) throw new Error("Failed to fetch comments");

        const data = await response.json();
        if (data.success && data.data && data.data.comment) {
          setComments(data.data.comment);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchCommentsWithUsers();
  }, [article]);

  const handleCommentSubmit = async (commentText) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to post a comment");
        return;
      }

      const commentData = {
        article_id: article.id,
        content: commentText,
      };

      const response = await fetch("http://localhost:3000/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const data = await response.json();
      if (data.success) {
        // Create the new comment with current user data
        const newComment = {
          ...data.data.comment,
          user: currentUser, // Attach current user data to the new comment
        };

        // Add the new comment to the top of the comments list
        setComments([newComment, ...comments]);
      } else {
        throw new Error(data.message || "Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment: " + err.message);
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
            <ArticleContent
              article={article}
              author={author}
              category={category}
              user={currentUser}
            />

            <CommentSection
              comments={comments}
              loadingComments={loadingComments}
              currentUser={currentUser}
              onCommentSubmit={handleCommentSubmit}
            />
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar
          author={author}
          category={category}
          randomArticles={randomArticles}
        />
      </div>

      <RelatedPost authorId={article.author_id} />
      <Footer />
    </div>
  );
}
