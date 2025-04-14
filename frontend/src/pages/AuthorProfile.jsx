// src/App.jsx
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Office from "../assets/Office.jpg";

function AuthorProfile() {
  const articles = [
    {
      id: 1,
      title: "Unveiling the 7 Kayaking Spots in Austria, the Alps",
      image: "https://source.unsplash.com/random/300x200/?kayak,mountains",
      excerpt:
        "Discover the most scenic spots to paddle through crystal clear waters with breathtaking mountain backdrops around Austria.",
      author: {
        name: "James",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        role: "Travel Writer",
      },
      date: "1d ago",
      likes: 245,
      comments: 42,
    },
    {
      id: 2,
      title: "How To Choose The Right Laptop For Gaming",
      image: "https://source.unsplash.com/random/300x200/?laptop,gaming",
      excerpt:
        "Find the best laptop specs for high-performance gaming without breaking the bank. Key features to look for.",
      author: {
        name: "Lucas Rodriguez",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        role: "Tech Reviewer",
      },
      date: "2d ago",
      likes: 189,
      comments: 23,
    },
    {
      id: 3,
      title: "How We Built The First Test Self-Driving Car",
      image: "https://source.unsplash.com/random/300x200/?car,pink",
      excerpt:
        "The journey to creating an autonomous vehicle that safely navigates urban environments with AI assistance.",
      author: {
        name: "Emily",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        role: "Automotive Engineer",
      },
      date: "3d ago",
      likes: 302,
      comments: 56,
    },
    {
      id: 4,
      title: "How To Choose The Best Laptop For Video Editing",
      image: "https://source.unsplash.com/random/300x200/?laptop,editing",
      excerpt:
        "Selecting the right hardware for professional video editing work - RAM, GPU, CPU, and storage considerations.",
      author: {
        name: "Robert",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        role: "Content Creator",
      },
      date: "3d ago",
      likes: 173,
      comments: 31,
    },
    {
      id: 5,
      title: "How To Perfectly Cure Hamchi To Be Eaten Raw",
      image: "https://source.unsplash.com/random/300x200/?food,fish",
      excerpt:
        "The step-by-step process to safely cure fish at home for delicious, restaurant-quality sashimi and crudo dishes.",
      author: {
        name: "Sophie",
        avatar: "https://randomuser.me/api/portraits/women/62.jpg",
        role: "Chef",
      },
      date: "Apr 10",
      likes: 412,
      comments: 78,
    },
    {
      id: 6,
      title: "How To Build A Self-Driving Car In Your Garage",
      image: "https://source.unsplash.com/random/300x200/?car,blue",
      excerpt:
        "A DIY approach to creating automated driving features using off-the-shelf components and open-source software.",
      author: {
        name: "Michael",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        role: "Engineer",
      },
      date: "Apr 8",
      likes: 528,
      comments: 94,
    },
    {
      id: 7,
      title: "Self-Improvement Hack Nobody In California Knows",
      image: "https://source.unsplash.com/random/300x200/?beach,california",
      excerpt:
        "The little-known technique that helps top performers in the Golden State stay ahead of the competition.",
      author: {
        name: "Tyler",
        avatar: "https://randomuser.me/api/portraits/men/77.jpg",
        role: "Life Coach",
      },
      date: "Apr 5",
      likes: 217,
      comments: 39,
    },
    {
      id: 8,
      title: "Why Electric Cars Are Better Now Than Ever Before",
      image: "https://source.unsplash.com/random/300x200/?car,red",
      excerpt:
        "Recent innovations in battery technology and charging infrastructure have made EVs more practical than traditional vehicles.",
      author: {
        name: "Alex",
        avatar: "https://randomuser.me/api/portraits/men/91.jpg",
        role: "Automotive Journalist",
      },
      date: "Apr 3",
      likes: 361,
      comments: 57,
    },
    {
      id: 9,
      title: "14 Coffee Brewing Tricks to Impress Anyone",
      image: "https://source.unsplash.com/random/300x200/?coffee,brewing",
      excerpt:
        "Advanced coffee preparation techniques to elevate your morning brew from ordinary to extraordinary.",
      author: {
        name: "Emma",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        role: "Barista",
      },
      date: "Apr 1",
      likes: 193,
      comments: 45,
    },
    {
      id: 10,
      title: "Waterproof Laptops Now Actually Work Just Fine",
      image: "https://source.unsplash.com/random/300x200/?laptop,blue",
      excerpt:
        "The latest innovations in waterproof technology for computers that make them reliable for outdoor and marine use.",
      author: {
        name: "Lucas",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        role: "Tech Writer",
      },
      date: "Mar 29",
      likes: 274,
      comments: 38,
    },
    {
      id: 11,
      title: "Historic Kayaks for Sale in Venice",
      image: "https://source.unsplash.com/random/300x200/?kayak,venice",
      excerpt:
        "Vintage and antique water craft now available in the famous canal city - from traditional gondolas to modern kayaks.",
      author: {
        name: "Isabella",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        role: "Antique Dealer",
      },
      date: "Mar 25",
      likes: 298,
      comments: 51,
    },
    {
      id: 12,
      title: "Lasagna is Just a Pasta Cake",
      image: "https://source.unsplash.com/random/300x200/?lasagna,food",
      excerpt:
        "The provocative comparison of lasagna to layered cake, and why this perspective changes how we think about pasta dishes.",
      author: {
        name: "Marco",
        avatar: "https://randomuser.me/api/portraits/men/36.jpg",
        role: "Food Writer",
      },
      date: "Mar 21",
      likes: 385,
      comments: 67,
    },
    // Added 6 more articles to reach a total of 18
    {
      id: 13,
      title: "The Ultimate Guide to Sustainable Gardening",
      image: "https://source.unsplash.com/random/300x200/?garden,plants",
      excerpt:
        "Eco-friendly gardening practices that conserve water, improve soil health, and attract beneficial wildlife to your backyard.",
      author: {
        name: "Olivia",
        avatar: "https://randomuser.me/api/portraits/women/23.jpg",
        role: "Environmental Scientist",
      },
      date: "Mar 18",
      likes: 276,
      comments: 48,
    },
    {
      id: 14,
      title: "The Psychology Behind Effective Website Design",
      image: "https://source.unsplash.com/random/300x200/?website,design",
      excerpt:
        "How color theory, layout principles, and user behavior research influence successful digital experiences.",
      author: {
        name: "Nathan",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        role: "UX Designer",
      },
      date: "Mar 15",
      likes: 318,
      comments: 63,
    },
    {
      id: 15,
      title: "Traditional Bread Recipes From Around The World",
      image: "https://source.unsplash.com/random/300x200/?bread,baking",
      excerpt:
        "From French baguettes to Indian naan, explore diverse baking techniques and cultural significance of bread.",
      author: {
        name: "Sophia",
        avatar: "https://randomuser.me/api/portraits/women/56.jpg",
        role: "Food Historian",
      },
      date: "Mar 12",
      likes: 423,
      comments: 71,
    },
    {
      id: 16,
      title: "Beginners Guide to Night Sky Photography",
      image: "https://source.unsplash.com/random/300x200/?stars,night",
      excerpt:
        "Capture stunning images of stars, planets, and galaxies with basic equipment and these expert techniques.",
      author: {
        name: "David",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        role: "Photographer",
      },
      date: "Mar 9",
      likes: 356,
      comments: 62,
    },
    {
      id: 17,
      title: "Modern Interior Design Trends for Small Spaces",
      image: "https://source.unsplash.com/random/300x200/?interior,apartment",
      excerpt:
        "Maximize functionality and style in compact living areas with these innovative design solutions and space-saving ideas.",
      author: {
        name: "Jessica",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
        role: "Interior Designer",
      },
      date: "Mar 6",
      likes: 289,
      comments: 47,
    },
    {
      id: 18,
      title: "The Rise of E-Sports: From Hobby to Professional Career",
      image: "https://source.unsplash.com/random/300x200/?gaming,tournament",
      excerpt:
        "How competitive gaming evolved into a billion-dollar industry with professional leagues, sponsorships, and global tournaments.",
      author: {
        name: "Ryan",
        avatar: "https://randomuser.me/api/portraits/men/18.jpg",
        role: "E-Sports Analyst",
      },
      date: "Mar 3",
      likes: 467,
      comments: 82,
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState(currentPage.toString());
  const articlesPerPage = 12; // 12 items per page (3 rows of 4 columns)
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  // Get current articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setPageInputValue(nextPage.toString());
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setPageInputValue(prevPage.toString());
    }
  };

  // Handle input changes
  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };

  // Handle input submission
  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInputValue);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      // Reset to current page if invalid
      setPageInputValue(currentPage.toString());
    }
  };

  return (
    <div>
      <Navbar />
      <div className="breadcrumbs text-sm p-5">
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Authors</a>
          </li>
        </ul>
      </div>
      <div className="p-6 flex items-center justify-center">
        <div className="w-[1440px] h-32 bg-yellow-400 text-center  ">
          Banner
        </div>
      </div>

      <div className="bg-gray-200 w-full flex items-center justify-evenly ">
        <div className="p-4 flex items-center">
          <img
            src={Office}
            alt=""
            width={44}
            height={44}
            className=" rounded-md"
          />
          <p className="">Anton</p>
        </div>
        <div className="flex">
          <Newspaper />
          <p> Total Post :</p>
          <p> 21</p>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <header className="px-4 py-3">
          <h1 className="text-lg font-semibold">Latest Posts</h1>
        </header>

        {/* Articles Grid */}
        <main className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-md overflow-hidden shadow-sm"
              >
                {/* Article Image */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-32 object-cover"
                />

                {/* Article Content */}
                <div className="p-3">
                  <h3 className="font-medium text-xs leading-tight line-clamp-2 h-10 mb-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 h-8 mb-2">
                    {article.excerpt}
                  </p>

                  {/* Author & Engagement */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-xs font-medium">
                          {article.author.name}
                        </p>
                        <p className="text-xs text-gray-500">{article.date}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Heart size={14} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Pagination Controls */}
        <div className="mt-6">
          <ul className="flex justify-center gap-1 text-gray-900">
            <li>
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`grid size-8 place-content-center rounded border border-gray-200 transition-colors ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
            </li>

            <li>
              <form onSubmit={handlePageInputSubmit}>
                <label htmlFor="Page">
                  <span className="sr-only">Page</span>
                  <input
                    type="text"
                    id="Page"
                    value={pageInputValue}
                    onChange={handlePageInputChange}
                    onBlur={handlePageInputSubmit}
                    className="h-8 w-16 rounded border border-gray-200 text-center sm:text-sm"
                  />
                </label>
              </form>
            </li>

            <li className="flex items-center">
              <span className="text-sm text-gray-500">of {totalPages}</span>
            </li>

            <li>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`grid size-8 place-content-center rounded border border-gray-200 transition-colors ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AuthorProfile;
