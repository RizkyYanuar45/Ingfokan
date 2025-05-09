import React, { useState, useEffect } from "react";
import { Save, X, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function CreateAuthor({
  isModalOpen,
  isEditing,
  currentAuthor,
  handleInputChange,
  closeModal,
  refreshAuthors,
}) {
  const api = import.meta.env.VITE_API_URL;
  const [thumbnail, setThumbnail] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    setThumbnail(null);
    setNotification(null);
  }, [isModalOpen, currentAuthor]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentAuthor.name);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(`${api}/author`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {}

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Author created successfully!",
        });
        refreshAuthors && refreshAuthors();
        setTimeout(() => {
          closeModal();
        }, 3000);
      } else {
        setNotification({
          type: "error",
          message: data?.message || responseText || "Failed to create author.",
        });
      }
    } catch (error) {
      setNotification({ type: "error", message: "Error creating author." });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentAuthor.name);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    try {
      const response = await fetch(`${api}/author/${currentAuthor.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setNotification({
          type: "success",
          message: "Author updated successfully!",
        });
        refreshAuthors();
        setTimeout(() => {
          closeModal();
        }, 3000);
      } else {
        setNotification({
          type: "error",
          message: data.message || "Failed to update author.",
        });
      }
    } catch (error) {
      setNotification({ type: "error", message: "Error updating author." });
    }
  };

  if (!isModalOpen) return null;

  // For demonstration purpose
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleEdit(e);
    } else {
      handleCreate(e);
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {isEditing ? "Edit Author" : "Create New Author"}
                </h3>

                {/* Enhanced Notification */}
                {notification && (
                  <div
                    className={`mb-4 flex items-center justify-between p-4 rounded-md shadow-md transform transition-all duration-300 ease-in-out ${
                      notification.type === "success"
                        ? "bg-emerald-50 border-l-4 border-emerald-500"
                        : "bg-red-50 border-l-4 border-red-500"
                    }`}
                  >
                    <div className="flex items-center">
                      {notification.type === "success" ? (
                        <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                      )}
                      <p
                        className={`text-sm font-medium ${
                          notification.type === "success"
                            ? "text-emerald-800"
                            : "text-red-800"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotification(null)}
                      className="focus:outline-none"
                      type="button"
                    >
                      <XCircle
                        className={`w-4 h-4 ${
                          notification.type === "success"
                            ? "text-emerald-400"
                            : "text-red-400"
                        } hover:opacity-75 transition-opacity`}
                      />
                    </button>
                  </div>
                )}

                <div className="mt-2 space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Author Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={currentAuthor.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Thumbnail
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={(e) => setThumbnail(e.target.files[0])}
                      className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none p-2"
                    />
                    {thumbnail && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(thumbnail)}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
