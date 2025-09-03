// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!sessionStorage.getItem("UserId");

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
