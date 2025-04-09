import React from "react";
import Navbar from "../components/Navbar";
import CategoriesBar from "../components/CategoriesBar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
function Main() {
  return (
    <div>
      <Navbar />
      {/* Categories bar */}
      <CategoriesBar />

      {/* carousel */}

      <Carousel />
      <Footer />
    </div>
  );
}

export default Main;
