import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function checkIdUser(currentUserId, idUser) {
  try {
    if (currentUserId == idUser) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error parsing token:", e);
  }
  return null;
}

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const { idUser } = useParams();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = parseJwt(token);
  const currentUserId = decoded ? decoded.id : null;

  const checkUser = checkIdUser(currentUserId, idUser);
  if (checkUser === true) {
    return children;
  } else {
    return <Navigate to="/not-authorized" replace />;
  }
};

export default UserProtectedRoute;
