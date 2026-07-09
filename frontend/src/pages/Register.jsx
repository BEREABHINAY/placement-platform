import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import RoleCard from "../components/RoleCard";
import { registerRequest } from "../api/authApi";
import { setPendingEmail } from "../store/authSlice";

const roles = [
  { key: "student", callsign: "BAY-01", label: "Student", description: "Prep, apply, track your placement." },
  { key: "company", callsign: "BAY-02", label: "Company", description: "Source and hire campus talent." },
];

export default function Register() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    college: "", branch: "", graduationYear: "",
    companyName: "", companyWebsite: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerRequest({ ...form, role });
      dispatch(setPendingEmail(form.email));
      navigate("/verify-otp", { state: { email: form.email, purpose: "signup" } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-void">
      <div className="w-full max-w-md">
        <p className="font-mono text-xs text-cyan tracking-[0.3em] mb-2 text-center">NEW REGISTRATION</p>
        <h1 className="font-display font-semibold text-2xl text-center mb-8">Choose your docking bay</h1>

        <div className="flex gap-3 mb-8">
          {roles.map((r) => (
            <RoleCard
              key={r.key}
              {...r}
              active={role === r.key}
              onClick={() => setRole(r.key)}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="console-panel p-6 space-y-4">
          <input required placeholder="Full name" className="field-input" value={form.name} onChange={update("name")} />
          <input required type="email" placeholder="Email address" className="field-input" value={form.email} onChange={update("email")} />
          <input required type="password" minLength={8} placeholder="Password (min. 8 characters)" className="field-input" value={form.password} onChange={update("password")} />

          {role === "student" && (
            <>
              <input placeholder="College / University" className="field-input" value={form.college} onChange={update("college")} />
              <div className="flex gap-3">
                <input placeholder="Branch" className="field-input" value={form.branch} onChange={update("branch")} />
                <input placeholder="Graduation year" className="field-input" value={form.graduationYear} onChange={update("graduationYear")} />
              </div>
            </>
          )}
          {role === "company" && (
            <>
              <input placeholder="Company name" className="field-input" value={form.companyName} onChange={update("companyName")} />
              <input placeholder="Company website" className="field-input" value={form.companyWebsite} onChange={update("companyWebsite")} />
            </>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending verification code..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-dim text-center mt-6">
          Already have an account? <Link to="/login" className="text-cyan hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
