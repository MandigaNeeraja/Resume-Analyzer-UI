import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-sm border border-brand-600",
  secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm",
  outline: "bg-transparent hover:bg-brand-50 text-brand-700 border border-brand-200",
  danger: "bg-red-600 hover:bg-red-700 text-white border border-red-600 shadow-sm",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
  icon: "h-9 w-9 p-0",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150",
        "disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
