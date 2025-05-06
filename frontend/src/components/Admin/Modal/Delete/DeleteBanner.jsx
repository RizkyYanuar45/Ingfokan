import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import handleDeleteBanner from "../../../../pages/Admin/utils/handleDeleteBanner";

export default function DeleteBanner({
  refreshBanner,
  currentBanner,
  closeModal,
  setNotification,
}) {
  // Use local notification state if setNotification is not provided
  const [localNotification, setLocalNotification] = useState(null);
  const notification = setNotification ? null : localNotification;

  const handleDelete = async () => {
    const result = await handleDeleteBanner(currentBanner.id);

    const notificationData = {
      type: result.type === "success" ? "success" : "error",
      message:
        result.type === "success"
          ? "Category deleted successfully!"
          : result.message || "Failed to delete category.",
    };

    if (setNotification) {
      setNotification(notificationData);
    } else {
      setLocalNotification(notificationData);
    }

    if (result.type === "success") {
      refreshBanner && refreshBanner();
      setTimeout(() => {
        closeModal();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      {/* Semi-transparent backdrop */}
      <div
        className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {/* Centered Modal Content */}
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative z-50">
        <h2 className="text-xl font-bold mb-4">Delete Category</h2>

        <div className="mb-6">
          <p className="mb-2">Are you sure you want to delete this category?</p>
          <p className="mb-2">This action cannot be undone.</p>

          {currentBanner && (
            <div className="bg-gray-100 p-3 rounded-md mt-4">
              <p className="mb-1">
                <span className="font-semibold">Name:</span>{" "}
                {currentBanner.name}
              </p>
              <p className="mb-1">
                <span className="font-semibold">ID:</span> {currentBanner.id}
              </p>
              {currentBanner.description && (
                <p className="mb-1">
                  <span className="font-semibold">Description:</span>{" "}
                  {currentBanner.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Delete Category
          </button>
        </div>
      </div>

      {/* Centered Notification */}
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-transparent backdrop-blur-sm"></div>
          <div className="relative z-60 max-w-md w-full mx-4">
            <div
              className={`flex items-center p-4 rounded-lg shadow-lg ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-6 h-6 mr-3" />
              ) : (
                <XCircle className="w-6 h-6 mr-3" />
              )}
              <span className="text-lg font-medium">
                {notification.message}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
