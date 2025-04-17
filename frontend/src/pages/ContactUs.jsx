import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactUs() {
  return (
    <div>
      <Navbar />
      <div className="breadcrumbs text-sm px-4 sm:px-10 py-4 sm:py-7">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">Contact Us</a>
          </li>
        </ul>
      </div>
      <div className="max-w-6xl mx-auto mt-5 p-6 bg-white rounded-lg ">
        <h1 className="text-2xl font-bold mb-6">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">
              Subject
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter subject"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">
              Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">
            Message
          </label>
          <textarea
            className="w-full h-48 p-3 bg-gray-50 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Write your message here..."
          />
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 flex items-center justify-center">
            <span>Submit</span>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
