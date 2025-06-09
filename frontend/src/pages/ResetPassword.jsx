import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Office from "./../assets/Office.jpg";

function ResetPassword() {
  const api = import.meta.env.VITE_API_URL; // Ensure this is set in your .env file

  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check token validity on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setNotification({
          type: "error",
          message: "Token tidak ditemukan",
        });
        setIsTokenValid(false);
        setIsCheckingToken(false);
        return;
      }

      try {
        const response = await fetch(
          `${api}/user/verify-reset-token/${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Token verification response:", data); // Debug log

        // Perbaikan: Periksa struktur response yang berbeda
        if (data.success) {
          if (data.data && data.data.tokenValid) {
            setIsTokenValid(true);
            setUserEmail(data.data.email || "");
            setUserName(data.data.name || "");
          } else if (data.tokenValid) {
            // Jika struktur response berbeda
            setIsTokenValid(true);
            setUserEmail(data.email || "");
            setUserName(data.name || "");
          } else {
            setIsTokenValid(false);
            setNotification({
              type: "error",
              message:
                data.message || "Token tidak valid atau sudah kedaluwarsa",
            });
          }
        } else {
          setIsTokenValid(false);
          setNotification({
            type: "error",
            message: data.message || "Token tidak valid atau sudah kedaluwarsa",
          });
        }
      } catch (error) {
        console.error("Token verification error:", error); // Debug log
        setIsTokenValid(false);
        setNotification({
          type: "error",
          message: "Gagal memverifikasi token. Periksa koneksi internet Anda.",
        });
      } finally {
        setIsCheckingToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = () => {
    if (!formData.newPassword) {
      setNotification({
        type: "error",
        message: "Password baru tidak boleh kosong",
      });
      return false;
    }

    if (formData.newPassword.length < 6) {
      setNotification({
        type: "error",
        message: "Password minimal 6 karakter",
      });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({
        type: "error",
        message: "Konfirmasi password tidak cocok",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    setNotification(null);

    try {
      const response = await fetch(`${api}/user/change-password-with-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Password change response:", data); // Debug log

      if (data.success) {
        setNotification({
          type: "success",
          message: data.message,
        });
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });

        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setNotification({
          type: "error",
          message:
            data.message || "Gagal mengubah password. Silakan coba lagi.",
        });
      }
    } catch (error) {
      console.error("Password change error:", error); // Debug log
      setNotification({
        type: "error",
        message: "Terjadi kesalahan jaringan. Periksa koneksi internet Anda.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide notification after 5 seconds (except for success)
  useEffect(() => {
    if (notification && notification.type !== "success") {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primarycus to-secondarycus p-6 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-primarycus mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-blackcus">Memverifikasi token...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primarycus to-secondarycus p-6 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blackcus mb-2">
            Token Tidak Valid
          </h2>
          <p className="text-gray-600 mb-4">
            Token reset password tidak valid atau sudah kedaluwarsa.
          </p>
          <button
            onClick={() => (window.location.href = "/forget-password")}
            className="bg-gradient-to-r from-primarycus to-secondarycus text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Kembali ke Lupa Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primarycus to-secondarycus p-6 md:p-8">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
              {notification.type === "success" && (
                <p className="text-xs mt-1 opacity-75">
                  Redirecting to login page...
                </p>
              )}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto pl-3"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center">
        <div className="bg-white rounded-4xl shadow-2xl w-full max-w-4xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side with image */}
            <div className="w-full md:w-2/3 h-[200px] md:h-[600px] relative overflow-hidden">
              <img
                src={Office}
                alt="Modern office"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blackcus/50 to-transparent flex items-end p-8">
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome to Ingfokan
                  </h2>
                  <p className="text-sm opacity-90">Your trusted information</p>
                </div>
              </div>
            </div>

            {/* Right side with form */}
            <div className="w-full md:w-1/3 p-8 md:p-12 bg-white">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blackcus mb-2">
                  Reset Password
                </h1>
                <p className="text-gray-600">Please insert your new Password</p>
                {userName && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-blackcus">
                      <strong>Halo, {userName}</strong>
                    </p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-blackcus"
                  >
                    Password Baru
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Masukkan password baru"
                      disabled={isLoading}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarycus focus:border-transparent transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-blackcus"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Konfirmasi password baru"
                      disabled={isLoading}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarycus focus:border-transparent transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primarycus to-secondarycus text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primarycus focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengubah Password...
                    </>
                  ) : (
                    "Ubah Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
