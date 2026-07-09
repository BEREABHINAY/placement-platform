import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "../components/OtpInput";
import { resetPasswordRequest } from "../api/authApi";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../store/authSlice";

export default function ResetPassword() {
  const { state } = useLocation();
  const email = state?.email || "";
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await resetPasswordRequest({ email, code, newPassword });
      dispatch(setAuthenticated(data.user));
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-void">
      <div className="w-full max-w-sm text-center">
        <p className="font-mono text-xs text-cyan tracking-[0.3em] mb-2">RECOVERY</p>
        <h1 className="font-display font-semibold text-2xl mb-8">Set a new password</h1>
        <form onSubmit={handleSubmit} className="console-panel p-6 space-y-6 text-left">
          <p className="text-sm text-dim text-center">Code sent to <span className="text-mist">{email}</span></p>
          <OtpInput value={code} onChange={setCode} />
          <input required type="password" minLength={8} placeholder="New password (min. 8 characters)" className="field-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
