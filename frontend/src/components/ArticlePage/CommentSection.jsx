import { useState } from "react";
import { MessageCircle, Send, Heart } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function CommentSection({
  comments,
  loadingComments,
  currentUser,
  onCommentSubmit,
}) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    await onCommentSubmit(commentText);
    setCommentText("");
  };

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

  const getUsernameDisplay = (comment) => {
    if (comment.user && comment.user.name) {
      return comment.user.name;
    }
    return `User #${comment.user_id}`;
  };

  const getAvatarDisplay = (comment) => {
    if (comment.user && comment.user.avatar) {
      return `http://localhost:3000/${comment.user.avatar}`;
    }
    return `http://localhost:3000/api/placeholder/40/40`;
  };

  // Check if user is logged in
  const isLoggedIn = !!currentUser;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-4 lg:p-6 border-b">
        <h2 className="text-xl font-bold flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form - Only show if user is logged in */}
      {isLoggedIn && (
        <div className="p-4 lg:p-6 border-b">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-start mb-4">
              <img
                src={
                  currentUser && currentUser.avatar
                    ? `http://localhost:3000/${currentUser.avatar}`
                    : "http://localhost:3000/api/placeholder/40/40"
                }
                alt="Your Avatar"
                className="w-10 h-10 rounded-full bg-blue-500 mr-3 flex-shrink-0"
              />
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
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={commentText.trim() === ""}
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Login Message - Show if user is not logged in */}
      {!isLoggedIn && (
        <div className="p-4 lg:p-6 border-b bg-gray-50">
          <div className="text-center text-gray-600">
            <p className="mb-2">Please log in to join the discussion</p>
            <NavLink
              to={"/login"}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2"
            >
              Log In
            </NavLink>
          </div>
        </div>
      )}

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
                      src={getAvatarDisplay(comment)}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <h4 className="font-medium">
                        {getUsernameDisplay(comment)}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatRelativeDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.content}</p>
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
  );
}
