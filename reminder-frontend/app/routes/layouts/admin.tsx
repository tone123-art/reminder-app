import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../components/hooks/authContext";


export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // not logged in (shouldn't happen if wrapped correctly, but safe)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // logged in, but not admin
  if (user.role !== "admin") {
     return <Navigate to="/" replace />;
 
  }

  return <Outlet />;
}