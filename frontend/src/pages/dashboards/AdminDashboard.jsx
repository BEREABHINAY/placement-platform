import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BookOpen, ClipboardList } from "lucide-react";

const liveModules = [
  { title: "Courses", desc: "Browse the full course catalog (create/edit UI coming next).", to: "/courses", icon: BookOpen },
  { title: "Tests", desc: "Browse all aptitude and mock tests.", to: "/tests", icon: ClipboardList },
];

const pendingModules = [
  { title: "User Management", desc: "View, verify, deactivate, or promote any account." },
  { title: "Company Approvals", desc: "Review and approve hiring partner accounts." },
  { title: "Platform Analytics", desc: "Signups, placements, and engagement, in one view." },
  { title: "Content Moderation", desc: "Forum posts, shared notes, and reported content." },
  { title: "Job Listings", desc: "Audit and manage all live job postings." },
  { title: "All Certificates Issued", desc: "View every certificate issued across the platform." },
];

export default function AdminDashboard() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="font-mono text-xs text-amber tracking-widest">MISSION CONTROL · ADMIN</p>
        <h1 className="font-display font-semibold text-2xl mt-1">{user?.name}</h1>
      </div>

      <p className="font-mono text-xs text-dim tracking-widest mb-3">ACTIVE MODULES</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {liveModules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.title} to={m.to} className="console-panel p-6 hover:border-amber/40 transition block">
              <Icon className="text-amber mb-3" size={22} />
              <p className="font-display font-semibold">{m.title}</p>
              <p className="text-sm text-dim mt-1">{m.desc}</p>
              <span className="status-dot bg-okgreen mt-4 inline-block" />
              <span className="font-mono text-xs text-okgreen ml-2">LIVE</span>
            </Link>
          );
        })}
      </div>

      <p className="font-mono text-xs text-dim tracking-widest mb-3">COMING NEXT</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {pendingModules.map((m) => (
          <div key={m.title} className="console-panel p-6 opacity-60">
            <p className="font-display font-semibold">{m.title}</p>
            <p className="text-sm text-dim mt-1">{m.desc}</p>
            <p className="font-mono text-xs text-dim mt-4 tracking-widest">MODULE PENDING BUILD</p>
          </div>
        ))}
      </div>
    </div>
  );
}
