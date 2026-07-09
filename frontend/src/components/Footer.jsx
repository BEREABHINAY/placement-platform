import { Mail, Phone, Linkedin, Instagram, LifeBuoy } from "lucide-react";
import Logo from "./Logo";

// Contact details are placeholders — swap them for your real ones before deploying.
const contacts = [
  { icon: Phone, label: "+91 90000 00000", href: "tel:+919000000000" },
  { icon: Mail, label: "support@placementprep.com", href: "mailto:support@placementprep.com" },
  { icon: LifeBuoy, label: "24/7 Helpline", href: "tel:+911800000000" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/placementprep" },
  { icon: Instagram, label: "@placementprep", href: "https://instagram.com/placementprep" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-panel/40 mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-6">
          <div>
            <Logo size={30} />
            <p className="text-sm text-dim mt-4 max-w-xs">
              One console for students prepping for placements, companies hiring from
              campus, and admins running the whole program.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs text-cyan tracking-widest mb-4">GET IN TOUCH</p>
            <ul className="space-y-3">
              {contacts.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                      className="flex items-center gap-2.5 text-sm text-dim hover:text-cyan transition"
                    >
                      <Icon size={15} /> {c.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-dim">© {new Date().getFullYear()} Placement Prep. All rights reserved.</p>
          <p className="text-xs text-dim">Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
}
