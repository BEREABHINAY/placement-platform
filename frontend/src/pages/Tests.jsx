import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Timer, ListChecks } from "lucide-react";
import { getTestsRequest } from "../api/testsApi";

const typeLabels = { aptitude: "Aptitude", mock: "Mock Interview", coding_mcq: "Coding / CS" };

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestsRequest().then(({ data }) => setTests(data.tests)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-cyan tracking-widest">TESTS</p>
        <h1 className="font-display font-semibold text-2xl mt-1">Aptitude & mock tests</h1>
      </div>

      {loading && <p className="text-dim font-mono text-sm">LOADING TESTS...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((t) => (
          <div key={t._id} className="console-panel p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-cyan tracking-widest">{typeLabels[t.type]}</span>
              <span className="text-xs text-dim">{t.category}</span>
            </div>
            <p className="font-display font-semibold text-lg">{t.title}</p>
            <p className="text-sm text-dim mt-2 line-clamp-2">{t.description}</p>
            <div className="flex items-center justify-between mt-5">
              <span className="text-xs text-dim font-mono flex items-center gap-3">
                <span className="flex items-center gap-1"><Timer size={12} /> {t.durationMinutes}m</span>
                <span className="flex items-center gap-1"><ListChecks size={12} /> {t.questions.length}</span>
              </span>
              <Link to={`/tests/${t._id}`} className="btn-primary text-xs py-2 px-4">Start</Link>
            </div>
          </div>
        ))}
      </div>

      {!loading && tests.length === 0 && <p className="text-dim text-sm mt-10">No tests available yet.</p>}
    </div>
  );
}
