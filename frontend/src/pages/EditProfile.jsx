import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";

// Custom Notification Component
const Notification = ({ type, message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto close after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-orange-500 to-red-600",
          icon: <CheckCircle size={24} className="text-white" />,
          border: "border-green-200",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-rose-600",
          icon: <AlertCircle size={24} className="text-white" />,
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
          icon: <AlertCircle size={24} className="text-white" />,
          border: "border-blue-200",
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div
        className={`${styles.bg} ${styles.border} border shadow-xl rounded-lg p-4 min-w-80 max-w-md`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm leading-5">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-8 bg-white bg-opacity-20 rounded-full h-1 overflow-hidden ">
          <div className="bg-white h-full rounded-full animate-progress-bar "></div>
        </div>
      </div>
    </div>
  );
};

export default function EditProfilePage() {
  const { idUser } = useParams();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState("");

  // Notification states
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });

  // Show notification function
  const showNotification = (type, message) => {
    setNotification({
      isVisible: true,
      type,
      message,
    });
  };

  // Hide notification function
  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Fetch user data by ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingData(true);
        const response = await fetch(
          `http://localhost:3000/api/user/${idUser}`
        );
        const result = await response.json();

        if (result.success) {
          const userData = result.data.data;
          setFormData({
            username: userData.username || "",
            name: userData.name || "",
            email: userData.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          // Set avatar URL - assuming the avatar path is relative to the server
          setAvatar(
            userData.avatar
              ? `http://localhost:3000/${userData.avatar}`
              : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          );
        } else {
          setError("Failed to fetch user data");
          showNotification("error", "Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error loading user data");
        showNotification("error", "Error loading user data");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (idUser) {
      fetchUserData();
    }
  }, [idUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Create FormData for multipart/form-data if avatar is uploaded
      const updateData = new FormData();

      // Add text fields
      updateData.append("name", formData.name);
      updateData.append("email", formData.email);
      updateData.append("username", formData.username);

      // Add password fields only if new password is provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("New passwords do not match");
          showNotification("error", "New passwords do not match!");
          setIsLoading(false);
          return;
        }
        updateData.append("currentPassword", formData.currentPassword);
        updateData.append("newPassword", formData.newPassword);
      }

      // Add avatar file if selected
      if (avatarFile) {
        updateData.append("avatar", avatarFile);
      }

      const response = await fetch(`http://localhost:3000/api/user/${idUser}`, {
        method: "PATCH",
        body: updateData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        showNotification(
          "success",
          "Profile updated successfully! The page will refresh in a moment."
        );

        // Reset password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setAvatarFile(null);

        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(result.message || "Failed to update profile");
        showNotification("error", result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile. Please try again.");
      showNotification("error", "Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-500"></div>
          <span className="ml-3 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Custom Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Desktop: Two Column Layout, Mobile: Single Column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Profile & Basic Info */}
              <div className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative mb-6">
                    <img
                      src={avatar}
                      alt="Profile Avatar"
                      className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-gray-200 shadow-xl object-cover"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-2 right-2 p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: "#f81539" }}
                    >
                      <Camera size={18} className="text-white" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  {/* Profile Summary */}
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {formData.name}
                    </h2>
                    <p className="text-gray-600 mb-1">@{formData.username}</p>
                    <p className="text-gray-500 text-sm">{formData.email}</p>
                  </div>
                </div>

                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>

                  {/* Username Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User size={16} style={{ color: "#f81539" }} />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": "#f81539" }}
                      required
                    />
                  </div>

                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User size={16} style={{ color: "#f81539" }} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": "#f81539" }}
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail size={16} style={{ color: "#f81539" }} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": "#f81539" }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Security & Password */}
              <div className="space-y-8">
                {/* Password Section */}
                <div className="space-y-6 lg:mt-52 ">
                  <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <Lock size={18} style={{ color: "#f81539" }} />
                    Change Password (Optional)
                  </h3>

                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        style={{ "--tw-ring-color": "#f81539" }}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        style={{ "--tw-ring-color": "#f81539" }}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        style={{ "--tw-ring-color": "#f81539" }}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Full Width at Bottom */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-gray-200">
              <NavLink
                to={"/"}
                type="button"
                className="flex-1 py-3 px-6 border text-center border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </NavLink>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-6 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: isLoading
                    ? "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)"
                    : "linear-gradient(135deg, #f81539 0%, #fc4308 100%)",
                }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 py-6 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>
            Your profile information is secure and will only be visible to you.
          </p>
          <p className="mt-1">
            Changes will take effect immediately after saving.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-progress-bar {
          animation: progress-bar 4s linear;
        }
      `}</style>
    </div>
  );
}
