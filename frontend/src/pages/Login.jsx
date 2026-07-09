import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "../api/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginRequest({ email, password });
      if (data.requiresVerification) {
        navigate("/verify-otp", { state: { email, purpose: "signup" } });
        return;
      }
      if (data.requiresOtp) {
        navigate("/verify-otp", { state: { email, purpose: "login" } });
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-void">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs text-cyan tracking-[0.3em] mb-2 text-center">RE-ENTRY</p>
        <h1 className="font-display font-semibold text-2xl text-center mb-8">Log back in</h1>

        <form onSubmit={handleSubmit} className="console-panel p-6 space-y-4">
          <input required type="email" placeholder="Email address" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Verifying..." : "Continue"}
          </button>

          <p className="text-sm text-center">
            <Link to="/forgot-password" className="text-dim hover:text-cyan">Forgot password?</Link>
          </p>
        </form>

        <p className="text-sm text-dim text-center mt-6">
          New here? <Link to="/register" className="text-cyan hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
