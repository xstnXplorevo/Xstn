import { useState } from "react";
import { useAuth } from "../../config/AuthContext";
import { useNavigate } from "react-router-dom";

const validateEmail = (email) => {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  return "";
};

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const validate = (name, value) => {
    if (name === "email") return validateEmail(value);
    if (name === "password") return validatePassword(value);
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setTouched({ email: true, password: true });
    setErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) return;

    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);

    if (error) {
      setErrors({ submit: error.message });
      return;
    }

    navigate("/dashboard");
  };

  const isFormValid =
    !validateEmail(form.email) && !validatePassword(form.password);

  const inputBorder = (name) => {
    if (!touched[name])
      return "border-slate-700 focus:border-cyan-400 focus:ring-cyan-400";
    return errors[name]
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-green-500 focus:border-green-500 focus:ring-green-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(0,212,232,0.08)_0%,_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(124,92,191,0.08)_0%,_transparent_50%)] pointer-events-none" />

      {/* Floating dots */}
      <div className="absolute top-20 left-16 w-1 h-1 rounded-full bg-cyan-400 opacity-50" />
      <div className="absolute top-40 right-24 w-1 h-1 rounded-full bg-white opacity-20" />
      <div className="absolute bottom-32 left-32 w-1.5 h-1.5 rounded-full bg-purple-400 opacity-40" />
      <div className="absolute bottom-20 right-16 w-1 h-1 rounded-full bg-cyan-400 opacity-30" />
      <div className="absolute top-1/3 left-8 w-1 h-1 rounded-full bg-white opacity-15" />
      <div className="absolute top-1/4 right-12 w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-25" />

      <div className="w-full max-w-md relative z-10 py-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg bg-cyan-400 flex items-center justify-center font-black text-slate-950 text-lg">
            X
          </div>
          <div>
            <div className="font-black text-white text-xl tracking-wider leading-none">
              XSTN
            </div>
            <div className="text-cyan-400 text-xs tracking-widest font-medium">
              XPLOREVO
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Terminal bar */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-slate-500 text-xs font-mono">
              xstn — authenticate
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <p className="text-cyan-400 font-mono text-sm mb-1">
              $ xstn --login engineer
            </p>
            <h1 className="text-white text-2xl font-black leading-tight">
              Welcome Back.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Keep Building.
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Your projects are waiting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* ── Email ── */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-1.5 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-sm select-none">
                  @
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@college.edu"
                  className={`w-full bg-slate-800 border text-white placeholder-slate-500 rounded-lg pl-8 pr-10 py-3 text-sm focus:outline-none focus:ring-1 transition-all duration-200 font-mono ${inputBorder("email")}`}
                />
                {touched.email && (
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${errors.email ? "text-red-400" : "text-green-400"}`}
                  >
                    {errors.email ? "✕" : "✓"}
                  </span>
                )}
              </div>
              {touched.email && errors.email && (
                <p className="text-red-400 text-xs mt-1.5 font-mono">
                  ! {errors.email}
                </p>
              )}
            </div>

            {/* ── Password ── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-300 text-sm font-semibold tracking-wide">
                  Password
                </label>
                <a
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-mono transition-colors duration-200"
                >
                  forgot?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-sm select-none">
                  #
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={`w-full bg-slate-800 border text-white placeholder-slate-500 rounded-lg pl-8 pr-16 py-3 text-sm focus:outline-none focus:ring-1 transition-all duration-200 font-mono ${inputBorder("password")}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors duration-200 text-xs font-mono"
                >
                  {showPassword ? "hide" : "show"}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-400 text-xs mt-1.5 font-mono">
                  ! {errors.password}
                </p>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-400 text-xs font-mono">
                ! {errors.submit}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-black py-3 rounded-lg text-sm tracking-widest uppercase transition-all duration-200 shadow-lg active:scale-95 ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 shadow-cyan-400/20 hover:shadow-cyan-400/40 cursor-pointer"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
              }`}
            >
              {loading ? "✓ Authenticating..." : "Access XSTN →"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs font-mono">or</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-slate-500 text-sm">
              New engineer?{" "}
              <a
                href="#"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
              >
                Join XSTN
              </a>
            </p>
          </form>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-slate-500 text-xs font-mono">
            12 ACTIVE PROJECTS · APPLICATIONS OPEN
          </span>
        </div>
      </div>
    </div>
  );
}
