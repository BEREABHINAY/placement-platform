import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { getCoursesRequest } from "../api/coursesApi";

const categories = ["All", "DSA", "Web Development", "Aptitude", "System Design", "Soft Skills", "Core CS", "AI/ML"];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getCoursesRequest(category !== "All" ? { category } : {})
      .then(({ data }) => setCourses(data.courses))
      .catch(() => setError("Could not load courses."))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-cyan tracking-widest">COURSE CATALOG</p>
        <h1 className="font-display font-semibold text-2xl mt-1">Browse courses</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-sm font-mono px-4 py-2 rounded-full border transition ${
              category === c ? "border-amber text-amber bg-amber/10" : "border-white/10 text-dim hover:border-white/25"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="text-dim font-mono text-sm">LOADING COURSES...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <Link key={c._id} to={`/courses/${c._id}`} className="console-panel p-6 hover:border-cyan/40 transition block">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-cyan tracking-widest">{c.category}</span>
              <span className="text-xs text-dim">{c.level}</span>
            </div>
            <p className="font-display font-semibold text-lg">{c.title}</p>
            <p className="text-sm text-dim mt-2 line-clamp-2">{c.description}</p>
            <div className="flex items-center justify-between mt-5 text-xs text-dim">
              <span className="flex items-center gap-1.5"><Clock size={12} /> {c.durationHours}h · {c.totalModules} modules</span>
              <span className="text-amber flex items-center gap-1"><Star size={12} fill="currentColor" /> {c.rating}</span>
            </div>
          </Link>
        ))}
      </div>

      {!loading && courses.length === 0 && (
        <p className="text-dim text-sm mt-10">No courses found in this category yet.</p>
      )}
    </div>
  );
}
