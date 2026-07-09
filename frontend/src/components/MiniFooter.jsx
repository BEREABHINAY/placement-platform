import { Mail, Phone, Linkedin, Instagram, LifeBuoy } from "lucide-react";

// Compact contact bar for logged-in pages — full details live on the public Footer.
const contacts = [
  { icon: Phone, label: "+91 90000 00000", href: "tel:+919000000000" },
  { icon: Mail, label: "support@placementprep.com", href: "mailto:support@placementprep.com" },
  { icon: LifeBuoy, label: "Helpline", href: "tel:+911800000000" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/placementprep" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/placementprep" },
];

export default function MiniFooter() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-dim">© {new Date().getFullYear()} Placement Prep. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {contacts.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center gap-1.5 text-xs text-dim hover:text-cyan transition"
              >
                <Icon size={13} /> {c.label}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
