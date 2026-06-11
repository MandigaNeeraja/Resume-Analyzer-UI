import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Spinner({ className = "", label = "Loading..." }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 gap-3", className)}>
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
