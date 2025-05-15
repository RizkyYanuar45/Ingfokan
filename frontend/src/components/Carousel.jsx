import React, { useState, useEffect } from "react";

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [articleContent, setArticleContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticleContent();
  }, []);

  const fetchArticleContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/article`);
      const data = await response.json();

      // Ambil 4 artikel secara acak
      const randomArticles = getRandomArticles(data.data.article, 4);
      setArticleContent(randomArticles);
    } catch (error) {
      console.error("Error fetching article content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil artikel secara acak
  const getRandomArticles = (articles, count) => {
    const articlesCopy = [...articles];
    const result = [];

    for (let i = 0; i < count && articlesCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * articlesCopy.length);
      result.push(articlesCopy.splice(randomIndex, 1)[0]);
    }

    return result;
  };

  // Fungsi untuk membuat excerpt dari konten HTML
  const createExcerpt = (htmlContent, maxLength = 150) => {
    // Buat elemen div sementara untuk parsing HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Ambil text content saja (tanpa tag HTML)
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    // Batasi panjang text dan tambahkan ellipsis jika terpotong
    if (textContent.length <= maxLength) {
      return textContent;
    }

    return textContent.substring(0, maxLength).trim() + "...";
  };

  const totalSlides = articleContent.length;

  const goToSlide = (slideIndex) => {
    if (slideIndex < 0) {
      setCurrentSlide(totalSlides - 1);
    } else if (slideIndex >= totalSlides) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(slideIndex);
    }
  };

  const goToPrevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  const goToNextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading articles...
      </div>
    );
  }

  return (
    <div className="carousel w-full md:h-96 relative overflow-hidden">
      {articleContent.map((article, index) => (
        <div
          key={article.id}
          className={`carousel-item absolute w-full h-full transition-transform duration-300 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
          aria-hidden={index !== currentSlide}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${totalSlides}`}
        >
          <img
            src={`http://localhost:3000/${article.thumbnail.replace(
              /\\/g,
              "/"
            )}`}
            className="w-full h-full object-cover"
            alt={article.title}
          />

          {/* Judul artikel */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 text-white">
            <h2 className="text-lg font-bold">{article.title}</h2>
          </div>

          {/* Cuplikan artikel (excerpt) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
            <p className="line-clamp-3">{createExcerpt(article.content)}</p>
            <div className="mt-2">
              <button className="text-sm text-blue-300 hover:underline">
                Baca Selengkapnya
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Tombol navigasi */}
      {totalSlides > 0 && (
        <>
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-10">
            <button
              onClick={goToPrevSlide}
              className="btn btn-circle"
              aria-label="Previous Slide"
            >
              ❮
            </button>
            <button
              onClick={goToNextSlide}
              className="btn btn-circle"
              aria-label="Next Slide"
            >
              ❯
            </button>
          </div>

          {/* Indikator slide */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {articleContent.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Carousel;
