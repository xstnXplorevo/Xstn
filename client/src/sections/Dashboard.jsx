// src/pages/Dashboard.jsx
// Authenticated dashboard — all forms wired to exact Supabase schema

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../config/createClient";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// src/config/constants.js (inlined)
// Updated to match exact status values from your DB constraint:
// status = ANY (ARRAY['submitted','planning','active','finished'])
// ─────────────────────────────────────────────────────────────
const statusConfig = {
  submitted: {
    label: "Submitted",
    color: "text-cyan-400",
    bg: "bg-cyan-950 border-cyan-800",
    dot: "bg-cyan-400",
  },
  planning: {
    label: "Planning",
    color: "text-blue-400",
    bg: "bg-blue-950 border-blue-800",
    dot: "bg-blue-400",
  },
  active: {
    label: "Active",
    color: "text-green-400",
    bg: "bg-green-950 border-green-800",
    dot: "bg-green-400",
  },
  finished: {
    label: "Finished",
    color: "text-purple-400",
    bg: "bg-purple-950 border-purple-800",
    dot: "bg-purple-400",
  },
  // legacy / fallbacks
  in_progress: {
    label: "In Progress",
    color: "text-yellow-400",
    bg: "bg-yellow-950 border-yellow-800",
    dot: "bg-yellow-400",
  },
  completed: {
    label: "Completed",
    color: "text-purple-400",
    bg: "bg-purple-950 border-purple-800",
    dot: "bg-purple-400",
  },
  upcoming: {
    label: "Upcoming",
    color: "text-cyan-400",
    bg: "bg-cyan-950 border-cyan-800",
    dot: "bg-cyan-400",
  },
};

// Status pipeline shown in MyProjects progress bar
const STATUS_PIPELINE = ["submitted", "planning", "active", "finished"];

const appStatusConfig = {
  pending: {
    label: "Pending Review",
    color: "text-yellow-400",
    bg: "bg-yellow-950 border-yellow-800",
  },
  approved: {
    label: "Approved",
    color: "text-green-400",
    bg: "bg-green-950 border-green-800",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-400",
    bg: "bg-red-950 border-red-800",
  },
};

const formatDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const inputCls =
  "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors duration-200";

const labelCls =
  "block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5";

