import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Guards a route by auth status and, optionally, role.
// Usage: <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { user, status } = useSelector((s) => s.auth);

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void">
        <p className="font-mono text-dim text-sm tracking-widest animate-pulse">
          CHECKING CREDENTIALS...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
