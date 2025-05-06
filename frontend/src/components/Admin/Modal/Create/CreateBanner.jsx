import React, { useState, useEffect } from "react";
import { Save, X, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function CreateBanner({
  isModalOpen,
  isEditing,
  currentBanner,
  handleInputChange,
  closeModal,
  refreshBanner,
}) {
  const api = import.meta.env.VITE_API_URL;
  const [thumbnail, setThumbnail] = useState(null);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Reset state when modal opens or current category changes
    if (isModalOpen) {
      setThumbnail(null);
      setNotification(null);
    }
  }, [isModalOpen, currentBanner]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setThumbnail(file);
    }
  };

  // Handle form input changes
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;

    // Pass directly to parent handler
    handleInputChange({
      target: {
        name,
        value,
      },
    });
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setThumbnail(e.dataTransfer.files[0]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("link", currentBanner.link);
    formData.append("is_active", currentBanner.is_active);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(`${api}/banner`, {
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
      } catch (error) {
        console.error("Error parsing response:", error);
      }

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Banner created successfully!",
        });
        refreshBanner && refreshBanner();
        setTimeout(() => {
          closeModal();
        }, 3000);
      } else {
        setNotification({
          type: "error",
          message: data?.message || responseText || "Failed to create Banner.",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: `Error creating Banner: ${error.message}`,
      });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("link", currentBanner.link);
    formData.append("is_active", currentBanner.is_active);
    if (thumbnail) {
      // Using "thumbnail" key to match the model field name
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(`${api}/banner/${currentBanner.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      let data;
      try {
        const responseText = await response.text();
        data = JSON.parse(responseText);
      } catch (error) {
        console.error("Error parsing response:", error);
      }

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Banner updated successfully!",
        });
        refreshBanner && refreshBanner();
        setTimeout(() => {
          closeModal();
        }, 3000);
      } else {
        setNotification({
          type: "error",
          message: data?.message || "Failed to update banner.",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: `Error updating banner: ${error.message}`,
      });
    }
  };

  // For demonstration purpose
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleEdit(e);
    } else {
      handleCreate(e);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isEditing ? "Edit Banner" : "Create New Banner"}
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
                        htmlFor="link"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Link
                      </label>
                      <input
                        type="url"
                        name="link"
                        id="link"
                        value={currentBanner.link || ""}
                        onChange={handleFormInputChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="Enter banner link"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="is_active"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <select
                        name="is_active"
                        id="is_active"
                        value={currentBanner.is_active || "active"}
                        onChange={handleFormInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="not_active">Not Active</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="thumbnail"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Thumbnail
                      </label>
                      <div
                        className={`flex flex-col items-center rounded border ${
                          dragActive
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300"
                        } p-4 text-gray-900 shadow-sm sm:p-6 transition-colors duration-200`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                          />
                        </svg>
                        <span className="mt-4 font-medium">
                          Upload your file(s) or drag & drop
                        </span>
                        <label
                          htmlFor="file-upload"
                          className="mt-2 inline-block rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-center text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100 cursor-pointer"
                        >
                          Browse files
                          <input
                            id="file-upload"
                            name="thumbnail"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    {thumbnail && (
                      <div>
                        <label
                          htmlFor="preview"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Preview
                        </label>
                        <div className="mt-1">
                          <img
                            src={URL.createObjectURL(thumbnail)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md border border-gray-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
}
