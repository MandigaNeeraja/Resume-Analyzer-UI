export default function BrandLogo({ className = "w-10 h-10", variant = "default" }) {
  const isLight = variant === "light";

  return (
    <div
      className={`${className} rounded-xl flex items-center justify-center shrink-0 ${
        isLight
          ? "bg-white/10 backdrop-blur ring-1 ring-white/20"
          : "bg-primary-600 shadow-lg shadow-primary-900/30"
      }`}
    >
      <svg
        className={isLight ? "w-[55%] h-[55%] text-white" : "w-[55%] h-[55%] text-white"}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect x="6" y="8" width="20" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M11 14h10M11 18h7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <circle cx="22" cy="10" r="5" fill={isLight ? "rgba(255,255,255,0.15)" : "#1d4ed8"} stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20.5 10l1 1 2.5-2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
