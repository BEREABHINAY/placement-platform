import { useRef } from "react";

// Six individually-focused boxes that behave like one field.
// Auto-advances on input, supports paste, and backspace moves focus back.
export default function OtpInput({ value, onChange, length = 6 }) {
  const inputsRef = useRef([]);

  const digits = value.padEnd(length, " ").split("").slice(0, length);

  const setDigit = (i, val) => {
    const chars = value.split("");
    chars[i] = val;
    onChange(chars.join("").slice(0, length));
  };

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    if (!val) return;
    setDigit(i, val);
    if (i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i] && digits[i] !== " ") {
        setDigit(i, "");
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        setDigit(i - 1, "");
      }
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted.padEnd(length, "").slice(0, length).trimEnd());
      e.preventDefault();
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === " " ? "" : digits[i]}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          aria-label={`Digit ${i + 1} of verification code`}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-semibold
                     bg-void/60 border border-white/10 rounded-lg text-mist
                     focus:border-cyan/60 outline-none transition"
        />
      ))}
    </div>
  );
}
