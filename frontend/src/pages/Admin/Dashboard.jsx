import { useState, useEffect } from "react";
import { FileText, Users, Tag, Eye } from "lucide-react";

import SideBar from "../../components/Admin/SideBar";
import TopNavigation from "../../components/Admin/TopNavigation";

export default function Dashboard() {
  const api = import.meta.env.VITE_API_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for API data
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentArticles, setRecentArticles] = useState([]);

  // Loading and error states
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch only articles data since it contains author and category info
        const articlesResponse = await fetch(`${api}/article`);
        const userResponse = await fetch(`${api}/user`);

        // Check if response is ok
        if (!articlesResponse.ok || !userResponse.ok) {
          throw new Error("Failed to fetch articles data");
        }

        // Parse JSON response
        const articlesData = await articlesResponse.json();
        const articles = articlesData.data.articles;
        const usersData = await userResponse.json();
        const users = usersData.data.data;

        // Update total articles count
        setTotalArticles(articles.length);

        // Calculate unique authors and categories
        const uniqueAuthors = new Set(
          articles.map((article) => article.author.id)
        );
        const uniqueCategories = new Set(
          articles.map((article) => article.category.id)
        );

        setTotalAuthors(uniqueAuthors.size);
        setTotalCategories(uniqueCategories.size);

        // For total users, we'll use a placeholder since we can't get this from articles
        // You might want to add a separate API call for users count only
        setTotalUsers(users.length); // or keep existing user count if available

        // Sort articles by most recent and take top 5
        const sortedArticles = articles.sort((a, b) => b.id - a.id).slice(0, 5);
        setRecentArticles(sortedArticles);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Dashboard data fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

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
                          {article.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {article.author.name}
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
