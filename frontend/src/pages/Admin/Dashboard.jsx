import { useState, useEffect } from "react";
import { FileText, Users, Tag, Eye } from "lucide-react";

import SideBar from "../../components/Admin/SideBar";
import TopNavigation from "../../components/Admin/TopNavigation";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryNames, setCategoryNames] = useState({});
  const [authorNames, setAuthorNames] = useState({});

  // State for API data
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentArticles, setRecentArticles] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Modified to update state instead of returning directly
  const fetchCategoryName = async (categoryId) => {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!result.ok) {
        throw new Error("Failed to fetch category");
      }
      const data = await result.json();
      setCategoryNames((prev) => ({ ...prev, [categoryId]: data.data.name }));
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategoryNames((prev) => ({ ...prev, [categoryId]: "Unknown" }));
    }
  };

  // Modified to update state instead of returning directly
  const fetchAuthorName = async (authorId) => {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/author/${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!result.ok) {
        throw new Error("Failed to fetch author");
      }
      const data = await result.json();
      setAuthorNames((prev) => ({ ...prev, [authorId]: data.data.data.name }));
    } catch (error) {
      console.error("Error fetching author:", error);
      setAuthorNames((prev) => ({ ...prev, [authorId]: "Unknown" }));
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data from all endpoints
        const [
          articlesResponse,
          usersResponse,
          authorsResponse,
          categoriesResponse,
        ] = await Promise.all([
          fetch("http://localhost:3000/api/article"),
          fetch("http://localhost:3000/api/user"),
          fetch("http://localhost:3000/api/author"),
          fetch("http://localhost:3000/api/category"),
        ]);

        // Check if responses are ok
        if (
          !articlesResponse.ok ||
          !usersResponse.ok ||
          !authorsResponse.ok ||
          !categoriesResponse.ok
        ) {
          throw new Error("One or more API requests failed");
        }

        // Parse JSON responses
        const articlesData = await articlesResponse.json();
        const usersData = await usersResponse.json();
        const authorsData = await authorsResponse.json();
        const categoriesData = await categoriesResponse.json();

        // Update state with fetched data
        setTotalArticles(articlesData.data.article.length);
        setTotalUsers(usersData.data.data.length);
        setTotalAuthors(authorsData.data.data.length);
        setTotalCategories(categoriesData.data.category.length);

        const articles = articlesData.data.article;

        // Sort articles by most recent and take top 5
        const sortedArticles = articles.sort((a, b) => b.id - a.id).slice(0, 5);
        setRecentArticles(sortedArticles);

        // Fetch category and author names for each article
        const uniqueCategoryIds = [
          ...new Set(sortedArticles.map((article) => article.category_id)),
        ];
        const uniqueAuthorIds = [
          ...new Set(sortedArticles.map((article) => article.author_id)),
        ];

        // Fetch all category names at once
        for (const categoryId of uniqueCategoryIds) {
          await fetchCategoryName(categoryId);
        }

        // Fetch all author names at once
        for (const authorId of uniqueAuthorIds) {
          await fetchAuthorName(authorId);
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        setIsLoading(false);
        console.error("Dashboard data fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-100">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome back, Admin!</p>
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
                    {totalArticles}
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
                    Total Users
                  </h2>
                  <p className="text-2xl font-semibold text-gray-800">
                    {totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Authors</h2>
                  <p className="text-2xl font-semibold text-gray-800">
                    {totalAuthors}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Tag className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">
                    Categories
                  </h2>
                  <p className="text-2xl font-semibold text-gray-800">
                    {totalCategories}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles Table */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Articles
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentArticles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {article.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {categoryNames[article.category_id] || "Loading..."}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {authorNames[article.author_id] || "Loading..."}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
