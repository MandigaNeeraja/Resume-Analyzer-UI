import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { SEED_ACCOUNTS } from "../../config/navigation";
import BrandLogo from "../../components/icons/BrandLogo";

export default function Login() {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  const quickLogin = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-surface)]">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-md text-white text-center relative z-10">
          <BrandLogo className="w-16 h-16 mx-auto mb-6" variant="light" />
          <h1 className="text-3xl font-bold mb-3 tracking-tight">RecruitPro</h1>
          <p className="text-blue-100 text-lg mb-6">Enterprise Talent Acquisition Platform</p>
          <p className="text-blue-200/80 text-sm leading-relaxed">
            Streamline hiring from requisition to offer. Manage candidates, interviews, and pipeline analytics in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-200/60 text-xs">
            <Shield className="w-4 h-4" />
            <span>Secure company authentication</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200/80 shadow-[var(--shadow-elevated)] p-8">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <BrandLogo className="w-10 h-10" />
            <div>
              <p className="font-semibold text-slate-900">RecruitPro</p>
              <p className="text-xs text-slate-500">Talent Suite</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">Use your company credentials to access the portal</p>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Demo accounts</p>
            <AccountGroup title="Admin" accounts={SEED_ACCOUNTS.admin} onSelect={quickLogin} />
            <AccountGroup title="HR Team" accounts={SEED_ACCOUNTS.hr} onSelect={quickLogin} />
            <AccountGroup title="Managers" accounts={SEED_ACCOUNTS.managers} onSelect={quickLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountGroup({ title, accounts, onSelect }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {accounts.map((acc) => (
          <button
            key={acc.email}
            type="button"
            onClick={() => onSelect(acc)}
            className="px-3 py-1.5 text-xs rounded-md border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-200 text-slate-700 transition-colors"
          >
            {acc.name || acc.email.split("@")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
