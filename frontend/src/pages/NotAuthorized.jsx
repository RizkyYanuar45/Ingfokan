import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Lock, ArrowLeft, Home, ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center px-4 py-16 min-h-[70vh]">
        <div className="text-center max-w-lg">
          <div className="flex justify-center mb-6">
            <ShieldX size={80} className="text-amber-500" />
          </div>

          <h1 className="text-9xl font-bold text-gray-900">401</h1>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
            Not Authorized
          </h2>

          <p className="text-gray-600 mb-8">
            You don't have permission to access this resource. Please log in
            with appropriate credentials or contact the administrator if you
            believe this is an error.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Lock size={18} />
              <span>Log In</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
