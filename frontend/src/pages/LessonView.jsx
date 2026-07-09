import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getCourseByIdRequest, markModuleCompleteRequest } from "../api/coursesApi";

export default function LessonView() {
  const { id, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const load = () => {
    getCourseByIdRequest(id).then(({ data }) => {
      setCourse(data.course);
      setEnrollment(data.enrollment);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); window.scrollTo(0, 0); }, [id, moduleId]);

  if (loading) return <p className="text-dim font-mono text-sm p-10">LOADING LESSON...</p>;
  if (!course) return <p className="text-dim font-mono text-sm p-10">Course not found.</p>;

  const moduleIndex = course.modules.findIndex((m) => m._id === moduleId);
  const currentModule = course.modules[moduleIndex];
  if (!currentModule) return <p className="text-dim font-mono text-sm p-10">Lesson not found.</p>;

  const prevModule = course.modules[moduleIndex - 1];
  const nextModule = course.modules[moduleIndex + 1];
  const completedIds = new Set((enrollment?.completedModuleIds || []).map(String));
  const isDone = completedIds.has(currentModule._id);
  const isStudent = user?.role === "student";

  const handleMarkDone = async () => {
    setMarking(true);
    try {
      await markModuleCompleteRequest(id, currentModule._id);
      load();
      if (nextModule) navigate(`/courses/${id}/modules/${nextModule._id}`);
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-10 max-w-4xl mx-auto">
      <Link to={`/courses/${id}`} className="text-sm text-dim hover:text-cyan">&larr; {course.title}</Link>

      <div className="mt-4 mb-6">
        <p className="font-mono text-xs text-cyan tracking-widest">
          MODULE {moduleIndex + 1} OF {course.modules.length}
        </p>
        <h1 className="font-display font-semibold text-2xl mt-1">{currentModule.title}</h1>
        {currentModule.description && <p className="text-dim mt-2">{currentModule.description}</p>}
        <p className="text-xs text-dim mt-2 font-mono flex items-center gap-1.5">
          <Clock size={12} /> {currentModule.durationMinutes} min
        </p>
      </div>

      <div className="console-panel overflow-hidden mb-6">
        {currentModule.videoUrl ? (
          <video key={currentModule.videoUrl} controls className="w-full aspect-video bg-black" src={currentModule.videoUrl}>
            Your browser doesn't support embedded video.
          </video>
        ) : (
          <div className="w-full aspect-video bg-black/40 flex flex-col items-center justify-center text-dim">
            <p className="font-mono text-xs tracking-widest">VIDEO NOT YET UPLOADED</p>
            <p className="text-sm mt-1">Check back soon — lesson content is in progress.</p>
          </div>
        )}
      </div>

      {isStudent && enrollment && (
        <button
          onClick={handleMarkDone}
          disabled={isDone || marking}
          className={`w-full mb-8 flex items-center justify-center gap-2 text-sm py-3 rounded-xl font-display font-semibold transition ${
            isDone
              ? "bg-okgreen/10 text-okgreen border border-okgreen/30 cursor-default"
              : "btn-primary"
          }`}
        >
          <CheckCircle2 size={16} /> {isDone ? "Completed" : marking ? "Saving..." : "Mark as complete"}
        </button>
      )}

      <div className="flex items-center justify-between">
        {prevModule ? (
          <Link to={`/courses/${id}/modules/${prevModule._id}`} className="btn-ghost text-sm py-2 px-4 flex items-center gap-1.5">
            <ChevronLeft size={15} /> Previous
          </Link>
        ) : <span />}
        {nextModule ? (
          <Link to={`/courses/${id}/modules/${nextModule._id}`} className="btn-ghost text-sm py-2 px-4 flex items-center gap-1.5">
            Next <ChevronRight size={15} />
          </Link>
        ) : (
          <Link to={`/courses/${id}`} className="btn-primary text-sm py-2 px-4">Back to course</Link>
        )}
      </div>
    </div>
  );
}
