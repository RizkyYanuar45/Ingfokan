import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { idUser } = useParams();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the current user is the owner of the resource or an admin
  if (user.id == idUser || user.role === "admin") {
    return children;
  } else {
    return <Navigate to="/not-authorized" replace />;
  }
};

export default UserProtectedRoute;


