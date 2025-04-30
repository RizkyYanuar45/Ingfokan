import { useState } from "react";
import {
  FileText,
  Users,
  Tag,
  Eye,
  Trash2,
  Edit,
  PlusCircle,
  Search,
  Filter,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";

import SideBar from "../../components/Admin/SideBar";
import TopNavigation from "../../components/Admin/TopNavigation";

export default function ControlBanners() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "10 Tips for Better News Writing",
      category: "Journalism",
      categoryColor: "blue",
      author: "Alex Johnson",
      status: "Published",
      statusColor: "green",
      date: "Apr 12, 2025",
    },
    {
      id: 2,
      title: "Breaking: New Technology Advances",
      category: "Technology",
      categoryColor: "purple",
      author: "Sarah Miller",
      status: "Published",
      statusColor: "green",
      date: "Apr 15, 2025",
    },
    {
      id: 3,
      title: "Global Economic Forecast 2025",
      category: "Business",
      categoryColor: "yellow",
      author: "Robert Chen",
      status: "Draft",
      statusColor: "yellow",
      date: "Apr 16, 2025",
    },
    {
      id: 4,
      title: "Sports Update: Championship Results",
      category: "Sports",
      categoryColor: "red",
      author: "Michael Torres",
      status: "Under Review",
      statusColor: "gray",
      date: "Apr 14, 2025",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentArticle, setCurrentArticle] = useState({
    id: null,
    title: "",
    category: "",
    author: "",
    status: "Draft",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  });
  const [isEditing, setIsEditing] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (isEdit = false, article = null) => {
    if (isEdit && article) {
      setCurrentArticle({ ...article });
      setIsEditing(true);
    } else {
      setCurrentArticle({
        id:
          articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1,
        title: "",
        category: "",
        author: "",
        status: "Draft",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentArticle({
      id: null,
      title: "",
      category: "",
      author: "",
      status: "Draft",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentArticle({
      ...currentArticle,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (isEditing) {
      setArticles(
        articles.map((article) =>
          article.id === currentArticle.id ? currentArticle : article
        )
      );
    } else {
      setArticles([...articles, currentArticle]);
    }
    closeModal();
  };

  const deleteArticle = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter((article) => article.id !== id));
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Journalism: "blue",
      Technology: "purple",
      Business: "yellow",
      Sports: "red",
      Politics: "indigo",
      Entertainment: "pink",
      Health: "green",
      Science: "cyan",
    };
    return colors[category] || "gray";
  };

  const getStatusColor = (status) => {
    const colors = {
      Published: "green",
      Draft: "yellow",
      "Under Review": "gray",
      Rejected: "red",
    };
    return colors[status] || "gray";
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
                Banner Management
              </h1>
              <p className="text-gray-600">Manage all your blog articles</p>
            </div>
            <button
              onClick={() => openModal(false)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Create Article</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">
                    Total Articles
                  </h2>
                  <p className="text-2xl font-semibold text-gray-800">
                    {articles.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">
                    Published
                  </h2>
                  <p className="text-2xl font-semibold text-gray-800">
                    {articles.filter((a) => a.status === "Published").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Drafts</h2>
                  <p className="text-2xl font-semibold text-gray-800">
                    {articles.filter((a) => a.status === "Draft").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Tag className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">
                    Categories
                  </h2>
                  <p className="text-2xl font-semibold text-gray-800">
                    {new Set(articles.map((a) => a.category)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">All Categories</option>
                  <option value="Journalism">Journalism</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Sports">Sports</option>
                </select>
                <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => {
                      const categoryColor = `bg-${
                        article.categoryColor ||
                        getCategoryColor(article.category)
                      }-100 text-${
                        article.categoryColor ||
                        getCategoryColor(article.category)
                      }-800`;
                      const statusColor = `bg-${
                        article.statusColor || getStatusColor(article.status)
                      }-100 text-${
                        article.statusColor || getStatusColor(article.status)
                      }-800`;

                      return (
                        <tr key={article.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {article.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColor}`}
                            >
                              {article.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {article.author}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
                            >
                              {article.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {article.date}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => openModal(true, article)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => deleteArticle(article.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No articles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">
                      {filteredArticles.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredArticles.length}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Create/Edit Article */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {isEditing ? "Edit Article" : "Create New Article"}
                    </h3>
                    <div className="mt-2 space-y-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Article Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={currentArticle.title}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="Enter article title"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={currentArticle.category}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select a category</option>
                          <option value="Journalism">Journalism</option>
                          <option value="Technology">Technology</option>
                          <option value="Business">Business</option>
                          <option value="Sports">Sports</option>
                          <option value="Politics">Politics</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Health">Health</option>
                          <option value="Science">Science</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="author"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Author
                        </label>
                        <input
                          type="text"
                          name="author"
                          id="author"
                          value={currentArticle.author}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                          placeholder="Enter author name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={currentArticle.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Published">Published</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
