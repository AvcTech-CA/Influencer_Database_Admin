import { Outlet, Navigate } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("token"); // adapt to your auth

 function PublicRoute() {
  return isAuthenticated() ? <Navigate to="/home" replace /> : <Outlet />;
}

export default PublicRoute;