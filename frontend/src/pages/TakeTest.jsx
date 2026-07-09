import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTestForAttemptRequest, submitTestRequest } from "../api/testsApi";
import CertificateModal from "../components/CertificateModal";

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [result, setResult] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    getTestForAttemptRequest(id).then(({ data }) => {
      setTest(data.test);
      setSecondsLeft(data.test.durationMinutes * 60);
    });
  }, [id]);

  useEffect(() => {
    if (secondsLeft === null || result) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, result]);

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((a) => ({ ...a, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submitting || result) return;
    setSubmitting(true);
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({ questionId, selectedOptionIndex })),
      timeTakenSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
    };
    try {
      const { data } = await submitTestRequest(id, payload);
      setResult(data);
    } finally {
      setSubmitting(false);
    }
  };

  if (!test) return <p className="text-dim font-mono text-sm p-10">LOADING TEST...</p>;

  if (result) {
    const { score, totalMarks, percent, passed } = result.result;
    return (
      <div className="min-h-screen bg-void px-6 py-16 flex items-center justify-center">
        <div className="console-panel p-8 max-w-md w-full text-center">
          <p className="font-mono text-xs text-cyan tracking-widest mb-4">TEST COMPLETE</p>
          <p className={`font-display font-semibold text-4xl mb-2 ${passed ? "text-okgreen" : "text-red-400"}`}>
            {percent}%
          </p>
          <p className="text-dim mb-6">{score} / {totalMarks} marks · {passed ? "Passed" : "Not passed"}</p>

          {result.certificate && (
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full border border-amber/30 bg-amber/5 rounded-xl p-4 mb-6 hover:bg-amber/10 transition text-left"
            >
              <p className="text-amber text-sm font-medium">🎓 Certificate issued! Tap to view</p>
              <p className="text-xs text-dim mt-1 font-mono">{result.certificate.certificateId}</p>
            </button>
          )}

          <div className="flex gap-3 justify-center">
            <Link to="/tests" className="btn-ghost text-sm py-2 px-5">Back to tests</Link>
            <Link to="/certificates" className="btn-primary text-sm py-2 px-5">My certificates</Link>
          </div>
        </div>

        {showCertificate && result.certificate && (
          <CertificateModal certificate={result.certificate} userName={user?.name} onClose={() => setShowCertificate(false)} />
        )}
      </div>
    );
  }

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 sticky top-16 bg-void/95 backdrop-blur py-4 z-10 -mx-4 sm:-mx-8 px-4 sm:px-8 border-b border-white/5">
        <div>
          <p className="font-mono text-xs text-cyan tracking-widest">{test.category}</p>
          <h1 className="font-display font-semibold text-xl mt-1">{test.title}</h1>
        </div>
        <span className={`font-mono text-lg px-4 py-2 rounded-lg border ${secondsLeft < 60 ? "border-red-400 text-red-400" : "border-white/10 text-mist"}`}>
          {mins}:{secs}
        </span>
      </div>

      <div className="space-y-6">
        {test.questions.map((q, qi) => (
          <div key={q._id} className="console-panel p-6">
            <p className="font-medium mb-4">{qi + 1}. {q.questionText}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => selectAnswer(q._id, oi)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${
                    answers[q._id] === oi
                      ? "border-cyan/60 bg-cyan/10 text-mist"
                      : "border-white/10 text-dim hover:border-white/25"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full mt-8">
        {submitting ? "Submitting..." : "Submit test"}
      </button>
    </div>
  );
}
