import React, { useState } from "react";
import Office from "./../assets/Office.jpg";
import { Mail } from "lucide-react";

function ForgetPassword() {
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
                <h1 className="text-4xl font-bold text-blackcus mb-2">
                  Reset Password
                </h1>
                <p className="text-gray-600">Please insert your email</p>
              </div>

              <form className="space-y-6">
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
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primarycus focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primarycus to-secondarycus text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primarycus focus:ring-offset-2"
                >
                  Send OTP
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
