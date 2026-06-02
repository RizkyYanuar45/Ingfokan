import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router/Router";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={Router}></RouterProvider>
    </AuthProvider>
  );
}

export default App;
