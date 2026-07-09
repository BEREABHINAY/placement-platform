import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BookOpen, ClipboardList, Award } from "lucide-react";

const liveModules = [
  { title: "Courses", desc: "Structured tracks in DSA, Web Dev, Aptitude, System Design, and more.", to: "/courses", icon: BookOpen },
  { title: "Aptitude & Mock Tests", desc: "Timed tests with instant scoring — pass to earn a certificate.", to: "/tests", icon: ClipboardList },
  { title: "Certificates", desc: "View certificates you've earned by passing linked tests.", to: "/certificates", icon: Award },
];

const pendingModules = [
  { title: "Resume Builder", desc: "Draft and export an ATS-ready resume." },
  { title: "ATS Resume Checker", desc: "Score your resume against a job description." },
  { title: "Coding Platform", desc: "Practice DSA problems with instant feedback." },
  { title: "AI Interview", desc: "Run a mock interview with live AI feedback." },
  { title: "Job Alerts", desc: "See openings matched to your profile." },
  { title: "Discussion Forum & Notes Sharing", desc: "Ask questions, share notes with peers." },
];

export default function StudentDashboard() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="font-mono text-xs text-cyan tracking-widest">BAY-01 · STUDENT</p>
        <h1 className="font-display font-semibold text-2xl mt-1">Welcome back, {user?.name?.split(" ")[0]}</h1>
      </div>

      <p className="font-mono text-xs text-dim tracking-widest mb-3">ACTIVE MODULES</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {liveModules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.title} to={m.to} className="console-panel p-6 hover:border-cyan/40 transition block">
              <Icon className="text-cyan mb-3" size={22} />
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
