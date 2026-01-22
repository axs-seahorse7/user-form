import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../Components/Helper/Axios-Api/api.js";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    axios.get("/auth/me", { withCredentials: true })
      .then(() => setAuthorized(true))
      .catch(() => setAuthorized(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return authorized ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
