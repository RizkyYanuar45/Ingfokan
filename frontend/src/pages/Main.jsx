import React from "react";
import Navbar from "../components/Navbar";
import CategoriesBar from "../components/CategoriesBar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import PopularPost from "../components/PopularPost";
import NewPost from "../components/NewPost";

function Main() {
  return (
    <div>
      <Navbar />
      {/* Categories bar */}
      <CategoriesBar />

      {/* carousel */}
      <Carousel />

      <PopularPost />
      <NewPost />

      <Footer />
    </div>
  );
}

export default Main;
