import React from 'react';
import { ArrowRight, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { AppView } from '../types';
import { GridSathiLogo } from './GridSathiLogo';
import { OpsSession } from './LoginPage';
import { ThemeMode, ThemeToggle } from './ThemeToggle';

interface WelcomePageProps {
  opsSession: OpsSession | null;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSelectRole: (view: AppView) => void;
  onSignOutOps: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  opsSession,
  theme,
  onToggleTheme,
  onSelectRole,
  onSignOutOps,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Right Theme Switcher */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-4 flex justify-end">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          {/* Bigger Logo & Brand Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <GridSathiLogo size="lg" />
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-display">
                GridSathi
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                BESCOM Bengaluru · Demo data
              </p>
            </div>
          </div>

          {/* Operations Signed-in Banner if returning via Back button */}
          {opsSession && (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <span className="text-emerald-900 dark:text-emerald-200">
                BESCOM Desk signed in as{' '}
                <strong className="font-semibold">{opsSession.userId}</strong>
              </span>
              <button
                type="button"
                onClick={onSignOutOps}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline whitespace-nowrap"
              >
                Sign out
              </button>
            </div>
          )}

          {/* Portal Selection Cards */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">
              Select a view to continue
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => onSelectRole('customer')}
                className="text-left p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Customer
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Check area power status & report outages
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <span>Open Customer View</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectRole('operations')}
                className="text-left p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-950 text-[#FF9900] flex items-center justify-center shrink-0 border border-slate-800">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                      BESCOM Desk
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Live Bengaluru map, incidents & crew dispatch
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <span>
                    {opsSession
                      ? 'Open BESCOM Desk'
                      : 'Sign in with User ID'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span>Visual prototype using sample Bengaluru data</span>
      </footer>
    </div>
  );
};
