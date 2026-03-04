// src/pages/AdminPanel.jsx
// XSTN Admin Dashboard — full management panel
// Access control: checks users.role === 'admin' from Supabase

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../config/createClient";

// ─────────────────────────────────────────────────────────────
// src/config/adminConstants.js (inlined)
// ─────────────────────────────────────────────────────────────
const PROJECT_STATUSES = ["submitted", "planning", "active", "finished"];
const APP_STATUSES = ["pending", "approved", "rejected"];

const STATUS_COLORS = {
  submitted: {
    text: "text-cyan-400",
    bg: "bg-cyan-950   border-cyan-800",
    dot: "bg-cyan-400",
  },
  planning: {
    text: "text-blue-400",
    bg: "bg-blue-950   border-blue-800",
    dot: "bg-blue-400",
  },
  active: {
    text: "text-green-400",
    bg: "bg-green-950  border-green-800",
    dot: "bg-green-400",
  },
  finished: {
    text: "text-purple-400",
    bg: "bg-purple-950 border-purple-800",
    dot: "bg-purple-400",
  },
  pending: {
    text: "text-yellow-400",
    bg: "bg-yellow-950 border-yellow-800",
    dot: "bg-yellow-400",
  },
  approved: {
    text: "text-green-400",
    bg: "bg-green-950  border-green-800",
    dot: "bg-green-400",
  },
  rejected: {
    text: "text-red-400",
    bg: "bg-red-950    border-red-800",
    dot: "bg-red-400",
  },
};

const sc = (s) =>
  STATUS_COLORS[s] ?? {
    text: "text-slate-400",
    bg: "bg-slate-800 border-slate-700",
    dot: "bg-slate-400",
  };

const fmt = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const inputCls =
  "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors duration-200";
const labelCls =
  "block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5";
const thCls =
  "px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap";
const tdCls = "px-4 py-4 text-sm text-slate-300 align-top";

