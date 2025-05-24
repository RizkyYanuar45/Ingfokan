// TeamSection.jsx
import { useState, useEffect } from "react";

const AuthorList = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/author");

        if (!response.ok) {
          throw new Error("Failed to fetch authors");
        }

        const result = await response.json();

        if (result.success && result.data && result.data.data) {
          setTeamMembers(result.data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching authors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-4">
        <div className="flex items-center gap-1 mb-6">
          <span className="text-red-500 font-bold text-sm">•</span>
          <h2 className="text-sm font-medium">Ingfokan News Author</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center animate-pulse"
            >
              <div className="w-16 h-16 rounded-md bg-gray-300 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-12 mb-1"></div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-4">
        <div className="flex items-center gap-1 mb-6">
          <span className="text-red-500 font-bold text-sm">•</span>
          <h2 className="text-sm font-medium">Ingfokan News Author</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="flex items-center gap-1 mb-6">
        <span className="text-red-500 font-bold text-sm">•</span>
        <h2 className="text-sm font-medium">Ingfokan News Author</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            {/* Image Container */}
            <div className="w-16 h-16 rounded-md overflow-hidden mb-1">
              <img
                src={`http://localhost:3000/${member.avatar}`}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback image jika avatar tidak ditemukan
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    member.name
                  )}&background=e5e7eb&color=374151&size=64`;
                }}
              />
            </div>

            {/* Name with background */}
            <div className="mt-1 bg-gray-100 w-full rounded-sm py-1">
              <p
                className="text-xs font-medium text-center"
                title={member.name}
              >
                {member.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorList;
