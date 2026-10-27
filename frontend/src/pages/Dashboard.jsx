import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, getUser, clearSession } from "../auth";

const stats = [
  { label: "Active Projects", value: "12", change: "+2 this week", color: "from-violet-500 to-indigo-500" },
  { label: "Tasks Completed", value: "248", change: "+18%", color: "from-emerald-500 to-teal-500" },
  { label: "Team Members", value: "8", change: "+1 new", color: "from-sky-500 to-cyan-500" },
  { label: "Hours Tracked", value: "164h", change: "+9h today", color: "from-fuchsia-500 to-pink-500" },
];

const bars = [40, 65, 50, 80, 60, 95, 75];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const activity = [
  { icon: "✅", text: "Website redesign marked as complete", time: "2h ago" },
  { icon: "💬", text: 'New comment on "Mobile App v2"', time: "5h ago" },
  { icon: "📅", text: "Sprint planning scheduled for Friday", time: "Yesterday" },
  { icon: "🚀", text: "Version 2.4 deployed to production", time: "2 days ago" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  const logout = () => {
    clearSession();
    navigate("/");
  };

  // Verify the token with the backend (protected API call)
  useEffect(() => {
    axios
      .get("/api/me", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => setUser(res.data))
      .catch(() => {
        clearSession();
        navigate("/");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-cyan-400 font-black">
              N
            </div>
            <span className="text-xl font-extrabold">Novara</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">{user?.email}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <div id="root"></div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">Hello, {user?.name || "there"} 🎉</h1>
        <p className="mt-1 text-slate-400">Here's what's happening in your workspace today.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl bg-linear-to-br ${s.color} p-6 shadow-lg`}>
              <p className="text-sm text-white/80">{s.label}</p>
              <p className="mt-2 text-4xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-xs text-white/80">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Weekly chart */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-3">
            <h2 className="text-lg font-semibold">Weekly productivity</h2>
            <div className="mt-6 flex h-48 items-end justify-between gap-3">
              {bars.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-linear-to-t from-violet-600 to-cyan-400 transition hover:opacity-80"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-xs text-slate-500">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <ul className="mt-4 space-y-4">
              {activity.map((a) => (
                <li key={a.text} className="flex items-start gap-3">
                  <span className="text-lg">{a.icon}</span>
                  <div>
                    <p className="text-sm text-slate-200">{a.text}</p>
                    <p className="text-xs text-slate-500">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>

  );
}