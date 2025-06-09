import { useState } from "react";
import Office from "./../assets/Office.jpg";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

function ForgetPassword() {
  const api = import.meta.env.VITE_API_URL; // Ensure this is set in your .env file
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Ensure this is set in your .env file

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async () => {
    if (!email) {
      setNotification({
        type: "error",
        message: "Please enter your email address",
      });
      return;
    }

    setIsLoading(true);
    setNotification(null);

    try {
      const response = await fetch(`${api}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: "success",
          message: data.message,
        });
        setEmail(""); // Clear form on success
      } else {
        setNotification({
          type: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide notification after 5 seconds
  if (notification) {
    setTimeout(() => {
      setNotification(null);
    }, 5000);
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
            <p className="text-sm font-medium">{notification.message}</p>
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
                <p className="text-gray-600">Please insert your email</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blackcus"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarycus focus:border-transparent transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
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
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
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

export default ForgetPassword;
