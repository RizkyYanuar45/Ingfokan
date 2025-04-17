import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Office from "../assets/Office.jpg";
import { Mail, Phone, Clock, Printer, MapPinHouse } from "lucide-react";
import AuthorList from "../components/AuthorList";

export default function AboutUs() {
  return (
    <>
      <Navbar />

      <div className="breadcrumbs text-sm px-4 sm:px-10 py-4 sm:py-7">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About Us</a>
          </li>
        </ul>
      </div>
      <div className="p-8">
        <div className="bg-gray-200 relative rounded-4xl">
          <h1 className="text-2xl sm:text-4xl p-4 sm:p-10 right-0 top-0">
            Selalu Menyediakan Info Terbaru
          </h1>
          <div className="flex flex-col md:flex-row gap-4 sm:gap-10 p-3">
            {/* In mobile: Image first, then text */}
            {/* In desktop: Normal left-to-right layout */}
            <img
              src={Office}
              alt="Office"
              className="w-full h-auto md:w-[744px] md:h-[444px] object-cover rounded-lg order-first md:order-last"
            />
            <p className="p-3 sm:p-5 text-sm sm:text-base order-last md:order-first">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, qui
              officiis? Dolore error libero perferendis suscipit fugit ipsa
              dolorem. Iste eaque incidunt atque, porro quidem debitis, minus
              illo sapiente illum expedita optio aliquid similique beatae iure,
              itaque cum! Eveniet impedit quo libero excepturi quis expedita
              sapiente facere quod possimus, consequatur voluptate explicabo ad,
              et ut, voluptates dolor? Alias maiores esse quae temporibus fuga
              natus architecto, aliquid praesentium id veritatis, laborum error
              aliquam blanditiis. Temporibus laudantium incidunt maiores, vel
              quaerat est quia similique facilis voluptatum facere eveniet
              laboriosam libero consequatur corporis soluta corrupti eaque? Quam
              optio facilis tenetur quisquam eveniet nobis accusantium
              necessitatibus iste adipisci debitis placeat inventore deserunt
              modi sapiente aspernatur ab, magnam hic nostrum eum doloremque
              similique nulla doloribus aperiam! Quibusdam, reprehenderit rerum
              quod nesciunt dicta dignissimos unde sit placeat officiis expedita
              quo laudantium et quis tenetur laboriosam nobis exercitationem
              nisi iusto necessitatibus rem omnis. Aliquam voluptas quisquam,
              laudantium iste itaque cum veritatis expedita sapiente fugiat nemo
              earum tenetur, cupiditate porro enim, voluptatum rem. Cupiditate
              maiores numquam non illum provident iusto harum voluptates ipsa
              fugit? Atque magni, enim ipsa perferendis pariatur assumenda, fuga
              vel minus adipisci soluta sapiente dolores molestias dignissimos
              sunt quaerat officiis recusandae? Eius rerum, asperiores labore
              atque aut at adipisci qui? Laudantium excepturi maxime neque omnis
              voluptatibus, repellendus esse nihil porro eos rerum blanditiis
              eius! Magnam laudantium adipisci ad? Quibusdam, incidunt quis.
              Delectus non, temporibus atque officia omnis fugiat eaque, sequi
              molestiae corporis cum deleniti inventore in laudantium sint
              beatae quos voluptatum. Harum commodi et facere magni consectetur
              quis enim, aut reiciendis veniam sapiente velit reprehenderit
              delectus vel esse nostrum ad quos dolores ducimus? Temporibus,
              dolor, consectetur inventore cupiditate numquam maiores rerum
              voluptates eos, impedit ea odio possimus! Porro, animi quidem
              tempora ea dicta sequi quas, sint maiores ratione nulla impedit
              ipsam? Cum odit aperiam error.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row mt-6 sm:mt-10 px-4 sm:px-0 gap-6 sm:gap-0">
        <div className="py-6 sm:py-10 bg-gray-200 px-4 sm:pl-16 rounded-lg sm:rounded-e-4xl sm:pr-8 w-full lg:w-auto">
          <img
            src={Office}
            alt="Office"
            className="w-full h-auto sm:w-[840px] sm:h-[297px] object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col lg:ml-5">
          <div className="flex justify-start items-center mt-2 sm:mt-7 space-x-2">
            <div className="bg-primarycus w-1 h-3 rounded-lg"></div>
            <h1 className="text-lg sm:text-xl font-bold">
              Ingfokan News Information
            </h1>
          </div>

          <div className="flex mt-4">
            <div className="bg-gray-200 w-1 h-auto rounded-lg"></div>
            <div className="flex flex-col ml-2 sm:ml-2">
              <div className="flex justify-start items-center space-x-2 mt-4 sm:mt-8">
                <Mail className="text-gray-500 w-5 sm:w-6" />
                <p className="text-gray-800 text-sm sm:text-base">
                  Email: info@ingfokan.com
                </p>
              </div>
              <div className="flex justify-start items-center space-x-2 mt-4 sm:mt-8">
                <Phone className="text-gray-500 w-5 sm:w-6" />
                <p className="text-gray-800 text-sm sm:text-base">
                  Phone Number: 0881-9658-163
                </p>
              </div>
              <div className="flex justify-start items-center space-x-2 mt-4 sm:mt-8">
                <Printer className="text-gray-500 w-5 sm:w-6" />
                <p className="text-gray-800 text-sm sm:text-base">
                  Fax: 0881-9658-163
                </p>
              </div>
              <div className="flex justify-start items-center space-x-2 mt-4 sm:mt-8">
                <MapPinHouse className="text-gray-500 w-5 sm:w-6" />
                <p className="text-gray-800 text-wrap text-sm sm:text-base">
                  Address: Jalan Raya Mojomok nomer 20 kota Mojokerto, RT 8 / RW
                  9
                </p>
              </div>
              <div className="bg-gray-200 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex mt-4 sm:mt-5 justify-start items-center space-x-2 sm:space-x-3 w-fit">
                <Clock className="text-gray-500 w-5 sm:w-6" />
                <p className="text-gray-800 text-sm sm:text-base">
                  Responding 24 hours a day, 7 days a week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12">
        <AuthorList />
      </div>

      <Footer />
    </>
  );
}
