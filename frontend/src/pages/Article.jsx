import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  BookmarkPlus,
  ChevronRight,
  Send,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RelatedPost from "../components/RelatedPost";

export default function Article() {
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Maria Johnson",
      avatar: "/api/placeholder/40/40",
      date: "2 days ago",
      text: "This is such a beautiful place! I visited Mljet last summer and absolutely loved the kayaking experience. The water really is that blue!",
      likes: 12,
      isLiked: false,
    },
    {
      id: 2,
      author: "David Chen",
      avatar: "/api/placeholder/40/40",
      date: "5 days ago",
      text: "Great article! Could you share more details about transportation to the island? Is it accessible by ferry only or are there other options?",
      likes: 8,
      isLiked: false,
    },
    {
      id: 3,
      author: "Sarah Miller",
      avatar: "/api/placeholder/40/40",
      date: "1 week ago",
      text: "The Odysseus Cave sounds magical! Does anyone know if it's suitable for children or is it a difficult trek to get there?",
      likes: 5,
      isLiked: false,
    },
  ]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    const newComment = {
      id: comments.length + 1,
      author: "You",
      avatar: "/api/placeholder/40/40",
      date: "Just now",
      text: commentText,
      likes: 0,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const toggleCommentLike = (id) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Article */}
            <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <h1 className="text-2xl md:text-3xl font-bold p-4 lg:p-6">
                How to Spend the Perfect Day on Croatia's Most Magical Island
              </h1>

              {/* Hero Image */}
              <div className="relative">
                <img
                  src="/api/placeholder/800/400"
                  alt="Person kayaking with mountain view in Croatia"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-70 p-2 rounded-full">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-800">
                      June 23, 2023
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-4 lg:p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500 mr-3"></div>
                  <div>
                    <p className="font-medium">Travel Insider</p>
                    <p className="text-xs text-gray-500">Travel Expert</p>
                  </div>
                  <div className="ml-auto flex space-x-3">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="flex items-center text-gray-500 hover:text-red-500"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isLiked ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      <span className="ml-1 text-sm">245</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-blue-500">
                      <MessageCircle className="w-5 h-5" />
                      <span className="ml-1 text-sm">42</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-green-500">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-purple-500">
                      <BookmarkPlus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Croatia attracts over sixteen million visitors each year
                  because it unites mesmerizing turquoise waters with beautiful
                  mountainous landscapes. From stunning ancient cities to
                  picturesque coastal towns, Croatia's crown jewel might just be
                  the magical island of Mljet. Here's how to make the most of
                  your perfect day exploring pristine lakes, lush forests, and
                  rich cultural heritage on this enchanting Mediterranean
                  paradise.
                </p>

                {/* Secondary Image */}
                <img
                  src="/api/placeholder/800/300"
                  alt="Colorful kayaks lined up on beach"
                  className="w-full h-auto object-cover rounded-lg mb-6"
                />

                <h2 className="text-xl font-bold mb-4">
                  Red Kayak Day: The Perfect Blue Waters And A Secluded Cove
                </h2>

                <p className="text-gray-700 mb-6">
                  Start your day with a breathtaking sunrise kayak tour. Paddle
                  your way through crystal-clear waters, gently surrounded by
                  the forest's edge reflecting in the azure sea. Our guide
                  recommends renting a red kayak for that perfect Instagram
                  moment against the blue backdrop. The morning tranquility
                  rewards early risers with peaceful waters and a chance to spot
                  local wildlife along the shoreline.
                </p>

                <p className="text-gray-700 mb-6">
                  Make your way to the secluded Small Lake cove, accessible only
                  by water or hiking trail. The limestone formations create a
                  natural swimming pool with remarkably clear visibility. Spend
                  time exploring the underwater caves and marveling at the
                  vibrant marine life that flourishes in this protected area.
                  Professional guides recommend snorkeling gear for the best
                  experience, and afternoon hours for optimal sunlight through
                  the water.
                </p>

                <p className="text-gray-700">
                  End your day with a sunset picnic at Odysseus Cave, named
                  after the legendary hero who allegedly spent seven years on
                  the island after being shipwrecked here. Bring a local bottle
                  of wine, a selection of Croatian cheeses, and freshly baked
                  bread from the bakery near the harbor. The views from this
                  natural platform facing west provide the perfect finale to
                  your magical day on Mljet.
                </p>
              </div>
            </article>

            {/* Comment Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 lg:p-6 border-b">
                <h2 className="text-xl font-bold flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Comments ({comments.length})
                </h2>
              </div>

              {/* Comment Form */}
              <div className="p-4 lg:p-6 border-b">
                <form onSubmit={handleCommentSubmit} className="flex flex-col">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
                    <div className="flex-grow">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 flex items-center"
                      disabled={commentText.trim() === ""}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </button>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="divide-y">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 lg:p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium">{comment.author}</h4>
                          <span className="text-xs text-gray-500 ml-2">
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.text}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <button
                            onClick={() => toggleCommentLike(comment.id)}
                            className="flex items-center mr-4 hover:text-red-500"
                          >
                            <Heart
                              className={`w-4 h-4 mr-1 ${
                                comment.isLiked
                                  ? "fill-red-500 text-red-500"
                                  : ""
                              }`}
                            />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="flex items-center mr-4 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="p-4 lg:p-6 text-center text-gray-500">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 p-4 bg-white lg:bg-gray-50">
          <div className="lg:sticky lg:top-4">
            {/* Profile Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-red-500 mr-3"></div>
                <div>
                  <p className="font-medium">Travel Insider</p>
                  <button className="mt-1 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    Follow
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="font-bold text-lg mb-4">Popular Posts</h3>

              {Array(5)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start mb-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-sm">
                        The Secret Beaches of Southern Europe You Need to Visit
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">5 days ago</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0 mt-2" />
                  </div>
                ))}
            </div>

            {/* Advertisement */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 rounded-lg shadow-md mb-4 text-white">
              <h3 className="font-bold text-lg mb-2">Subscribe Now</h3>
              <p className="text-sm mb-4">
                Get exclusive travel tips and destination guides delivered to
                your inbox
              </p>
              <button className="bg-white text-purple-600 font-medium py-2 px-4 rounded-lg w-full">
                Learn More
              </button>
            </div>

            {/* Second Advertisement */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 rounded-lg shadow-md text-white">
              <h3 className="font-bold text-lg mb-2">Summer Deals</h3>
              <p className="text-sm mb-4">
                Discover our exclusive summer packages with up to 30% off!
              </p>
              <button className="bg-white text-blue-600 font-medium py-2 px-4 rounded-lg w-full">
                View Offers
              </button>
            </div>
          </div>
        </div>
      </div>
      <RelatedPost />
      <Footer />
    </div>
  );
}
