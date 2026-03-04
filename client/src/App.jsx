import { useState, useEffect } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Landing from "./sections/Landing";
import SignUpForm from "./components/layout/SignUp";
import SignInForm from "./components/layout/SignIn";
import Dashboard from "./sections/Dashboard";
import AdminPanel from "./sections/AdminPanel";
import { useAuth } from "./config/AuthContext";
import supabase from "./config/createClient";
// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS (centralized — easy to theme later)
// ─────────────────────────────────────────────────────────────
const TOKENS = {
  cyan: "#22d3ee",
  violet: "#a78bfa",
  pink: "#f472b6",
  green: "#34d399",
  orange: "#fb923c",
  yellow: "#fbbf24",
  bg: "#03060f",
  bgCard: "rgba(255,255,255,0.025)",
  border: "rgba(255,255,255,0.07)",
  borderCyan: "rgba(34,211,238,0.2)",
};
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const { user } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setRole(data?.role ?? "user"));
  }, [user]);

  return (
    <>
      <Routes>
        <Route path="/*" element={<Landing />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<SignInForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {role === "admin" ? <AdminPanel /> : <Dashboard />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
