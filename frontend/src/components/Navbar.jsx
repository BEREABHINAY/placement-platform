import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, BookOpen, ClipboardList, Award, LayoutDashboard, LogOut, Trash2, ChevronDown } from "lucide-react";
import { logoutRequest } from "../api/authApi";
import { setUnauthenticated } from "../store/authSlice";
import DeleteAccountModal from "./DeleteAccountModal";
import Logo from "./Logo";

const dashboardPathByRole = { student: "/dashboard/student", company: "/dashboard/company", admin: "/dashboard/admin" };

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const menuRef = useRef(null);

  const dashboardPath = dashboardPathByRole[user?.role] || "/";
  const isAtDashboardRoot = location.pathname === dashboardPath;

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logoutRequest();
    dispatch(setUnauthenticated());
    navigate("/login");
  };

  const navLinks = [
    { to: "/courses", label: "Courses", icon: BookOpen },
    { to: "/tests", label: "Tests", icon: ClipboardList },
    ...(user?.role === "student" ? [{ to: "/certificates", label: "Certificates", icon: Award }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-void/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 sm:px-8 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 min-w-0">
            {!isAtDashboardRoot && (
              <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-dim hover:text-cyan hover:border-cyan/40 transition shrink-0"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <Link to={dashboardPath} className="shrink-0 text-sm sm:text-base">
              <Logo size={28} />
            </Link>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((l) => {
              const Icon = l.icon;
              const active = location.pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition ${
                    active ? "text-amber bg-amber/10" : "text-dim hover:text-mist"
                  }`}
                >
                  <Icon size={15} /> {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 transition"
            >
              <span className="w-7 h-7 rounded-full bg-cyan/15 text-cyan flex items-center justify-center text-xs font-display font-semibold">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </span>
              <span className="hidden sm:inline text-sm text-mist max-w-[120px] truncate">{user?.name?.split(" ")[0]}</span>
              <ChevronDown size={14} className="text-dim" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 console-panel p-2 shadow-glow">
                <p className="px-3 py-2 text-xs text-dim truncate">{user?.email}</p>
                <div className="h-px bg-white/5 my-1" />
                <Link
                  to={dashboardPath}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-mist hover:bg-white/5 transition"
                >
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-mist hover:bg-white/5 transition"
                >
                  <LogOut size={15} /> Log out
                </button>
                <div className="h-px bg-white/5 my-1" />
                <button
                  onClick={() => { setMenuOpen(false); setDeleteModalOpen(true); }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition"
                >
                  <Trash2 size={15} /> Delete account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav row */}
        <nav className="flex sm:hidden items-center gap-1 px-4 pb-3 -mt-1 overflow-x-auto">
          {navLinks.map((l) => {
            const Icon = l.icon;
            const active = location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  active ? "text-amber bg-amber/10" : "text-dim hover:text-mist"
                }`}
              >
                <Icon size={13} /> {l.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {deleteModalOpen && <DeleteAccountModal onClose={() => setDeleteModalOpen(false)} />}
    </>
  );
}
