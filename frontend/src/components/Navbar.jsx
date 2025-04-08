import React from "react";
import { ChevronDown, Bookmark, Search } from "lucide-react";

function Navbar() {
  return (
    // <div className="navbar bg-white shadow-sm">
    //   <div className="flex-1">
    //     <a className="btn btn-ghost text-secondarycus text-xl">Ingfokan News</a>
    //   </div>
    //   <div className="flex gap-2">
    //     <input
    //       type="text"
    //       placeholder="Search"
    //       className="input input-bordered w-24 md:w-auto"
    //     />
    //     <div className="dropdown dropdown-end">
    //       <div
    //         tabIndex={0}
    //         role="button"
    //         className="btn btn-ghost btn-circle avatar"
    //       >
    //         <div className="w-10 rounded-full">
    //           <img
    //             alt="Tailwind CSS Navbar component"
    //             src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
    //           />
    //         </div>
    //       </div>
    //       <ul
    //         tabIndex={0}
    //         className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-secondarycus"
    //       >
    //         <li>
    //           <a className="justify-between">Profile</a>
    //         </li>
    //         <li>
    //           <a>Settings</a>
    //         </li>
    //         <li>
    //           <a>Logout</a>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </div>
    <header className="flex justify-between items-center px-5 py-7 mx-auto my-0 h-12 max-w-[1512px] max-md:px-4 max-md:py-0 shadow-sm">
      <div className="flex gap-16 items-center max-md:gap-10">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4e2ae9fabd01951bee1bbe437117d47b03ea3cc9"
          className="object-contain h-12 w-[163px]"
          alt="Ingfokan News"
        />
        <nav className="flex gap-9 items-center max-md:gap-5 max-sm:hidden">
          <button className="flex gap-0.5 items-center text-base font-medium text-stone-700">
            <span>Categories</span>
            <i className="text-sm text-stone-700 text-opacity-50" />
          </button>
          <button className="flex gap-0.5 items-center text-base font-medium text-stone-700">
            <span>Authors</span>
            <i className=" text-sm text-stone-700 text-opacity-50" />
          </button>
          <a
            href="/contact"
            className="gap-0.5 text-base font-medium text-stone-700"
          >
            Contact us
          </a>
          <a
            href="/about"
            className="gap-0.5 text-base font-medium text-stone-700"
          >
            About us
          </a>
        </nav>
      </div>
      <div className="flex gap-6 items-center">
        <div className="flex items-center">
          <div className="flex gap-5 items-center px-4 py-3.5 rounded-xl bg-neutral-100 max-sm:px-3 max-sm:py-2.5">
            <Search />
            <input
              type="text"
              placeholder="Search anything"
              className="text-xs text-stone-700 text-opacity-80 w-[287px] max-sm:w-[200px] bg-transparent border-none outline-none"
            />
            <button aria-label="Adjust search settings">
              <i className="ti ti-adjustments-horizontal text-xl text-stone-700 text-opacity-80" />
            </button>
          </div>
        </div>
        <div className="flex gap-12 items-center max-sm:gap-5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/65a45d88f10ad10c818d420053bb5bec70cff7d2"
            className="object-cover w-12 h-12 rounded-xl max-sm:-ml-0.5"
            alt="User avatar"
          />
          <button className="flex gap-2 items-center">
            <span className="text-base font-medium text-black">Behzad</span>
            <ChevronDown />
          </button>
        </div>
        <button
          className="flex justify-center items-center w-12 h-12 rounded-xl bg-neutral-100"
          aria-label="Bookmarks"
        >
          <Bookmark />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
