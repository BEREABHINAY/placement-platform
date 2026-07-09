import { useSelector } from "react-redux";

const pendingModules = [
  { title: "Post a Job", desc: "Publish an opening to matched candidates." },
  { title: "Candidate Pool", desc: "Browse and filter student profiles." },
  { title: "Interview Scheduler", desc: "Coordinate rounds with shortlisted students." },
  { title: "Placement Analytics", desc: "Track applicants, conversions, and offers." },
];

export default function CompanyDashboard() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="font-mono text-xs text-cyan tracking-widest">BAY-02 · COMPANY</p>
        <h1 className="font-display font-semibold text-2xl mt-1">{user?.companyName || user?.name}</h1>
      </div>

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
