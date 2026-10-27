import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveSession } from "../auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- small inline icons ---------- */
const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
  </svg>
);
const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V8a4 4 0 10-8 0v3m-1 0h10a1 1 0 011 1v7a1 1 0 01-1 1H7a1 1 0 01-1-1v-7a1 1 0 011-1z" />
  </svg>
);
const EyeIcon = ({ off }) => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    {off ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c4.5 0 8.3 3 9.5 7a10.5 10.5 0 01-2.6 4.1M6.2 6.2A10.5 10.5 0 002.5 12c1.2 4 5 7 9.5 7a9.8 9.8 0 004.1-.9" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12C3.7 8 7.5 5 12 5s8.3 3 9.5 7c-1.2 4-5 7-9.5 7s-8.3-3-9.5-7zM12 15a3 3 0 100-6 3 3 0 000 6z" />
    )}
  </svg>
);

const features = [
  { icon: "⚡", title: "Lightning fast", text: "Set up projects in seconds." },
  { icon: "🔒", title: "Secure by design", text: "Encrypted sessions and smart limits." },
  { icon: "📈", title: "Live insights", text: "Track progress with clear analytics." },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0); // changing this retriggers the shake animation

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const err = {};
    if (!form.email.trim()) err.email = "Email is required.";
    else if (!emailRegex.test(form.email)) err.email = "Enter a valid email address.";

    if (!form.password) err.password = "Password is required.";
    else if (form.password.length < 6) err.password = "Password must be at least 6 characters.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setShakeKey((k) => k + 1);
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const { data } = await axios.post("/api/login", {
        email: form.email,
        password: form.password,
        remember: form.remember,
      });
      saveSession(data.token, data.user, form.remember);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Cannot reach the server. Please try again.");
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none transition focus:bg-white/10 focus:ring-4 ${
      errors[field]
        ? "border-rose-500/70 focus:ring-rose-500/20"
        : "border-white/10 focus:border-cyan-400 focus:ring-cyan-400/20"
    }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Animated background glows */}
      <div className="animate-float absolute -top-40 -left-40 h-136 w-136 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="animate-float absolute -right-40 -bottom-40 h-136 w-136 rounded-full bg-cyan-500/25 blur-3xl [animation-delay:3s]" />
      <div className="animate-float absolute top-1/3 left-1/2 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl [animation-delay:5s]" />
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-2 lg:px-12">
        {/* ---------- Brand side ---------- */}
        <section className="animate-fade-up hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-cyan-400 text-2xl font-black shadow-lg shadow-violet-500/30">
              N
            </div>
            <span className="text-3xl font-extrabold tracking-tight">Novara</span>
          </div>

          <h1 className="mt-14 text-6xl leading-[1.05] font-extrabold tracking-tight">
            Build faster.
            <br />
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              Ship smarter.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-400">
            The all-in-one workspace where modern teams plan, collaborate and launch their best work.
          </p>

          <div className="mt-10 space-y-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex max-w-md items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-sm text-slate-400">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Form side ---------- */}
        <section className="animate-fade-up flex justify-center [animation-delay:150ms]">
          <div
            key={shakeKey}
            className={`w-full max-w-md rounded-3xl border border-white/10 bg-white/6 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 ${
              shakeKey > 0 && (serverError || Object.keys(errors).length) ? "animate-shake" : ""
            }`}
          >
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-cyan-400 font-black">
                N
              </div>
              <span className="text-2xl font-extrabold">Novara</span>
            </div>

            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="mt-2 text-slate-400">Sign in to continue to your workspace.</p>

            {serverError && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
              >
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-500">
                    <MailIcon />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-sm text-rose-400">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-500">
                    <LockIcon />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className={inputClass("password") + " pr-12"}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-500 transition hover:text-cyan-300"
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-sm text-rose-400">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-400">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-cyan-400"
                  />
                  Remember me
                </label>
                <a href="#" className="font-medium text-cyan-300 transition hover:text-cyan-200">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-cyan-500 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-600/30 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading && (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <span className="transition group-hover:translate-x-1">→</span>}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-7 rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-slate-400">
              <p className="mb-1 font-semibold text-slate-200">🔑 Demo credentials</p>
              <p>Email: <span className="text-cyan-300">demo@novara.app</span></p>
              <p>Password: <span className="text-cyan-300">Demo@1234</span></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}