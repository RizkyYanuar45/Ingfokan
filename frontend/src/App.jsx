import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router/Router";

function App() {
  return <RouterProvider router={Router}></RouterProvider>;
}

export default App;
