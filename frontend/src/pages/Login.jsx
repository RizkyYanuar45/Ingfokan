import React from "react";
import Office from "./../assets/Office.jpg";
import { Button } from "@chakra-ui/react";

function Login() {
  return (
    <div className=" p-20 h-screen">
      <div className="flex justify-center items-center bg-yellow-500 max-h-screen rounded-4xl h-[500px]">
        {/* Left side with image */}
        <div className="w-2/4 h-full overflow-hidden">
          <img
            src={Office}
            alt="Office"
            className="w-full h-full object-cover object-center rounded-l-4xl"
          />
        </div>
        {/* Right side with form */}
        <div className="bg-gradient-to-r from-primary to-secondary w-2/4 p-8 h-[500px]">
          <form
            action=""
            className="h-[250px] my-auto bg-purple-500 space-y-8 mt-12"
          >
            <label htmlFor="email" className="mt-20">
              email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <label htmlFor="password" className="mt-5">
              password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Button>Login</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
