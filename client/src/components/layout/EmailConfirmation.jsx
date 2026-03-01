import { useState, useEffect } from "react";
import supabase from "../../config/createClient";

export default function EmailConfirmation({ email }) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  // Countdown timer after resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setResending(false);

    if (error) {
      setError(error.message);
    } else {
      setResent(true);
      setCountdown(60);
      setTimeout(() => setResent(false), 4000);
    }
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
              xstn — verify-email
            </span>
          </div>

          {/* Envelope icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl border border-cyan-400 opacity-20 animate-ping" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <p className="text-cyan-400 font-mono text-sm mb-1">
              $ xstn --verify inbox
            </p>
            <h1 className="text-white text-2xl font-black leading-tight">
              Check Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Inbox.
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              We sent a confirmation link to:
            </p>
            <p className="text-cyan-400 font-mono text-sm mt-1 bg-slate-800 rounded-lg px-3 py-2 border border-slate-700 break-all">
              {email || "your@email.com"}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-6">
            {[
              { step: "01", text: "Open your email client" },
              { step: "02", text: "Find the email from XSTN" },
              { step: "03", text: 'Click "Confirm your account"' },
            ].map(({ step, text }) => (
              <div
                key={step}
                className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
              >
                <span className="text-cyan-400 font-mono text-xs font-bold shrink-0">
                  {step}
                </span>
                <div className="w-px h-4 bg-slate-700" />
                <span className="text-slate-300 text-sm font-mono">{text}</span>
              </div>
            ))}
          </div>

          {/* Resent success message */}
          {resent && (
            <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3">
              <p className="text-green-400 text-xs font-mono">
                ✓ Confirmation email resent successfully
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-400 text-xs font-mono">! {error}</p>
            </div>
          )}

          {/* Resend button */}
          <button
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className={`w-full font-black py-3 rounded-lg text-sm tracking-widest uppercase transition-all duration-200 shadow-lg active:scale-95 ${
              countdown > 0 || resending
                ? "bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
                : "bg-slate-800 border border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 cursor-pointer"
            }`}
          >
            {resending
              ? "Sending..."
              : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend Confirmation Email"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs font-mono">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Back to login */}
          <p className="text-center text-slate-500 text-sm">
            Wrong email?{" "}
            <a
              href="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
            >
              Sign up again
            </a>
          </p>

          {/* Spam note */}
          <p className="text-center text-slate-600 text-xs font-mono mt-4">
            ! check spam / junk if you don&apos;t see it
          </p>
        </div>

        {/* Status badge */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-slate-500 text-xs font-mono">
            AWAITING EMAIL VERIFICATION
          </span>
        </div>
      </div>
    </div>
  );
}
