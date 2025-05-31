import { useState } from "react";
import {
  MessageCircle,
  Send,
  Heart,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Custom Confirmation Modal Component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast Notification Component
function ToastNotification({ message, type = "error", isVisible, onClose }) {
  if (!isVisible) return null;

  const bgColor =
    type === "error"
      ? "bg-red-500"
      : type === "success"
      ? "bg-green-500"
      : "bg-primaycus-500";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transform transition-all duration-300`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function CommentSection({
  comments,
  loadingComments,
  currentUser,
  onCommentSubmit,
  onCommentDelete,
}) {
  const [commentText, setCommentText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingComments, setDeletingComments] = useState(new Set());
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    commentId: null,
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "error",
  });
  const commentsPerPage = 10;

  const showToast = (message, type = "error") => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    try {
      await onCommentSubmit(commentText);
      setCommentText("");
      setCurrentPage(1);
      showToast("Comment posted successfully!", "success");
    } catch (error) {
      showToast("Failed to post comment. Please try again.");
    }
  };

  const handleDeleteClick = (commentId) => {
    setConfirmModal({ isOpen: true, commentId });
  };

  const handleConfirmDelete = async () => {
    const commentId = confirmModal.commentId;
    setConfirmModal({ isOpen: false, commentId: null });

    if (!commentId) return;

    setDeletingComments((prev) => new Set([...prev, commentId]));

    try {
      const response = await fetch(
        `http://localhost:3000/api/comment/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        if (onCommentDelete) {
          onCommentDelete(commentId);
        }

        // Adjust pagination if we deleted the last comment on current page
        const remainingComments = comments.length - 1;
        const maxPagesAfterDelete = Math.ceil(
          remainingComments / commentsPerPage
        );
        if (currentPage > maxPagesAfterDelete && maxPagesAfterDelete > 0) {
          setCurrentPage(maxPagesAfterDelete);
        }

        showToast("Comment deleted successfully!", "success");
      } else {
        const errorData = await response.json();
        showToast(
          `Failed to delete comment: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Failed to delete comment. Please try again.");
    } finally {
      setDeletingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleCancelDelete = () => {
    setConfirmModal({ isOpen: false, commentId: null });
  };

  const formatRelativeDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0
      ? "Today"
      : diffDays === 1
      ? "1 day ago"
      : `${diffDays} days ago`;
  };

  const getUsernameDisplay = (comment) =>
    comment.user?.username || `User #${comment.user_id}`;

  const getAvatarDisplay = (comment) => {
    const avatar = comment.user?.avatar;
    if (avatar) {
      if (
        avatar.startsWith("uploads\\") ||
        avatar.startsWith("uploads/") ||
        avatar.startsWith("images\\") ||
        avatar.startsWith("images/")
      ) {
        const path = avatar.replace(/\\/g, "/");
        return `http://localhost:3000/${path}`;
      }
      return `http://localhost:3000/${avatar}`;
    }
    return `http://localhost:3000/api/placeholder/40/40`;
  };

  const canDeleteComment = (comment) => {
    return (
      currentUser &&
      (currentUser.id === comment.user_id || currentUser.role === "admin")
    );
  };

  const isLoggedIn = !!currentUser;

  // Pagination logic
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 lg:p-6 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Comments ({comments.length})
          </h2>
        </div>

        {isLoggedIn ? (
          <div className="p-4 lg:p-6 border-b">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="flex items-start mb-4">
                <img
                  src={
                    currentUser?.avatar
                      ? `http://localhost:3000/${currentUser.avatar}`
                      : "http://localhost:3000/api/placeholder/40/40"
                  }
                  alt="Your Avatar"
                  className="w-10 h-10 rounded-full bg-blue-500 mr-3 flex-shrink-0"
                />
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-secondarycus hover:bg-primarycus text-white font-medium rounded-lg px-4 py-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={commentText.trim() === ""}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-4 lg:p-6 border-b bg-gray-50 text-center text-gray-600">
            <p className="mb-2">Please log in to join the discussion</p>
            <NavLink
              to={"/login"}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 inline-block transition-colors"
            >
              Log In
            </NavLink>
          </div>
        )}

        <div className="divide-y">
          {loadingComments
            ? Array(3)
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
            : currentComments.map((comment) => (
                <div key={comment.id} className="p-4 lg:p-6">
                  <div className="flex items-start">
                    <img
                      src={getAvatarDisplay(comment)}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full mr-3"
                    />
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

                      {canDeleteComment(comment) && (
                        <div className="flex items-center text-sm text-red-500">
                          <button
                            onClick={() => handleDeleteClick(comment.id)}
                            disabled={deletingComments.has(comment.id)}
                            className="flex items-center mr-4 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <span>
                              {deletingComments.has(comment.id)
                                ? "Deleting..."
                                : "Delete Comment"}
                            </span>
                          </button>
                        </div>
                      )}
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

        {!loadingComments && comments.length > commentsPerPage && (
          <div className="flex justify-center items-center p-4 border-t">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  );
}
