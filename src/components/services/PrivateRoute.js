import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

function PrivateRoute() {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
