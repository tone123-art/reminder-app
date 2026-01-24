import { Outlet, Navigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "~/components/hooks/authContext";




export default function ProtectedLayout() {
  const location = useLocation();
  const {user, loading} = useAuth();


  // While AuthProvider is fetching /me
  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  // Not logged in
  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
  }

  // Logged in but applicant not allowed
  if (user.role === "applicant") {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
  }

  return <Outlet />;
}