// ─────────────────────────────────────────────────────────────
// src/components/admin/StatusBadge.jsx (inlined)
// ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const c = sc(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status ?? "unknown"}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// src/components/admin/TechPills.jsx (inlined)
// ─────────────────────────────────────────────────────────────
const TechPills = ({ stack }) => (
  <div className="flex flex-wrap gap-1">
    {(stack ?? []).map((t) => (
      <span
        key={t}
        className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono border border-slate-700"
      >
        {t}
      </span>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// src/components/admin/ConfirmModal.jsx (inlined)
// ─────────────────────────────────────────────────────────────
const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
  onClose,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-slate-900 border border-slate-700 rounded-2xl p-7 max-w-sm w-full space-y-5 shadow-2xl"
    >
      <h3 className="text-white font-black text-lg">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className={`flex-1 py-2.5 rounded-xl font-black text-sm ${confirmClass}`}
        >
          {confirmLabel}
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// src/components/admin/Toast.jsx (inlined)
// ─────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          className={`px-5 py-3 rounded-xl border text-sm font-semibold shadow-lg ${
            t.type === "success"
              ? "bg-green-950 border-green-800 text-green-400"
              : t.type === "error"
                ? "bg-red-950 border-red-800 text-red-400"
                : "bg-slate-800 border-slate-700 text-slate-300"
          }`}
        >
          {t.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// ─────────────────────────────────────────────────────────────
// src/components/admin/Sidebar.jsx (inlined)
// ─────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "projects", icon: "🗂️", label: "Projects" },
  { id: "applications", icon: "📋", label: "Dev Applications" },
  { id: "developers", icon: "👨‍💻", label: "Developers" },
  { id: "assignments", icon: "🔗", label: "Assignments" },
  { id: "users", icon: "👥", label: "Users" },
];

const Sidebar = ({ active, onChange, counts }) => (
  <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-950 border-r border-slate-800 z-40 flex flex-col">
    {/* Logo */}
    <div className="px-6 py-5 border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-sm">
          X
        </div>
        <div>
          <span className="text-white font-black tracking-wider">XSTN</span>
          <p className="text-red-400 text-xs font-bold tracking-widest">
            ADMIN
          </p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {SIDEBAR_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            active === item.id
              ? "bg-cyan-500 bg-opacity-10 text-cyan-400 border border-cyan-900"
              : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-base">{item.icon}</span>
            {item.label}
          </div>
          {counts?.[item.id] != null && (
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full ${
                active === item.id
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {counts[item.id]}
            </span>
          )}
        </button>
      ))}
    </nav>

    {/* Bottom */}
    <div className="px-4 py-4 border-t border-slate-800">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Admin Session Active
      </div>
    </div>
  </aside>
);

// ─────────────────────────────────────────────────────────────
// src/sections/admin/OverviewSection.jsx (inlined)
// ─────────────────────────────────────────────────────────────
const OverviewSection = ({ stats, recentProjects, recentApps }) => {
  const cards = [
    {
      label: "Total Projects",
      value: stats.projects,
      icon: "🗂️",
      color: "text-cyan-400",
      sub: `${stats.activeProjects} active`,
    },
    {
      label: "Developers",
      value: stats.developers,
      icon: "👨‍💻",
      color: "text-purple-400",
      sub: `${stats.activeDevelopers} active`,
    },
    {
      label: "Pending Applications",
      value: stats.pendingApps,
      icon: "📋",
      color: "text-yellow-400",
      sub: "awaiting review",
    },
    {
      label: "Assignments",
      value: stats.assignments,
      icon: "🔗",
      color: "text-green-400",
      sub: "project-dev links",
    },
    {
      label: "Finished Projects",
      value: stats.finished,
      icon: "✅",
      color: "text-green-400",
      sub: "completed",
    },
    {
      label: "Total Users",
      value: stats.users,
      icon: "👥",
      color: "text-blue-400",
      sub: "registered",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Live snapshot of the XSTN platform.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, boxShadow: "0 0 24px rgba(34,211,238,0.08)" }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
                {c.sub}
              </span>
            </div>
            <p className={`text-4xl font-black ${c.color}`}>{c.value ?? "—"}</p>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
              {c.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-white font-black text-sm">Recent Projects</h3>
            <span className="text-slate-600 text-xs">
              {recentProjects.length} shown
            </span>
          </div>
          <div className="divide-y divide-slate-800">
            {recentProjects.length === 0 && (
              <p className="text-slate-600 text-sm p-5">No projects yet.</p>
            )}
            {recentProjects.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="px-5 py-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {p.name}
                  </p>
                  <p className="text-slate-600 text-xs mt-0.5">
                    {fmt(p.created_at)}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-white font-black text-sm">
              Recent Dev Applications
            </h3>
            <span className="text-slate-600 text-xs">
              {recentApps.length} shown
            </span>
          </div>
          <div className="divide-y divide-slate-800">
            {recentApps.length === 0 && (
              <p className="text-slate-600 text-sm p-5">No applications yet.</p>
            )}
            {recentApps.slice(0, 5).map((a) => (
              <div
                key={a.id}
                className="px-5 py-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {a.name}
                  </p>
                  <p className="text-slate-600 text-xs mt-0.5">{a.email}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/admin/ProjectsSection.jsx (inlined)
// Full CRUD: view, edit status, delete, view assigned devs
// ─────────────────────────────────────────────────────────────
const ProjectsSection = ({ toast }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [devMap, setDevMap] = useState({}); // project_id → developers[]

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projectapplications")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const loadDevs = async (projectId) => {
    if (devMap[projectId]) return;
    const { data } = await supabase
      .from("project_developers")
      .select(
        "developer_id, assigned_at, developers(id, name, tech_stack, github_url, is_active)",
      )
      .eq("project_id", projectId);
    setDevMap((m) => ({ ...m, [projectId]: data ?? [] }));
  };

  const handleExpand = (id) => {
    const next = expanded === id ? null : id;
    setExpanded(next);
    if (next) loadDevs(next);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("projectapplications")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast("error", error.message);
      return;
    }
    toast("success", `Status updated to "${status}"`);
    setEditId(null);
    load();
  };

  const deleteProject = async (id) => {
    const { error } = await supabase
      .from("projectapplications")
      .delete()
      .eq("id", id);
    if (error) {
      toast("error", error.message);
      return;
    }
    toast("success", "Application deleted.");
    setConfirm(null);
    load();
  };

  const approveProject = async (app) => {
    const { error: insertErr } = await supabase.from("projects").insert({
      name: app.name,
      user_id: app.userId,
      description: app.description,
      tech_stack: app.tech_stack,
      deadline: app.deadline,
      created_by: app.user_id,
      status: "planning",
    });

    if (insertErr) {
      toast("error", "Failed to create project: " + insertErr.message);
      return;
    }

    const { error: delErr } = await supabase
      .from("projectapplications")
      .delete()
      .eq("id", app.id);

    if (delErr) {
      toast(
        "error",
        "Project created but failed to remove application: " + delErr.message,
      );
      return;
    }

    toast("success", `✅ ${app.name} moved to projects.`);
    setConfirm(null);
    load();
  };

  const removeDevFromProject = async (projectId, developerId) => {
    const { error } = await supabase
      .from("project_developers")
      .delete()
      .eq("project_id", projectId)
      .eq("developer_id", developerId);
    if (error) {
      toast("error", error.message);
      return;
    }
    toast("success", "Developer removed from project.");
    setDevMap((m) => ({ ...m, [projectId]: undefined }));
    loadDevs(projectId);
  };

  const filtered = projects
    .filter((p) => filter === "all" || p.status === filter)
    .filter(
      (p) =>
        !search.trim() ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()),
    );

  const statuses = ["all", ...PROJECT_STATUSES];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">
            {projects.length} total · {filtered.length} shown
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or description..."
          className={`${inputCls} flex-1`}
        />
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border capitalize transition-all duration-200 whitespace-nowrap ${
                filter === s
                  ? "bg-cyan-500 text-slate-950 border-cyan-500"
                  : "border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-0 divide-y divide-slate-800">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
                className="h-16 bg-slate-900"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-600 text-sm">
            No projects match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-950 bg-opacity-60">
                <tr>
                  <th className={thCls}>Project</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Tech Stack</th>
                  <th className={thCls}>Timeline</th>
                  <th className={thCls}>Created</th>
                  <th className={thCls}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((p) => (
                  <>
                    <tr
                      key={p.id}
                      className="hover:bg-slate-800 hover:bg-opacity-40 transition-colors duration-150"
                    >
                      <td className={tdCls}>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {p.name}
                          </p>
                          <p className="text-slate-600 text-xs mt-0.5 max-w-xs truncate">
                            {p.description}
                          </p>
                        </div>
                      </td>
                      <td className={tdCls}>
                        {editId === p.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500"
                            >
                              {PROJECT_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => updateStatus(p.id, editStatus)}
                              className="text-green-400 text-xs font-bold hover:text-green-300"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="text-slate-500 text-xs font-bold hover:text-slate-300"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <StatusBadge status={p.status} />
                            <button
                              onClick={() => {
                                setEditId(p.id);
                                setEditStatus(p.status);
                              }}
                              className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
                            >
                              ✏
                            </button>
                          </div>
                        )}
                      </td>
                      <td className={tdCls}>
                        <TechPills stack={p.tech_stack} />
                      </td>
                      <td className={`${tdCls} whitespace-nowrap`}>
                        <div className="text-xs space-y-0.5">
                          <p className="text-slate-500">
                            Start:{" "}
                            <span className="text-slate-300">
                              {fmt(p.start_date)}
                            </span>
                          </p>
                          <p className="text-slate-500">
                            Due:{" "}
                            <span className="text-slate-300">
                              {fmt(p.deadline)}
                            </span>
                          </p>
                        </div>
                      </td>
                      <td
                        className={`${tdCls} whitespace-nowrap text-xs text-slate-500`}
                      >
                        {fmt(p.created_at)}
                      </td>
                      <td className={tdCls}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleExpand(p.id)}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-cyan-700 hover:text-cyan-400 transition-colors font-semibold"
                          >
                            {expanded === p.id ? "▲ Hide" : "▼ Devs"}
                          </button>
                          <button
                            onClick={() =>
                              setConfirm({ type: "approveProject", app: p })
                            }
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-green-800 text-green-400 hover:bg-green-950 transition-colors font-semibold"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() =>
                              setConfirm({
                                type: "deleteProject",
                                id: p.id,
                                name: p.name,
                              })
                            }
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:border-red-700 hover:text-red-400 transition-colors font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded: Assigned Developers */}
                    {expanded === p.id && (
                      <tr key={`${p.id}-expanded`}>
                        <td
                          colSpan={6}
                          className="px-4 pb-4 pt-0 bg-slate-950 bg-opacity-60"
                        >
                          <div className="rounded-xl border border-slate-800 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                Assigned Developers (
                                {(devMap[p.id] ?? []).length})
                              </span>
                            </div>
                            {(devMap[p.id] ?? []).length === 0 ? (
                              <p className="text-slate-600 text-xs p-4">
                                No developers assigned.
                              </p>
                            ) : (
                              <div className="divide-y divide-slate-800">
                                {(devMap[p.id] ?? []).map((pd) => (
                                  <div
                                    key={pd.developer_id}
                                    className="px-4 py-3 flex items-center justify-between gap-4"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">
                                        {pd.developers?.name?.slice(0, 1) ??
                                          "?"}
                                      </div>
                                      <div>
                                        <p className="text-white text-sm font-semibold">
                                          {pd.developers?.name ?? "Unknown"}
                                        </p>
                                        <p className="text-slate-600 text-xs">
                                          Assigned: {fmt(pd.assigned_at)}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <TechPills
                                        stack={pd.developers?.tech_stack?.slice(
                                          0,
                                          3,
                                        )}
                                      />
                                      {pd.developers?.github_url && (
                                        <a
                                          href={pd.developers.github_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-slate-500 hover:text-cyan-400 text-xs transition-colors"
                                        >
                                          GitHub ↗
                                        </a>
                                      )}
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full border ${pd.developers?.is_active ? "bg-green-950 border-green-800 text-green-400" : "bg-slate-800 border-slate-700 text-slate-500"}`}
                                      >
                                        {pd.developers?.is_active
                                          ? "Active"
                                          : "Inactive"}
                                      </span>
                                      <button
                                        onClick={() =>
                                          setConfirm({
                                            type: "removeDev",
                                            projectId: p.id,
                                            developerId: pd.developer_id,
                                            name: pd.developers?.name,
                                          })
                                        }
                                        className="text-xs px-2.5 py-1 rounded-lg border border-slate-700 text-slate-500 hover:border-red-700 hover:text-red-400 transition-colors font-semibold"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirm?.type === "deleteProject" && (
          <ConfirmModal
            title="Delete Project"
            message={`Are you sure you want to delete "${confirm.name}"? This cannot be undone.`}
            confirmLabel="Yes, Delete"
            confirmClass="bg-red-600 text-white hover:bg-red-700"
            onConfirm={() => deleteProject(confirm.id)}
            onClose={() => setConfirm(null)}
          />
        )}
        {confirm?.type === "approveProject" && (
          <ConfirmModal
            title="Approve Project"
            message={`Move "${confirm.app.name}" to projects and set status to planning?`}
            confirmLabel="Yes, Approve"
            confirmClass="bg-green-600 text-white hover:bg-green-700"
            onConfirm={() => approveProject(confirm.app)}
            onClose={() => setConfirm(null)}
          />
        )}
        {confirm?.type === "removeDev" && (
          <ConfirmModal
            title="Remove Developer"
            message={`Remove "${confirm.name}" from this project?`}
            confirmLabel="Remove"
            confirmClass="bg-red-600 text-white hover:bg-red-700"
            onConfirm={() =>
              removeDevFromProject(confirm.projectId, confirm.developerId)
            }
            onClose={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/admin/ApplicationsSection.jsx (inlined)
// Approve / reject developer applications
// On approve: also INSERT into developers table
// ─────────────────────────────────────────────────────────────
const ApplicationsSection = ({ toast, adminId }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("developer_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApps(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateAppStatus = async (id, status, app) => {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("developer_applications")
      .update({ status, reviewed_by: adminId, reviewed_at: now })
      .eq("id", id);

    if (error) {
      toast("error", error.message);
      return;
    }

    // If approved → insert into developers table
    if (status === "approved") {
      const { error: devErr } = await supabase.from("developers").upsert(
        {
          user_id: app.user_id,
          name: app.name,
          tech_stack: app.tech_stack,
          github_url: app.github_url,
          linkedin_url: app.linkedin_url,
          resume_url: app.resume_url,
          is_active: true,
        },
        { onConflict: "user_id" },
      );

      if (devErr) {
        toast("error", "Developer insert failed: " + devErr.message);
        return;
      }

      // Delete from developer_applications after successful insert
      const { error: delErr } = await supabase
        .from("developer_applications")
        .delete()
        .eq("id", id);

      if (delErr) {
        toast(
          "error",
          "Inserted but failed to remove application: " + delErr.message,
        );
        return;
      }

      toast("success", `✅ ${app.name} approved and added to developers.`);
    }
    setConfirm(null);
    load();
  };

  const filtered = apps
    .filter((a) => filter === "all" || a.status === filter)
    .filter(
      (a) =>
        !search.trim() ||
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase()),
    );

  const pendingCount = apps.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">
            Developer Applications
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {pendingCount > 0 ? (
              <span className="text-yellow-400 font-semibold">
                {pendingCount} pending review
              </span>
            ) : (
              "All reviewed"
            )}{" "}
            · {apps.length} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className={`${inputCls} flex-1`}
        />
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border capitalize transition-all duration-200 ${
                filter === s
                  ? "bg-cyan-500 text-slate-950 border-cyan-500"
                  : "border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-800">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
                className="h-20 bg-slate-900"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-600 text-sm">
            No applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-950 bg-opacity-60">
                <tr>
                  <th className={thCls}>Applicant</th>
                  <th className={thCls}>Tech Stack</th>
                  <th className={thCls}>Links</th>
                  <th className={thCls}>Applied</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((a) => (
                  <>
                    <tr
                      key={a.id}
                      className="hover:bg-slate-800 hover:bg-opacity-30 transition-colors"
                    >
                      <td className={tdCls}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                            {a.name?.slice(0, 1) ?? "?"}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {a.name}
                            </p>
                            <p className="text-slate-600 text-xs">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className={tdCls}>
                        <TechPills stack={a.tech_stack} />
                      </td>
                      <td className={tdCls}>
                        <div className="flex flex-col gap-1">
                          {a.github_url && (
                            <a
                              href={a.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 text-xs hover:underline"
                            >
                              GitHub ↗
                            </a>
                          )}
                          {a.linkedin_url && (
                            <a
                              href={a.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 text-xs hover:underline"
                            >
                              LinkedIn ↗
                            </a>
                          )}
                          {a.resume_url && (
                            <a
                              href={a.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-400 text-xs hover:underline"
                            >
                              Resume ↗
                            </a>
                          )}
                        </div>
                      </td>
                      <td
                        className={`${tdCls} text-xs text-slate-500 whitespace-nowrap`}
                      >
                        {fmt(a.created_at)}
                      </td>
                      <td className={tdCls}>
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={a.status} />
                          {a.reviewed_at && (
                            <p className="text-slate-700 text-xs">
                              {fmt(a.reviewed_at)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className={tdCls}>
                        {a.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                setConfirm({ type: "approve", app: a })
                              }
                              className="text-xs px-3 py-1.5 rounded-lg bg-green-950 border border-green-800 text-green-400 hover:bg-green-900 font-bold transition-colors"
                            >
                              ✓ Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                setConfirm({ type: "reject", app: a })
                              }
                              className="text-xs px-3 py-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 font-bold transition-colors"
                            >
                              ✕ Reject
                            </motion.button>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {confirm?.type === "approve" && (
          <ConfirmModal
            title="Approve Application"
            message={`Approve ${confirm.app.name}? They will be added to the developers table and can apply to projects.`}
            confirmLabel="Yes, Approve"
            confirmClass="bg-green-600 text-white hover:bg-green-700"
            onConfirm={() =>
              updateAppStatus(confirm.app.id, "approved", confirm.app)
            }
            onClose={() => setConfirm(null)}
          />
        )}
        {confirm?.type === "reject" && (
          <ConfirmModal
            title="Reject Application"
            message={`Reject ${confirm.app.name}'s application?`}
            confirmLabel="Yes, Reject"
            confirmClass="bg-red-600 text-white hover:bg-red-700"
            onConfirm={() =>
              updateAppStatus(confirm.app.id, "rejected", confirm.app)
            }
            onClose={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/admin/DevelopersSection.jsx (inlined)
// View all developers, toggle is_active, view profiles
// ─────────────────────────────────────────────────────────────
const DevelopersSection = ({ toast }) => {
  const [devs, setDevs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("developers")
      .select("*, project_developers(project_id)")
      .order("created_at", { ascending: false });
    setDevs(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActive = async (id, current) => {
    const { error } = await supabase
      .from("developers")
      .update({ is_active: !current })
      .eq("id", id);
    if (error) {
      toast("error", error.message);
      return;
    }
    toast("success", `Developer ${!current ? "activated" : "deactivated"}.`);
    setConfirm(null);
    load();
  };

  const deleteDev = async (id) => {
    const { error } = await supabase.from("developers").delete().eq("id", id);
    if (error) {
      toast("error", error.message);
      return;
    }
    toast("success", "Developer removed.");
    setConfirm(null);
    load();
  };

  const filtered = devs
    .filter((d) =>
      filter === "all"
        ? true
        : filter === "active"
          ? d.is_active
          : !d.is_active,
    )
    .filter(
      (d) =>
        !search.trim() ||
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.tech_stack?.some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        ),
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Developers</h1>
        <p className="text-slate-500 text-sm mt-1">
          {devs.length} total · {devs.filter((d) => d.is_active).length} active
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or tech stack..."
          className={`${inputCls} flex-1`}
        />
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border capitalize transition-all duration-200 ${
                filter === s
                  ? "bg-cyan-500 text-slate-950 border-cyan-500"
                  : "border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Developer Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl h-44"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600 text-sm">
          No developers found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{
                y: -4,
                boxShadow: "0 0 24px rgba(34,211,238,0.08)",
              }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-base shrink-0">
                    {d.name?.slice(0, 1) ?? "?"}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{d.name}</p>
                    <p className="text-slate-600 text-xs">
                      {d.project_developers?.length ?? 0} project
                      {d.project_developers?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-semibold shrink-0 ${d.is_active ? "bg-green-950 border-green-800 text-green-400" : "bg-slate-800 border-slate-700 text-slate-500"}`}
                >
                  {d.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Tech Stack */}
              <TechPills stack={d.tech_stack} />

              {/* Links */}
              <div className="flex gap-3 text-xs">
                {d.github_url && (
                  <a
                    href={d.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    GitHub ↗
                  </a>
                )}
                {d.linkedin_url && (
                  <a
                    href={d.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    LinkedIn ↗
                  </a>
                )}
                {d.resume_url && (
                  <a
                    href={d.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:underline"
                  >
                    Resume ↗
                  </a>
                )}
              </div>

              <p className="text-slate-700 text-xs">
                Joined: {fmt(d.created_at)}
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-1">
                <button
                  onClick={() => setConfirm({ type: "toggleActive", dev: d })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    d.is_active
                      ? "border-slate-700 text-slate-400 hover:border-yellow-700 hover:text-yellow-400"
                      : "border-slate-700 text-slate-400 hover:border-green-700 hover:text-green-400"
                  }`}
                >
                  {d.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => setConfirm({ type: "deleteDev", dev: d })}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-400 hover:border-red-700 hover:text-red-400 transition-all duration-200"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {confirm?.type === "toggleActive" && (
          <ConfirmModal
            title={
              confirm.dev.is_active
                ? "Deactivate Developer"
                : "Activate Developer"
            }
            message={`${confirm.dev.is_active ? "Deactivate" : "Activate"} ${confirm.dev.name}?`}
            confirmLabel={confirm.dev.is_active ? "Deactivate" : "Activate"}
            confirmClass={
              confirm.dev.is_active
                ? "bg-yellow-600 text-white"
                : "bg-green-600 text-white"
            }
            onConfirm={() =>
              toggleActive(confirm.dev.id, confirm.dev.is_active)
            }
            onClose={() => setConfirm(null)}
          />
        )}
        {confirm?.type === "deleteDev" && (
          <ConfirmModal
            title="Remove Developer"
            message={`Permanently remove ${confirm.dev.name} from the developers table?`}
            confirmLabel="Remove"
            confirmClass="bg-red-600 text-white"
            onConfirm={() => deleteDev(confirm.dev.id)}
            onClose={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/admin/AssignmentsSection.jsx (inlined)
// Add / remove developers from projects
// ─────────────────────────────────────────────────────────────
const AssignmentsSection = ({ toast }) => {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selProject, setSelProject] = useState("");
  const [selDev, setSelDev] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, dRes, aRes] = await Promise.all([
      supabase.from("projects").select("id, name, status").order("name"),
      supabase
        .from("developers")
        .select("id, name, tech_stack, is_active")
        .eq("is_active", true)
        .order("name"),
      supabase
        .from("project_developers")
        .select(
          "project_id, developer_id, assigned_at, projects(name,status), developers(name,tech_stack)",
        )
        .order("assigned_at", { ascending: false }),
    ]);
    setProjects(pRes.data ?? []);
    setDevelopers(dRes.data ?? []);
    setAssignments(aRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addAssignment = async () => {
    if (!selProject || !selDev) {
      toast("error", "Select both a project and a developer.");
      return;
    }
    setAdding(true);
    const { error } = await supabase.from("project_developers").insert([
      {
        project_id: selProject,
        developer_id: selDev,
        assigned_at: new Date().toISOString(),
      },
    ]);
    setAdding(false);
    if (error) {
      toast("error", error.message);
      return;
    }
    toast("success", "Developer assigned to project.");
    setSelProject("");
    setSelDev("");
    load();
  };

  const removeAssignment = async (projectId, developerId) => {
    const { error } = await supabase
      .from("project_developers")
      .delete()
      .eq("project_id", projectId)
      .eq("developer_id", developerId);
    if (error) {
      toast("error", error.message);
      return;
    }
    toast("success", "Assignment removed.");
    setConfirm(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Assignments</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage which developers work on which projects.
        </p>
      </div>

      {/* Add Assignment */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-black text-base">
          Assign Developer to Project
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Project</label>
            <select
              value={selProject}
              onChange={(e) => setSelProject(e.target.value)}
              className={inputCls}
            >
              <option value="">Select a project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Developer (active only)</label>
            <select
              value={selDev}
              onChange={(e) => setSelDev(e.target.value)}
              className={inputCls}
            >
              <option value="">Select a developer...</option>
              {developers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {(d.tech_stack ?? []).slice(0, 2).join(", ")}
                </option>
              ))}
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 20px rgba(34,211,238,0.3)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={addAssignment}
          disabled={adding || !selProject || !selDev}
          className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm disabled:opacity-50"
        >
          {adding ? "Assigning..." : "Assign Developer →"}
        </motion.button>
      </div>

      {/* All Assignments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="text-white font-black text-sm">
            All Assignments ({assignments.length})
          </h3>
        </div>
        {loading ? (
          <div className="divide-y divide-slate-800">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
                className="h-16 bg-slate-900"
              />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-10 text-center text-slate-600 text-sm">
            No assignments yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-950 bg-opacity-60">
                <tr>
                  <th className={thCls}>Project</th>
                  <th className={thCls}>Developer</th>
                  <th className={thCls}>Tech Stack</th>
                  <th className={thCls}>Assigned At</th>
                  <th className={thCls}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {assignments.map((a, i) => (
                  <tr
                    key={`${a.project_id}-${a.developer_id}`}
                    className="hover:bg-slate-800 hover:bg-opacity-30 transition-colors"
                  >
                    <td className={tdCls}>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {a.projects?.name ?? "—"}
                        </p>
                        <StatusBadge status={a.projects?.status} />
                      </div>
                    </td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">
                          {a.developers?.name?.slice(0, 1) ?? "?"}
                        </div>
                        <span className="text-white text-sm font-semibold">
                          {a.developers?.name ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className={tdCls}>
                      <TechPills
                        stack={a.developers?.tech_stack?.slice(0, 3)}
                      />
                    </td>
                    <td
                      className={`${tdCls} text-xs text-slate-500 whitespace-nowrap`}
                    >
                      {fmt(a.assigned_at)}
                    </td>
                    <td className={tdCls}>
                      <button
                        onClick={() =>
                          setConfirm({
                            projectId: a.project_id,
                            developerId: a.developer_id,
                            pName: a.projects?.name,
                            dName: a.developers?.name,
                          })
                        }
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:border-red-700 hover:text-red-400 transition-colors font-semibold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            title="Remove Assignment"
            message={`Remove ${confirm.dName} from "${confirm.pName}"?`}
            confirmLabel="Remove"
            confirmClass="bg-red-600 text-white"
            onConfirm={() =>
              removeAssignment(confirm.projectId, confirm.developerId)
            }
            onClose={() => setConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/sections/admin/UsersSection.jsx (inlined)
// View all users from the users table
// ─────────────────────────────────────────────────────────────
const UsersSection = ({ toast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      setUsers(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = users.filter(
    (u) =>
      !search.trim() ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Users</h1>
        <p className="text-slate-500 text-sm mt-1">
          {users.length} registered users
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        className={`${inputCls} max-w-md`}
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-800">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
                className="h-16 bg-slate-900"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-950 bg-opacity-60">
                <tr>
                  <th className={thCls}>User</th>
                  <th className={thCls}>Role</th>
                  <th className={thCls}>User ID</th>
                  <th className={thCls}>Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-800 hover:bg-opacity-30 transition-colors"
                  >
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-black">
                          {(u.email ?? u.name ?? "?").slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {u.name ?? u.email ?? "—"}
                          </p>
                          <p className="text-slate-600 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdCls}>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          u.role === "admin"
                            ? "bg-red-950 border-red-800 text-red-400"
                            : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}
                      >
                        {u.role ?? "user"}
                      </span>
                    </td>
                    <td className={tdCls}>
                      <span className="text-slate-600 text-xs font-mono">
                        {u.id?.slice(0, 16)}…
                      </span>
                    </td>
                    <td
                      className={`${tdCls} text-xs text-slate-500 whitespace-nowrap`}
                    >
                      {fmt(u.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// src/pages/AdminPanel.jsx — Main export
//
// HOW TO RESTRICT ACCESS TO ADMINS ONLY:
// ─────────────────────────────────────────────────────────────
// STEP 1: Add a `role` column to your `users` table:
//   ALTER TABLE users ADD COLUMN role text DEFAULT 'user';
//
// STEP 2: Set admin role for yourself in Supabase SQL editor:
//   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
//
// STEP 3: In your App.jsx route to AdminPanel only if role = 'admin':
//   const [role, setRole] = useState(null);
//   useEffect(() => {
//     supabase.from('users').select('role').eq('id', user.id).single()
//       .then(({ data }) => setRole(data?.role));
//   }, [user]);
//   // Then: {role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />}
//
// STEP 4: Add RLS policy so only admins can read all rows:
//   CREATE POLICY "admin_only" ON users
//     FOR ALL USING (auth.uid() IN (
//       SELECT id FROM users WHERE role = 'admin'
//     ));
// ─────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [toasts, setToasts] = useState([]);
  const [stats, setStats] = useState({});
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [counts, setCounts] = useState({});

  // Auth + role check
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setChecking(false);
        return;
      }
      setUser(session.user);
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();
      setRole(data?.role ?? "user");
      setChecking(false);
    };
    init();
    const { data: l } = supabase.auth.onAuthStateChange((_, s) => {
      if (!s?.user) {
        setUser(null);
        setRole(null);
      }
    });
    return () => l.subscription.unsubscribe();
  }, []);

  // Load overview stats
  useEffect(() => {
    if (role !== "admin") return;
    const loadStats = async () => {
      const [pRes, dRes, aRes, asRes, uRes] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name, status, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("developers").select("id, is_active"),
        supabase
          .from("developer_applications")
          .select("id, name, email, status, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("project_developers").select("project_id"),
        supabase.from("users").select("id"),
      ]);

      const projects = pRes.data ?? [];
      const devs = dRes.data ?? [];
      const apps = aRes.data ?? [];

      setStats({
        projects: projects.length,
        activeProjects: projects.filter((p) => p.status === "active").length,
        finished: projects.filter((p) => p.status === "finished").length,
        developers: devs.length,
        activeDevelopers: devs.filter((d) => d.is_active).length,
        pendingApps: apps.filter((a) => a.status === "pending").length,
        assignments: asRes.data?.length ?? 0,
        users: uRes.data?.length ?? 0,
      });

      setRecentProjects(projects.slice(0, 5));
      setRecentApps(apps.slice(0, 5));

      setCounts({
        projects: projects.length,
        applications: apps.filter((a) => a.status === "pending").length,
        developers: devs.length,
        assignments: asRes.data?.length ?? 0,
        users: uRes.data?.length ?? 0,
      });
    };
    loadStats();
  }, [role]);

  // Toast helper
  const toast = useCallback((type, message) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  // Loading state
  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-slate-950">
            X
          </div>
          <p className="text-slate-500 text-sm">Verifying admin access...</p>
        </motion.div>
      </div>
    );
  }

  // Not admin
  if (!user || role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-sm w-full text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-800 flex items-center justify-center text-3xl mx-auto">
            🚫
          </div>
          <h2 className="text-white text-xl font-black">Access Denied</h2>
          <p className="text-slate-400 text-sm">
            This panel is restricted to XSTN admins. Your account does not have
            admin privileges.
          </p>
          <p className="text-slate-600 text-xs font-mono">
            role: {role ?? "not logged in"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex">
      {/* src/components/admin/Sidebar */}
      <Sidebar active={activeView} onChange={setActiveView} counts={counts} />

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-slate-950 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="text-slate-700">XSTN Admin</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300 font-semibold capitalize">
              {activeView}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-950 border border-red-900 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-xs font-bold">Admin</span>
            </div>
            <span className="text-slate-500 text-xs font-mono truncate max-w-xs">
              {user?.email}
            </span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-red-700 hover:text-red-400 transition-colors font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === "overview" && (
                <OverviewSection
                  stats={stats}
                  recentProjects={recentProjects}
                  recentApps={recentApps}
                />
              )}
              {activeView === "projects" && <ProjectsSection toast={toast} />}
              {activeView === "applications" && (
                <ApplicationsSection toast={toast} adminId={user.id} />
              )}
              {activeView === "developers" && (
                <DevelopersSection toast={toast} />
              )}
              {activeView === "assignments" && (
                <AssignmentsSection toast={toast} />
              )}
              {activeView === "users" && <UsersSection toast={toast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}
