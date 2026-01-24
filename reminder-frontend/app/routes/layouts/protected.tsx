import { Outlet, Navigate, useLocation } from "react-router";
import { useEffect, useState } from "react";


let cachedAuth: null | { allowed: boolean } = null;


export default function ProtectedLayout() {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">(
    cachedAuth ? (cachedAuth.allowed ? "allowed" : "denied") : "loading"
  );



  useEffect(() => {
    if (cachedAuth) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      credentials: "include"
    })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => {
        const role = data?.user?.role;
        const allowed = role !== "applicant";
        cachedAuth = { allowed };
        setStatus(allowed ? "allowed" : "denied");
      })
      .catch(() => {
        cachedAuth = { allowed: false };
        setStatus("denied")});
  }, []);

   if (status === "loading") return <div className="p-6">Loading…</div>; 


  if (status === "denied") {
    const redirectTo = encodeURIComponent(
      location.pathname + location.search
    );
    return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
  }

  return <Outlet />;
}