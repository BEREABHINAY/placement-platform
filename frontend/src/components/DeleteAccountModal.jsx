import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, X } from "lucide-react";
import { deleteAccountRequest } from "../api/authApi";
import { setUnauthenticated } from "../store/authSlice";

export default function DeleteAccountModal({ onClose }) {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const canDelete = password.length > 0 && confirmText === "DELETE";

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!canDelete) return;
    setError("");
    setLoading(true);
    try {
      await deleteAccountRequest({ password });
      dispatch(setUnauthenticated());
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="console-panel border-red-500/30 p-6 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-dim hover:text-mist">
          <X size={18} />
        </button>

        <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="text-red-400" size={20} />
        </div>
        <h2 className="font-display font-semibold text-lg">Delete your account</h2>
        <p className="text-sm text-dim mt-2">
          This permanently deletes your account, enrollments, test history, and certificates.
          This cannot be undone.
        </p>

        <form onSubmit={handleDelete} className="mt-5 space-y-3">
          <input
            type="password"
            required
            placeholder="Confirm your password"
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <label className="text-xs text-dim">Type <span className="font-mono text-mist">DELETE</span> to confirm</label>
            <input
              required
              placeholder="DELETE"
              className="field-input mt-1 font-mono"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 text-sm py-2.5">Cancel</button>
            <button
              type="submit"
              disabled={!canDelete || loading}
              className="flex-1 text-sm py-2.5 rounded-xl font-display font-semibold bg-red-500 text-white hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : "Delete forever"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
