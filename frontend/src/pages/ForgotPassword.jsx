import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordRequest } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordRequest({ email });
      setSent(true);
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-void">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs text-cyan tracking-[0.3em] mb-2 text-center">RECOVERY</p>
        <h1 className="font-display font-semibold text-2xl text-center mb-8">Reset your password</h1>
        <form onSubmit={handleSubmit} className="console-panel p-6 space-y-4">
          <input required type="email" placeholder="Email address" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending..." : "Send reset code"}
          </button>
          {sent && <p className="text-sm text-okgreen text-center">If that email exists, a code is on its way.</p>}
        </form>
        <p className="text-sm text-dim text-center mt-6">
          <Link to="/login" className="text-cyan hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
