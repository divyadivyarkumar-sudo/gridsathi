import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, UserCheck } from 'lucide-react';
import { GridSathiLogo } from './GridSathiLogo';
import { ThemeMode, ThemeToggle } from './ThemeToggle';

export interface OpsSession {
  userId: string;
}

interface LoginPageProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onBack: () => void;
  onSuccess: (session: OpsSession) => void;
}

const OPS_USER_ID = 'user';
const OPS_PASSWORD = '123';

export const LoginPage: React.FC<LoginPageProps> = ({
  theme,
  onToggleTheme,
  onBack,
  onSuccess,
}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFillDemo = () => {
    setErrorMsg(null);
    setUserId(OPS_USER_ID);
    setPassword(OPS_PASSWORD);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = userId.trim();

    if (!trimmedId) {
      setErrorMsg('Please enter your User ID.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (trimmedId !== OPS_USER_ID) {
      setErrorMsg(`Invalid User ID. Use "${OPS_USER_ID}".`);
      return;
    }

    if (password !== OPS_PASSWORD) {
      setErrorMsg(`Incorrect password. Use "${OPS_PASSWORD}".`);
      return;
    }

    onSuccess({ userId: trimmedId });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Back & Theme Toggle */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 -ml-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          {/* Logo & Login Title */}
          <div className="flex flex-col items-center text-center space-y-3">
            <GridSathiLogo size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
                BESCOM Desk Login
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Sign in with your User ID and password
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs sm:text-sm text-red-800 dark:text-red-300 font-medium"
            >
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="ops-userid"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                User ID
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="ops-userid"
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Enter User ID"
                  autoComplete="username"
                  className="w-full h-11 pl-10 pr-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400 dark:focus:border-slate-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="ops-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="ops-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-11 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400 dark:focus:border-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 text-sm font-bold transition-colors"
            >
              Sign in to BESCOM Desk
            </button>
          </form>

          {/* Credentials Helper Box */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-3.5 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  BESCOM Desk login details
                </p>
                <p className="font-mono-code text-[11px] truncate">
                  User ID: {OPS_USER_ID} · Password: {OPS_PASSWORD}
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 transition-colors"
              >
                Auto-fill
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
