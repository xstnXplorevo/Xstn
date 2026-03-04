import { useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import AboutPage from "../pages/About";
import HomePage from "../pages/Home";
import ServicesPage from "../pages/Service";
import ProjectsPage from "../pages/Project";
import JoinPage from "../pages/Join";
import PartnerPage from "../pages/Partner";
import ContactPage from "../pages/Contact";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminPanel from "./AdminPanel";

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

export default function Landing() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/about" element={<AboutPage />}></Route>
          <Route path="/services" element={<ServicesPage />}></Route>
          <Route path="/projects" element={<ProjectsPage />}></Route>
          <Route path="/join" element={<JoinPage />}></Route>
          <Route path="/partner" element={<PartnerPage />}></Route>
          <Route path="/contact" element={<ContactPage />}></Route>
        </Routes>
      </div>

      <Footer />
    </>
  );
}
