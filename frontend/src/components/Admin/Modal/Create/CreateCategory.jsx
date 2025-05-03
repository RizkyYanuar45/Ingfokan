import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

export default function CreateCategory({
  isModalOpen,
  isEditing,
  currentCategory,
  handleInputChange,
  closeModal,
  refreshCategories,
}) {
  const api = import.meta.env.VITE_API_URL;
  const [thumbnail, setThumbnail] = useState(null);

  // Reset thumbnail saat modal dibuka/tutup atau currentCategory berubah
  useEffect(() => {
    setThumbnail(null);
  }, [isModalOpen, currentCategory]);

  // Modifikasi pada handleCreate untuk melihat detail error
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentCategory.name);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    // Log formData untuk debug
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch(`${api}/category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Jangan set Content-Type saat pakai FormData
        },
        body: formData,
      });

      // Cek status response
      console.log("Response status:", response.status);

      // Ambil response text terlebih dahulu (karena mungkin bukan JSON yang valid)
      const responseText = await response.text();
      console.log("Response text:", responseText);

      // Coba parse sebagai JSON jika memungkinkan
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Response data:", data);
      } catch (e) {
        console.log("Response bukan JSON yang valid");
      }

      if (response.ok) {
        console.log("Category created successfully:", data);
        // if (refreshCategories) refreshCategories();
        closeModal();
      } else {
        console.error(
          "Failed to create category:",
          data?.message || responseText
        );
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentCategory.name);
    if (thumbnail) {
      formData.append("image", thumbnail);
    }
    try {
      const response = await fetch(`${api}/category/${currentCategory.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Jangan set Content-Type saat pakai FormData
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Category updated successfully:", data);
        refreshCategories();
        closeModal();
      } else {
        console.error("Failed to update category:", data.message);
      }
    } catch (error) {
      console.error("Error updating category:", error);
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
        <form
          onSubmit={isEditing ? handleEdit : handleCreate}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {isEditing ? "Edit Category" : "Create New Category"}
                </h3>
                <div className="mt-2 space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={currentCategory.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="Enter category name"
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
                      className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                    />
                    {/* Preview Image */}
                    {thumbnail && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(thumbnail)}
                          alt="Preview"
                          className="w-32 h-32 object-cover"
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
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
