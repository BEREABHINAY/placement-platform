// Brand mark: three ascending bars inside a rounded square — reads as both
// a "growth/placement trajectory" glyph and a bar chart, in gradient brand colors.
// size controls the square mark; the wordmark scales relative to it via text classes.
export default function Logo({ withWordmark = true, size = 32, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="ppLogoGrad" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F2B84B" />
            <stop offset="1" stopColor="#4FC3F7" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#ppLogoGrad)" fillOpacity="0.16" />
        <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="url(#ppLogoGrad)" strokeOpacity="0.4" />
        <rect x="8" y="17" width="4" height="8" rx="1" fill="#F2B84B" />
        <rect x="14" y="12" width="4" height="13" rx="1" fill="url(#ppLogoGrad)" />
        <rect x="20" y="7" width="4" height="18" rx="1" fill="#4FC3F7" />
      </svg>
      {withWordmark && (
        <span className="font-display font-semibold tracking-wide leading-none">
          Placement<span className="text-amber">Prep</span>
        </span>
      )}
    </span>
  );
}
