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
import TopNavigation from "../../components/Admin/TopNavigation";
import CreateAuthor from "../../components/Admin/Modal/Create/CreateAuthor";
import DeleteAuthor from "../../components/Admin/Modal/Delete/DeleteAuthor";
export default function ControlAuthors() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Initialize authors as an empty array
  const [authors, setAuthors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAuthors, setCurrentAuthors] = useState({
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

  // Fetch authors data from API
  const refreshAuthors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/author`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch authors");
      const data = await response.json();

      // Make sure data.data.author exists before setting state
      if (data.data && data.data.data) {
        setAuthors(data.data.data);
      } else {
        console.error("Invalid data structure received:", data);
        setAuthors([]); // Set to empty array if the expected structure is not present
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
      setAuthors([]); // Set to empty array on error
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    refreshAuthors();
  }, []);

  // Filter authors based on search term - with null check
  const filteredAuthors = authors
    ? authors.filter((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Calculate total pages whenever filtered authors change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredAuthors.length / itemsPerPage));
    // Reset to page 1 if search term changes
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [filteredAuthors, itemsPerPage, searchTerm]);

  // Get authors for current page
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAuthors.slice(startIndex, endIndex);
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

  const openModal = (isEdit = false, author = null) => {
    if (isEdit && author) {
      setCurrentAuthors({ ...author });
      setIsEditing(true);
    } else {
      setCurrentAuthors({
        id: null,
        name: "",
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };
  const openDeleteModal = (author) => {
    setCurrentAuthors(author);
    setIsDeleteOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteOpen(false);
    setCurrentAuthors({
      id: null,
      name: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAuthors({
      ...currentAuthors,
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
        {/* Top Navigation */}
        <TopNavigation toggleSidebar={toggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Authors Management
              </h1>
              <p className="text-gray-600">Manage all your blog authors</p>
            </div>
            <button
              onClick={() => openModal(false)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Create author</span>
            </button>
          </div>

          {/* Search Bar and Controls */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                  Show:
                </label>
                <select
                  id="itemsPerPage"
                  className="border border-gray-300 rounded-md text-sm p-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Authors Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Avatar
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
                    getCurrentPageItems().map((author) => (
                      <tr
                        key={author.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {author.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {author.avatar ? (
                            <div className="flex justify-center">
                              <img
                                src={`http://localhost:3000/${author.avatar.replace(
                                  /\\/g,
                                  "/"
                                )}`}
                                alt={author.name}
                                className="h-14 w-28 object-cover border border-gray-200"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => openModal(true, author)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-md hover:bg-indigo-50"
                              title="Edit author"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(author)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                              title="Delete author"
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
                        colSpan="3"
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No authors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredAuthors.length > 0 && (
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
                        {filteredAuthors.length > 0
                          ? (currentPage - 1) * itemsPerPage + 1
                          : 0}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * itemsPerPage,
                          filteredAuthors.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredAuthors.length}
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

      {/* Modal for Create/Edit Author */}
      <CreateAuthor
        isModalOpen={isModalOpen}
        isEditing={isEditing}
        currentAuthors={currentAuthors}
        handleInputChange={handleInputChange}
        closeModal={closeModal}
        refreshAuthors={refreshAuthors}
      />

      {/* Modal for Delete Author */}
      {isDeleteOpen && (
        <DeleteAuthor
          isOpen={isDeleteOpen}
          currentAuthors={currentAuthors}
          closeModal={closeModal}
          refreshAuthors={refreshAuthors}
        />
      )}
    </div>
  );
}
