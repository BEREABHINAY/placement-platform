import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import OtpInput from "../components/OtpInput";
import { verifySignupOtpRequest, verifyLoginOtpRequest, resendOtpRequest } from "../api/authApi";
import { setAuthenticated } from "../store/authSlice";

const RESEND_COOLDOWN = 30;

export default function VerifyOtp() {
  const { state } = useLocation();
  const email = state?.email;
  const purpose = state?.purpose || "signup"; // "signup" | "login"
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
      return;
    }
    timerRef.current = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const call = purpose === "login" ? verifyLoginOtpRequest : verifySignupOtpRequest;
      const { data } = await call({ email, code });
      dispatch(setAuthenticated(data.user));
      const dest = { student: "/dashboard/student", company: "/dashboard/company", admin: "/dashboard/admin" }[data.user.role];
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    try {
      await resendOtpRequest({ email, purpose });
      setInfo("A new code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-void">
      <div className="w-full max-w-sm text-center">
        <p className="font-mono text-xs text-cyan tracking-[0.3em] mb-2">IDENTITY CONFIRMATION</p>
        <h1 className="font-display font-semibold text-2xl mb-2">Enter your verification code</h1>
        <p className="text-sm text-dim mb-8">
          We sent a 6-digit code to <span className="text-mist">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="console-panel p-6 space-y-6">
          <OtpInput value={code} onChange={setCode} />

          {error && <p className="text-sm text-red-400">{error}</p>}
          {info && <p className="text-sm text-okgreen">{info}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Verifying..." : "Verify & continue"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-sm text-dim hover:text-cyan disabled:hover:text-dim disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        </form>
      </div>
    </div>
  );
}
