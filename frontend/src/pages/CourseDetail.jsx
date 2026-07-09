import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PlayCircle, CheckCircle2, Clock } from "lucide-react";
import { getCourseByIdRequest, enrollInCourseRequest } from "../api/coursesApi";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const load = () => {
    getCourseByIdRequest(id).then(({ data }) => {
      setCourse(data.course);
      setEnrollment(data.enrollment);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleEnroll = async () => {
    setActionError("");
    try {
      await enrollInCourseRequest(id);
      load();
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not enroll.");
    }
  };

  if (loading) return <p className="text-dim font-mono text-sm p-10">LOADING COURSE...</p>;
  if (!course) return <p className="text-dim font-mono text-sm p-10">Course not found.</p>;

  const isStudent = user?.role === "student";
  const completedIds = new Set((enrollment?.completedModuleIds || []).map(String));

  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs text-cyan tracking-widest">{course.category}</span>
          <span className="text-xs text-dim">{course.level} · {course.durationHours}h</span>
        </div>
        <h1 className="font-display font-semibold text-3xl">{course.title}</h1>
        <p className="text-dim mt-3">{course.description}</p>
      </div>

      {isStudent && (
        <div className="console-panel p-5 mb-8 flex items-center justify-between">
          {enrollment ? (
            <div className="w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-dim">Your progress</span>
                <span className="text-cyan font-mono">{enrollment.progressPercent}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan transition-all" style={{ width: `${enrollment.progressPercent}%` }} />
              </div>
              {enrollment.isCompleted && (
                <p className="text-okgreen text-sm mt-3 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Course completed
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-dim">Not enrolled yet</p>
              <button onClick={handleEnroll} className="btn-primary text-sm py-2 px-5">Enroll</button>
            </>
          )}
        </div>
      )}
      {actionError && <p className="text-sm text-red-400 mb-4">{actionError}</p>}

      <h2 className="font-display font-semibold text-lg mb-4">Modules</h2>
      <div className="space-y-3">
        {course.modules.map((m, i) => {
          const done = completedIds.has(m._id);
          const locked = isStudent && !enrollment;
          return (
            <Link
              key={m._id}
              to={locked ? "#" : `/courses/${course._id}/modules/${m._id}`}
              onClick={(e) => locked && e.preventDefault()}
              className={`console-panel p-5 flex items-center gap-4 transition ${
                locked ? "opacity-50 cursor-not-allowed" : "hover:border-cyan/40"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                done ? "bg-okgreen/15 text-okgreen" : "bg-cyan/10 text-cyan"
              }`}>
                {done ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{i + 1}. {m.title}</p>
                {m.description && <p className="text-sm text-dim mt-0.5 truncate">{m.description}</p>}
              </div>
              <span className="text-xs text-dim font-mono flex items-center gap-1 shrink-0">
                <Clock size={12} /> {m.durationMinutes}m
              </span>
            </Link>
          );
        })}
      </div>
      {isStudent && !enrollment && (
        <p className="text-xs text-dim mt-4">Enroll above to unlock the lesson videos for each module.</p>
      )}
    </div>
  );
}
