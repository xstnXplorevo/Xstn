import { useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Landing from "./sections/Landing";
import SignUpForm from "./components/layout/SignUp";
import SignInForm from "./components/layout/SignIn";

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

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Landing />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<SignInForm />} />
      </Routes>
    </>
  );
}
