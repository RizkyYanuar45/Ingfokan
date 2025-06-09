import React, { useState } from "react";
import Office from "./../assets/Office.jpg";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Login() {
  const api = import.meta.env.VITE_API_URL; // Ensure this is set in your .env file

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send login request with JSON format
      const response = await fetch(`${api}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Process response
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      // Handle successful login based on your API response format
      localStorage.setItem("token", result.data.token);

      // Redirect to dashboard or home page
      navigate("/"); // Change this to your desired redirect path
    } catch (err) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primarycus to-secondarycus p-6 md:p-8">
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
                  <p className="text-sm opacity-90">
                    Your trusted information management system
                  </p>
                </div>
              </div>
            </div>

            {/* Right side with form */}
            <div className="w-full md:w-1/3 p-8 md:p-12 bg-white">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blackcus mb-2">Login</h1>
                <p className="text-gray-600">Please sign in to continue</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarycus focus:border-transparent transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blackcus"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarycus focus:border-transparent transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <NavLink
                  to={"/forget-password"}
                  className="flex items-center justify-between"
                >
                  <a
                    href="#"
                    className="text-sm font-medium text-primarycus hover:text-secondarycus transition-colors"
                  >
                    Forgot password?
                  </a>
                </NavLink>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primarycus to-secondarycus text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primarycus focus:ring-offset-2 disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Sign Up Option */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <NavLink
                      to="/signup"
                      className="font-medium text-primarycus hover:text-secondarycus transition-colors"
                    >
                      Sign up
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