// ─────────────────────────────────────────────────────────────
// src/components/NotDeveloperModal.jsx (inlined)
// Shown when a non-developer tries to apply to a project
// ─────────────────────────────────────────────────────────────
const NotDeveloperModal = ({ onClose, onApply }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 bg-opacity-80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl shadow-black"
      >
        <div className="w-16 h-16 rounded-full bg-purple-950 border-2 border-purple-700 flex items-center justify-center text-3xl mx-auto">
          🔒
        </div>
        <div>
          <h3 className="text-white text-xl font-black">
            Developer Access Required
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Only verified XSTN developers can apply to work on projects. Apply
            to become a developer first — it only takes 2 minutes.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 24px rgba(168,85,247,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={onApply}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-sm"
          >
            Apply to Become a Developer →
          </motion.button>
          <button
            onClick={onClose}
            className="text-slate-500 text-sm hover:text-slate-300 transition-colors duration-200"
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────
// src/components/ApplyToProjectModal.jsx (inlined)
// Shown when a verified developer clicks "Apply to Work"
// Inserts into: project_developers
// ─────────────────────────────────────────────────────────────
const ApplyToProjectModal = ({ project, user, onClose, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleApply = async () => {
    setSubmitting(true);
    setError(null);

    // Check if already applied
    const { data: existing } = await supabase
      .from("project_developers")
      .select("id")
      .eq("project_id", project.id)
      .eq("developer_id", user.id)
      .maybeSingle();

    if (existing) {
      setError("You have already applied to this project.");
      setSubmitting(false);
      return;
    }

    const { error: err } = await supabase.from("project_developers").insert([
      {
        project_id: project.id,
        developer_id: user.id,
        message: message.trim() || null,
        status: "pending",
      },
    ]);

    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSuccess?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 bg-opacity-80 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-lg w-full space-y-5 shadow-2xl shadow-black"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white text-xl font-black">Apply to Work</h3>
              <p className="text-slate-500 text-sm mt-1">
                Applying for:{" "}
                <span className="text-cyan-400 font-semibold">
                  {project.name}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-400 text-xl leading-none mt-1"
            >
              ✕
            </button>
          </div>

          {/* Tech Stack preview */}
          {project.tech_stack?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className={labelCls}>
              Why should we pick you? (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Mention relevant skills, past projects, or why this project excites you..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 24px rgba(34,211,238,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApply}
              disabled={submitting}
              className="flex-1 py-3.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Application →"}
            </motion.button>
            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────
// src/components/DashboardNavbar.jsx (inlined)
// ─────────────────────────────────────────────────────────────
const DashboardNavbar = ({ user, onLogout, activeTab, setActiveTab }) => {
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "XS";
  const tabs = [
    { id: "projects", label: "My Projects" },
    { id: "all", label: "All Projects" },
    { id: "build", label: "Request a Project" },
    { id: "apply", label: "Become a Developer" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950 border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-sm">
            X
          </div>
          <div>
            <span className="text-white font-black text-lg tracking-wider">
              XSTN
            </span>
            <p className="text-slate-500 text-xs tracking-widest -mt-1">
              XPLOREVO
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-slate-800 text-cyan-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-full px-4 py-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">
              {initials}
            </div>
            <span className="text-slate-300 text-xs font-medium max-w-xs truncate">
              {user?.email}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLogout}
            className="px-4 py-2 rounded-full border border-slate-700 text-slate-400 text-xs font-semibold hover:border-red-700 hover:text-red-400 transition-colors duration-200"
          >
            Log Out
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

// ─────────────────────────────────────────────────────────────
// src/components/StatsOverview.jsx (inlined)
// ─────────────────────────────────────────────────────────────
const StatsOverview = ({ projects, applicationStatus }) => {
  const active = projects.filter((p) => p.status === "active").length;
  const finished = projects.filter((p) => p.status === "finished").length;

  const appBadge =
    applicationStatus === "approved"
      ? { icon: "✅", label: "Dev: Approved", color: "text-green-400" }
      : applicationStatus === "pending"
        ? { icon: "⏳", label: "Dev: Pending", color: "text-yellow-400" }
        : applicationStatus === "rejected"
          ? { icon: "❌", label: "Dev: Rejected", color: "text-red-400" }
          : { icon: "👨‍💻", label: "Not Applied", color: "text-slate-500" };

  const stats = [
    {
      label: "My Projects",
      value: projects.length,
      icon: "🗂️",
      color: "text-cyan-400",
    },
    { label: "Active", value: active, icon: "⚡", color: "text-green-400" },
    {
      label: "Finished",
      value: finished,
      icon: "✅",
      color: "text-purple-400",
    },
    {
      label: appBadge.label,
      value: appBadge.icon,
      icon: "",
      color: appBadge.color,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4, boxShadow: "0 0 24px rgba(34,211,238,0.1)" }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2"
        >
          {s.icon && <span className="text-2xl">{s.icon}</span>}
          <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
          <span className="text-slate-500 text-xs tracking-widest uppercase">
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/components/StatusPipeline.jsx (inlined)
// Visual progress bar for submitted → planning → active → finished
// ─────────────────────────────────────────────────────────────
const StatusPipeline = ({ currentStatus }) => {
  const currentIdx = STATUS_PIPELINE.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-0 mt-4">
      {STATUS_PIPELINE.map((s, i) => {
        const cfg = statusConfig[s];
        const isDone = i <= currentIdx;
        const isCurrent = i === currentIdx;
        const isLast = i === STATUS_PIPELINE.length - 1;

        return (
          <div key={s} className="flex items-center flex-1 min-w-0">
            {/* Step */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all duration-300 ${
                  isDone
                    ? `${cfg.dot} border-transparent text-white`
                    : "bg-slate-800 border-slate-600 text-slate-600"
                } ${isCurrent ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-cyan-400" : ""}`}
              >
                {isDone ? (i < currentIdx ? "✓" : "●") : i + 1}
              </motion.div>
              <span
                className={`text-xs font-semibold capitalize whitespace-nowrap ${isDone ? cfg.color : "text-slate-600"}`}
              >
                {s}
              </span>
            </div>
            {/* Connector */}
            {!isLast && (
              <div className="flex-1 mx-1 h-0.5 rounded-full overflow-hidden bg-slate-700 mb-4">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: i < currentIdx ? "100%" : "0%" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="h-full bg-cyan-500 rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/components/MyProjectCard.jsx (inlined)
// Shows status pipeline + full project details
// ─────────────────────────────────────────────────────────────
const MyProjectCard = ({ project, index }) => {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[project.status] ?? {
    label: project.status ?? "Unknown",
    color: "text-slate-400",
    bg: "bg-slate-800 border-slate-700",
    dot: "bg-slate-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ boxShadow: "0 0 28px rgba(34,211,238,0.08)" }}
      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300"
    >
      <div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate">
              {project.name}
            </h3>
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.bg} ${status.color}`}
            >
              {status.label}
            </span>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-slate-500 text-sm"
            >
              ▾
            </motion.span>
          </div>
        </div>

        {/* Tech Stack */}
        {project.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tech_stack.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Status Pipeline — always visible */}
        {STATUS_PIPELINE.includes(project.status) && (
          <StatusPipeline currentStatus={project.status} />
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-800 pt-5 grid sm:grid-cols-3 gap-5">
              {[
                { label: "Start Date", value: formatDate(project.start_date) },
                { label: "Deadline", value: formatDate(project.deadline) },
                { label: "Created", value: formatDate(project.created_at) },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold mb-1">
                    {f.label}
                  </p>
                  <p className="text-slate-300 text-sm font-medium">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/components/BrowseProjectCard.jsx (inlined)
// All-projects view — shows Apply to Work button
// Guards: only approved developers can apply
// ─────────────────────────────────────────────────────────────
const BrowseProjectCard = ({
  project,
  index,
  isDeveloper,
  onNotDeveloper,
  onApplySuccess,
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);

  const status = statusConfig[project.status] ?? {
    label: project.status ?? "Unknown",
    color: "text-slate-400",
    bg: "bg-slate-800 border-slate-700",
    dot: "bg-slate-400",
  };

  const handleApplyClick = () => {
    if (!isDeveloper) {
      onNotDeveloper();
      return;
    }
    setShowApplyModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        whileHover={{ y: -5, boxShadow: "0 0 32px rgba(34,211,238,0.1)" }}
        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
      >
        {/* Top Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate group-hover:text-cyan-400">
              {project.name}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              {formatDate(project.created_at)}
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 flex items-center gap-1.5 ${status.bg} ${status.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Dates Row */}
        <div className="flex gap-4 text-xs text-slate-600">
          {project.start_date && (
            <span>
              Start:{" "}
              <span className="text-slate-400">
                {formatDate(project.start_date)}
              </span>
            </span>
          )}
          {project.deadline && (
            <span>
              Due:{" "}
              <span className="text-slate-400">
                {formatDate(project.deadline)}
              </span>
            </span>
          )}
        </div>

        {/* Apply Button */}
        <motion.button
          whileHover={{ scale: applied ? 1 : 1.02 }}
          whileTap={{ scale: applied ? 1 : 0.97 }}
          onClick={handleApplyClick}
          disabled={applied}
          className={`mt-auto w-full py-3 rounded-xl text-sm font-black tracking-wide transition-all duration-200 ${
            applied
              ? "bg-green-950 border border-green-800 text-green-400 cursor-default"
              : isDeveloper
                ? "bg-cyan-500 text-slate-950 hover:shadow-lg"
                : "border border-slate-700 text-slate-400 hover:border-purple-600 hover:text-purple-400"
          }`}
        >
          {applied
            ? "✓ Application Submitted"
            : isDeveloper
              ? "Apply to Work →"
              : "🔒 Apply to Work (Developer only)"}
        </motion.button>
      </motion.div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyToProjectModal
          project={project}
          user={null /* passed from parent via prop — see AllProjectsSection */}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setApplied(true);
            onApplySuccess?.();
          }}
        />
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/MyProjectsSection.jsx (inlined)
// Fetches projects WHERE created_by = user.id
// Shows StatusPipeline for submitted/planning/active/finished
// ─────────────────────────────────────────────────────────────
const MyProjectsSection = ({ user, onStatsUpdate }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("projectapplications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setProjects(data ?? []);
      onStatsUpdate?.(data ?? []);
      setLoading(false);
    };
    load();
  }, [user.id]);

  // Filter tabs use exact DB values
  const ALL_STATUSES = ["all", "submitted", "planning", "active", "finished"];
  const statuses = ALL_STATUSES.filter(
    (s) => s === "all" || projects.some((p) => p.status === s),
  );
  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white text-2xl font-black">My Projects</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading
              ? "Fetching from Supabase..."
              : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {!loading && projects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all duration-200 ${
                  filter === s
                    ? "bg-cyan-500 text-slate-950 border-cyan-500"
                    : "border-slate-700 text-slate-400 hover:border-cyan-700 hover:text-cyan-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      {!loading && projects.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider mr-1">
            Project States:
          </span>
          {STATUS_PIPELINE.map((s) => {
            const cfg = statusConfig[s];
            return (
              <span
                key={s}
                className="flex items-center gap-1.5 text-xs font-medium"
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className={cfg.color}>{cfg.label}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl h-32"
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-950 border border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-400 font-semibold text-sm">
            Failed to load projects
          </p>
          <p className="text-red-600 text-xs mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-14 text-center space-y-4"
        >
          <span className="text-5xl">🚀</span>
          <h3 className="text-white text-xl font-black">No projects yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Head to "Build a Project" to submit your first brief.
          </p>
        </motion.div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((p, i) => (
            <MyProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}

      {!loading && !error && projects.length > 0 && filtered.length === 0 && (
        <p className="text-center py-10 text-slate-500 text-sm">
          No projects match this filter.
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/AllProjectsSection.jsx (inlined)
// Fetches ALL projects from DB
// "Apply to Work" guarded by developer status
// ─────────────────────────────────────────────────────────────
const AllProjectsSection = ({ user, isDeveloper, onGoToApply }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showDevModal, setShowDevModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setProjects(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const ALL_STATUSES = ["all", "submitted", "planning", "active", "finished"];
  const statuses = ALL_STATUSES.filter(
    (s) => s === "all" || projects.some((p) => p.status === s),
  );

  const filtered = projects
    .filter((p) => filter === "all" || p.status === filter)
    .filter(
      (p) =>
        !search.trim() ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.tech_stack?.some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        ),
    );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white text-2xl font-black">All Projects</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading
              ? "Fetching from Supabase..."
              : `${projects.length} project${projects.length !== 1 ? "s" : ""} in database`}
          </p>
        </div>
        {!isDeveloper && !loading && (
          <div className="flex items-center gap-2 bg-purple-950 border border-purple-800 rounded-full px-4 py-2">
            <span className="text-purple-400 text-xs font-semibold">
              🔒 Apply as developer to work on projects
            </span>
          </div>
        )}
        {isDeveloper && (
          <div className="flex items-center gap-2 bg-green-950 border border-green-800 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">
              Verified Developer
            </span>
          </div>
        )}
      </div>

      {/* Search + Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, description or tech stack..."
          className={`${inputCls} flex-1`}
        />
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border capitalize transition-all duration-200 whitespace-nowrap ${
                filter === s
                  ? "bg-cyan-500 text-slate-950 border-cyan-500"
                  : "border-slate-700 text-slate-400 hover:border-cyan-700 hover:text-cyan-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl h-52"
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-950 border border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-400 font-semibold text-sm">
            Failed to load projects
          </p>
          <p className="text-red-600 text-xs mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <span className="text-4xl">🔍</span>
          <p className="text-white font-black text-lg">No projects found</p>
          <p className="text-slate-500 text-sm">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Project Grid */}
      {!loading && !error && filtered.length > 0 && (
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <BrowseProjectCard
                key={p.id}
                project={p}
                index={i}
                isDeveloper={isDeveloper}
                user={user}
                onNotDeveloper={() => setShowDevModal(true)}
                onApplySuccess={() => {}}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Not Developer Modal */}
      {showDevModal && (
        <NotDeveloperModal
          onClose={() => setShowDevModal(false)}
          onApply={() => {
            setShowDevModal(false);
            onGoToApply();
          }}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/BuildProjectSection.jsx (inlined)
// INSERT into projects table
// ─────────────────────────────────────────────────────────────
const BuildProjectSection = ({ user, onProjectCreated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    tech_stack: "",
    start_date: "",
    deadline: "",
    status: "submitted",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const set = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      setError("Project name and description are required.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/projectapplication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            tech_stack: form.tech_stack.trim(),
            deadline: form.deadline || undefined,
          }),
        },
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Submission failed.");

      setSuccess(true);
      setForm({
        name: "",
        description: "",
        tech_stack: "",
        start_date: "",
        deadline: "",
        status: "submitted",
      });
      onProjectCreated?.();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white text-2xl font-black">Build a Project</h2>
        <p className="text-slate-500 text-sm mt-0.5">
          Submit a brief — your XSTN squad will execute it.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-5">
            <h3 className="text-white font-black text-lg">
              Why build with XSTN?
            </h3>
            {[
              {
                icon: "⚡",
                title: "Fast MVPs",
                desc: "Shipped in 4-8 weeks by dedicated squads.",
              },
              {
                icon: "💰",
                title: "Cost-Effective",
                desc: "Enterprise quality at startup pricing.",
              },
              {
                icon: "🔧",
                title: "Real Tech Stacks",
                desc: "React, Flutter, AI/ML, IoT — anything.",
              },
              {
                icon: "📊",
                title: "Transparent",
                desc: "Weekly demos, GitHub access, live updates.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="text-xl mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-white text-sm font-bold">{f.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pipeline preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <p className="text-white text-sm font-black">
              Your project's journey:
            </p>
            <StatusPipeline currentStatus="submitted" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5"
        >
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-950 border border-green-800 rounded-xl px-4 py-3"
              >
                <p className="text-green-400 text-sm font-semibold">
                  Project submitted! Status set to{" "}
                  <span className="text-cyan-400">submitted</span>. We will be
                  in touch within 24 hours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className={labelCls}>Project Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={set}
              placeholder="e.g. Campus Food Delivery App"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={set}
              rows={4}
              placeholder="What does it do? Who uses it? What problem does it solve?"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>
              Tech Stack{" "}
              <span className="normal-case text-slate-600">
                (comma-separated)
              </span>
            </label>
            <input
              name="tech_stack"
              value={form.tech_stack}
              onChange={set}
              placeholder="e.g. React, Node.js, PostgreSQL"
              className={inputCls}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={set}
                className={inputCls}
              />
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 28px rgba(34,211,238,0.35)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm tracking-wide disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Project Brief →"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/BecomeDeveloperSection.jsx (inlined)
// POST multipart/form-data to /api/developer/apply
// developer_applications: id, user_id, name, email, tech_stack[],
//   resume_url, github_url, linkedin_url, status, reviewed_by,
//   reviewed_at, created_at
// ─────────────────────────────────────────────────────────────
const BecomeDeveloperSection = ({ user }) => {
  const [form, setForm] = useState({
    name: "",
    email: user?.email ?? "",
    github_url: "",
    linkedin_url: "",
    tech_stack: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existing, setExisting] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase
        .from("developer_applications")
        .select("status, created_at, name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) setExisting(data);
    };
    check();
  }, [user.id]);

  const set = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Resume must be a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    setError(null);
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!resumeFile) {
      setError("Please upload your resume PDF.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("email", form.email.trim());
    fd.append("github_url", form.github_url.trim());
    fd.append("linkedin_url", form.linkedin_url.trim());
    fd.append("tech_stack", form.tech_stack.trim());
    fd.append("resume", resumeFile);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/developerForm`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session?.access_token}` },
          body: fd,
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Submission failed.");
      setSuccess(true);
      setExisting({
        status: "pending",
        created_at: new Date().toISOString(),
        name: form.name,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (existing) {
    const st = appStatusConfig[existing.status] ?? appStatusConfig.pending;
    const statusIcon =
      existing.status === "approved"
        ? "✅"
        : existing.status === "rejected"
          ? "❌"
          : "⏳";
    const statusMsg =
      existing.status === "approved"
        ? "Welcome to XSTN! Check your email for onboarding details."
        : existing.status === "rejected"
          ? "Your application was not selected this round. You can reapply after 30 days."
          : "We received your application. Our team is reviewing it — expect a response within 48 hours.";

    return (
      <div>
        <div className="mb-8">
          <h2 className="text-white text-2xl font-black">Become a Developer</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Track your XSTN developer application.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col items-center gap-6 text-center"
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2 ${st.bg}`}
          >
            {statusIcon}
          </div>
          <div>
            <h3 className="text-white text-2xl font-black">
              {existing.status === "approved"
                ? "You are in!"
                : existing.status === "rejected"
                  ? "Not this time"
                  : "Application Under Review"}
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-sm">{statusMsg}</p>
          </div>
          <span
            className={`text-sm font-bold px-5 py-2 rounded-full border ${st.bg} ${st.color}`}
          >
            {st.label}
          </span>
          <p className="text-slate-600 text-xs">
            Applied on {formatDate(existing.created_at)}
          </p>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <div className="mb-8">
          <h2 className="text-white text-2xl font-black">Become a Developer</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-12 flex flex-col items-center gap-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-green-950 border-2 border-green-700 flex items-center justify-center text-4xl"
          >
            ✓
          </motion.div>
          <div>
            <h3 className="text-white font-black text-2xl">
              Application Submitted!
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs">
              Resume uploaded. Our team will reach out within 48 hours.
            </p>
          </div>
          <span className="text-green-400 text-xs font-semibold px-4 py-2 bg-green-950 border border-green-800 rounded-full">
            Welcome to the XSTN waitlist
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-white text-2xl font-black">Become a Developer</h2>
        <p className="text-slate-500 text-sm mt-0.5">
          Join 500+ student engineers building real products.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-5">
            <h3 className="text-white font-black text-lg">What you get</h3>
            {[
              {
                icon: "💻",
                title: "Live Production Projects",
                desc: "Ship real code, not toy problems.",
              },
              {
                icon: "🏆",
                title: "Portfolio That Stands Out",
                desc: "Real project links beat LeetCode.",
              },
              {
                icon: "🤝",
                title: "500+ Engineer Network",
                desc: "Across 30+ colleges, 8 tech domains.",
              },
              {
                icon: "🎓",
                title: "Mentorship and Certs",
                desc: "Senior guidance + verifiable certificates.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="text-xl mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-white text-sm font-bold">{f.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-purple-950 to-slate-900 border border-purple-900 rounded-3xl p-6">
            <p className="text-purple-300 text-sm font-bold mb-1">
              What we look for
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Any skill level is welcome. A solid GitHub and a PDF resume are
              all you need. Consistency and drive matter more than years of
              experience.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5"
        >
          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={set}
              placeholder="Aryan Sharma"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input
              name="email"
              value={form.email}
              onChange={set}
              type="email"
              placeholder="aryan@college.edu"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>
              Tech Stack *{" "}
              <span className="normal-case text-slate-600">
                (comma-separated)
              </span>
            </label>
            <input
              name="tech_stack"
              value={form.tech_stack}
              onChange={set}
              placeholder="React, Node.js, MongoDB, Flutter"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>GitHub URL</label>
            <input
              name="github_url"
              value={form.github_url}
              onChange={set}
              placeholder="https://github.com/yourhandle"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>LinkedIn URL</label>
            <input
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={set}
              placeholder="https://linkedin.com/in/yourprofile"
              className={inputCls}
            />
          </div>

          {/* PDF Drop Zone */}
          <div>
            <label className={labelCls}>Resume PDF * (max 5MB)</label>
            <motion.div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              animate={{
                borderColor: dragOver
                  ? "#22d3ee"
                  : resumeFile
                    ? "#22d3ee"
                    : "#334155",
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-200 ${
                resumeFile
                  ? "bg-cyan-950 bg-opacity-30"
                  : "hover:border-slate-600"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {resumeFile ? (
                <div className="space-y-1">
                  <p className="text-cyan-400 font-bold text-sm">
                    📄 {resumeFile.name}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {(resumeFile.size / 1024).toFixed(0)} KB — click to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-slate-400 text-sm font-medium">
                    Drop your PDF here
                  </p>
                  <p className="text-slate-600 text-xs">or click to browse</p>
                </div>
              )}
            </motion.div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 28px rgba(168,85,247,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-sm tracking-wide disabled:opacity-50"
          >
            {submitting
              ? "Submitting application..."
              : "Apply Now — It's Free →"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/pages/Dashboard.jsx — Main export
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [projectsKey, setProjectsKey] = useState(0);
  const [projects, setProjects] = useState([]);
  const [appStatus, setAppStatus] = useState(null);
  const navigate = useNavigate();

  // isDeveloper = true only when application status is "approved"
  const isDeveloper = appStatus === "approved";

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: l } = supabase.auth.onAuthStateChange((_, s) =>
      setUser(s?.user ?? null),
    );
    return () => l.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("developer_applications")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setAppStatus(data?.status ?? null));
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Unable to logout");
      return;
    }
    navigate("/home");
  };
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-lg">
            X
          </div>
          <p className="text-slate-500 text-sm">Loading session...</p>
        </motion.div>
      </div>
    );
  }

  const mobileTabs = [
    { id: "projects", label: "Mine", icon: "🗂️" },
    { id: "all", label: "Browse", icon: "🌐" },
    { id: "build", label: "Build", icon: "🚀" },
    { id: "apply", label: "Apply", icon: "👨‍💻" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      {/* src/components/DashboardNavbar */}
      <DashboardNavbar
        user={user}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-slate-300 text-xs font-semibold tracking-widest uppercase">
              {isDeveloper ? "✅ Verified Developer · " : ""}
              {user.email}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {user.email?.split("@")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Manage your projects, browse all projects
            {isDeveloper ? " and apply to work on them" : ""}, submit new
            builds, or apply as a developer.
          </p>
        </motion.div>

        {/* src/components/StatsOverview */}
        <StatsOverview projects={projects} applicationStatus={appStatus} />

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden gap-1 mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-1">
          {mobileTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-slate-800 text-cyan-400"
                  : "text-slate-500"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* src/sections/MyProjectsSection */}
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <MyProjectsSection
                key={projectsKey}
                user={user}
                onStatsUpdate={setProjects}
              />
            </motion.div>
          )}

          {/* src/sections/AllProjectsSection */}
          {activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <AllProjectsSection
                user={user}
                isDeveloper={isDeveloper}
                onGoToApply={() => setActiveTab("apply")}
              />
            </motion.div>
          )}

          {/* src/sections/BuildProjectSection */}
          {activeTab === "build" && (
            <motion.div
              key="build"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <BuildProjectSection
                user={user}
                onProjectCreated={() => {
                  setProjectsKey((k) => k + 1);
                  setTimeout(() => setActiveTab("projects"), 1800);
                }}
              />
            </motion.div>
          )}

          {/* src/sections/BecomeDeveloperSection */}
          {activeTab === "apply" && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <BecomeDeveloperSection user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
