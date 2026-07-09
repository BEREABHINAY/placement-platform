import { motion } from "framer-motion";

// A "docking bay" selector — each role is a bay the user docks into.
// The label pairs a system-style callsign with a plain description,
// consistent with the mission-console vocabulary set by the hero.
export default function RoleCard({ callsign, label, description, active, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`console-panel text-left p-5 flex-1 transition-colors ${
        active ? "border-amber/50 shadow-glow" : "hover:border-white/15"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-dim tracking-widest">{callsign}</span>
        <span className={`status-dot ${active ? "bg-amber" : "bg-white/15"}`} />
      </div>
      <p className="font-display font-semibold text-mist">{label}</p>
      <p className="text-sm text-dim mt-1">{description}</p>
    </motion.button>
  );
}
