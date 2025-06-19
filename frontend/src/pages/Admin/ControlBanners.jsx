import { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import SideBar from "../../components/Admin/SideBar";

import CreateBanner from "../../components/Admin/Modal/Create/CreateBanner";
import DeleteCategory from "../../components/Admin/Modal/Delete/DeleteBanner";

export default function ControlBanners() {
  const api = import.meta.env.VITE_API_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [banners, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState({
    id: null,
    name: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch banners data from API
  const refreshBanner = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/banner`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch banners");
      const data = await response.json();

      setCategories(data.data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    refreshBanner();
  }, []);

  //Filter banners based on search term
  const filteredCategories = banners.filter((banner) =>
    banner.link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages whenever filtered banners change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredCategories.length / itemsPerPage));
    // Reset to page 1 if search term changes
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [filteredCategories, itemsPerPage, searchTerm]);

  // Get banners for current page
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  };

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (isEdit = false, banner = null) => {
    if (isEdit && banner) {
      setCurrentBanner({ ...banner });
      setIsEditing(true);
    } else {
      setCurrentBanner({
        id: null,
        name: "",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };
  const openDeleteModal = (banner) => {
    setCurrentBanner(banner);
    setIsDeleteOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteOpen(false);
    setCurrentBanner({
      id: null,
      name: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBanner({
      ...currentBanner,
      [name]: value,
    });
  };

  // Handler for changing items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing item count
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Banners Management
              </h1>
              <p className="text-gray-600">Manage all your blog banners</p>
            </div>
            <button
              onClick={() => openModal(false)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Create banner</span>
            </button>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Link
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thumbnail
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentPageItems().length > 0 ? (
                    getCurrentPageItems().map((banner) => (
                      <tr
                        key={banner.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {banner.link}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {banner.thumbnail ? (
                            <div className="flex justify-center">
                              <img
                                src={`${backendUrl}/${banner.thumbnail.replace(
                                  /\\/g,
                                  "/"
                                )}`}
                                alt={banner.link}
                                className="h-14 w-28 object-cover border border-gray-200"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                          {banner.is_active === "active" ? (
                            <span className="text-green-500">Active</span>
                          ) : (
                            <span className="text-red-500">Not Active</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => openModal(true, banner)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-md hover:bg-indigo-50"
                              title="Edit banner"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(banner)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                              title="Delete banner"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No banners found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredCategories.length > 0 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                {/* Mobile pagination */}
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Desktop pagination */}
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {filteredCategories.length > 0
                          ? (currentPage - 1) * itemsPerPage + 1
                          : 0}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * itemsPerPage,
                          filteredCategories.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredCategories.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal for Create/Edit Category */}
      <CreateBanner
        isModalOpen={isModalOpen}
        isEditing={isEditing}
        currentBanner={currentBanner}
        handleInputChange={handleInputChange}
        closeModal={closeModal}
        refreshBanner={refreshBanner}
      />

      {/* Modal for Delete Category */}
      {isDeleteOpen && (
        <DeleteCategory
          isOpen={isDeleteOpen}
          currentBanner={currentBanner}
          closeModal={closeModal}
          refreshBanners={refreshBanner}
        />
      )}
    </div>
  );
}
