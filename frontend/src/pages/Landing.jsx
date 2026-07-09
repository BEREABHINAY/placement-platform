import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Scene3D from "../components/Scene3D";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const stats = [
  { label: "Candidates in orbit", value: "12,400+" },
  { label: "Hiring partners", value: "180+" },
  { label: "Mock interviews run", value: "38,000+" },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative min-h-screen">
        <Scene3D className="absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-void/20 via-void/70 to-void" />

        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6">
          <Logo size={32} />
          <div className="flex gap-3">
            <Link to="/login" className="btn-ghost text-sm py-2 px-5">Log in</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">Get started</Link>
          </div>
        </nav>

        <main className="relative z-10 px-6 sm:px-12 pt-16 sm:pt-24 pb-32 max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-cyan tracking-[0.3em] mb-6"
          >
            MISSION CONTROL FOR YOUR CAREER LAUNCH
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-semibold text-4xl sm:text-6xl leading-tight"
          >
            Every candidate is on a trajectory.
            <br className="hidden sm:block" /> We help you reach the target.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-dim mt-6 max-w-xl mx-auto"
          >
            Placement Prep is one console for students prepping for placements, companies
            hiring from campus, and admins running the whole program — resumes, mock
            interviews, coding rounds, and job alerts, all tracked in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-10"
          >
            <Link to="/register" className="btn-primary">Create your account</Link>
            <Link to="/login" className="btn-ghost">I already have one</Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20">
            {stats.map((s) => (
              <div key={s.label} className="console-panel p-6">
                <p className="font-display text-2xl font-semibold text-amber">{s.value}</p>
                <p className="text-sm text-dim mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
