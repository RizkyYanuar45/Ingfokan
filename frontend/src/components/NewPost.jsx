import React from "react";
import { ChevronRight, BookmarkPlus } from "lucide-react";
import Office from "../assets/Office.jpg";

function NewPost() {
  const posts = [
    {
      id: 1,
      title: "12 Mobile UX Design Trends For 2018",
      excerpt:
        "Things Move Quickly In The Mobile App Universe, So Remember To Stay On Top Of Mobile UX Design Trends!",
      date: "July 17, 2023",
      author: {
        name: "Jon Partner",
        avatar: Office,
      },
      image: Office,
      category: "Design",
    },
    {
      id: 2,
      title: "No Boat Bottomfish: Jetty Fishing On The Coast",
      excerpt:
        "Dive From The Rocky Fishing Holes Fresh Fish? Yes! In This World-Spanning Saltwater Feature.",
      date: "July 15, 2023",
      author: {
        name: "Linda Rodriguez",
        avatar: Office,
      },
      image: Office,
      category: "Outdoors",
    },
    {
      id: 3,
      title: "What A Product Designer Taught Me About Life",
      excerpt:
        "Why It Helps To Know What To Ask, And The Valuable History Of Equality These Days, The Word Design Is...",
      date: "July 12, 2023",
      author: {
        name: "James",
        avatar: Office,
      },
      image: Office,
      category: "Life",
    },
    {
      id: 4,
      title: "Beginning A Self-Driven Car & Machine Learning",
      excerpt:
        "How I Just My First True Job, Started In Lambda, And Landed In Job At Hertz The Past Year Has Been Rush.",
      date: "July 8, 2023",
      author: {
        name: "Guest Evan",
        avatar: Office,
      },
      image: Office,
      category: "Technology",
    },
    {
      id: 5,
      title: "How To Become A Master Designer",
      excerpt:
        "Many Students Believe That Design Is An Inherent Gifted Or Special In Some Way. We Have An Inside...",
      date: "July 7, 2023",
      author: {
        name: "Kim",
        avatar: Office,
      },
      image: Office,
      category: "Design",
    },
    {
      id: 6,
      title: "This Free Course Can Teach You Music Production",
      excerpt:
        "Ableton Sound Music Software Guides, Get Released A Free Interactive Music Guide That Runs Right In...",
      date: "July 5, 2023",
      author: {
        name: "Paulina",
        avatar: Office,
      },
      image: Office,
      category: "Music",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold flex items-center">
            <span className="bg-blue-500 w-1 h-6 mr-2 rounded-sm"></span>
            New Posts
          </h1>
          <button className="text-gray-500 text-sm flex items-center">
            Show All
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        {/* Grid - always 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {post.category}
                </div>
              </div>

              <div className="p-5">
                <h2 className="font-bold text-lg mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-xs text-gray-700">
                      {post.author.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <button className="text-gray-400 hover:text-blue-500">
                      <BookmarkPlus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewPost;
