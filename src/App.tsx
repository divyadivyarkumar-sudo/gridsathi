import React, { useCallback, useEffect, useRef, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ArrowLeft, LogOut, Play, RotateCcw, Square } from 'lucide-react';
import { CustomerView } from './components/CustomerView';
import { GridSathiLogo } from './components/GridSathiLogo';
import { LoginPage, OpsSession } from './components/LoginPage';
import { OperationsView } from './components/OperationsView';
import { ReportOutageModal } from './components/ReportOutageModal';
import { ThemeMode, ThemeToggle } from './components/ThemeToggle';
import { WelcomePage } from './components/WelcomePage';
import {
  BENGALURU_AREAS,
  formatCurrentTimeLabel,
  haversineKm,
  INITIAL_CREWS,
  INITIAL_INCIDENTS,
} from './data/bengaluruData';
import {
  AppView,
  CustomerReportPayload,
  Incident,
  IncidentStatus,
  RepairCrew,
} from './types';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'login' | 'portal'>(
    'welcome'
  );
  const [portalView, setPortalView] = useState<AppView>('customer');
  const [opsSession, setOpsSession] = useState<OpsSession | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [crews, setCrews] = useState<RepairCrew[]>(INITIAL_CREWS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    INITIAL_INCIDENTS[0].id
  );
  const [selectedAreaId, setSelectedAreaId] = useState<string>('indiranagar');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [lastSubmissionBanner, setLastSubmissionBanner] = useState<
    string | null
  >(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem('gridsathi-theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Sync .dark class on <html> element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem('gridsathi-theme', theme);
    } catch {
      // Ignore storage restrictions
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Demo walkthrough state
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoStepLabel, setDemoStepLabel] = useState<string | null>(null);
  const demoTimersRef = useRef<number[]>([]);

  useEffect(() => {
    const onQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
    };
  }, []);

  // Lively crew movement interpolation when a crew is En route
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCrews((prevCrews) => {
        let changed = false;
        const nextCrews = prevCrews.map((crew) => {
          if (crew.status !== 'En route' || !crew.assignedIncidentId) {
            return crew;
          }
          const target = incidents.find(
            (inc) => inc.id === crew.assignedIncidentId
          );
          if (!target) return crew;

          const dLat = target.center.lat - crew.currentPosition.lat;
          const dLng = target.center.lng - crew.currentPosition.lng;
          const dist = Math.hypot(dLat, dLng);

          if (dist < 0.0007) {
            return crew;
          }

          changed = true;
          return {
            ...crew,
            currentPosition: {
              lat: crew.currentPosition.lat + dLat * 0.22,
              lng: crew.currentPosition.lng + dLng * 0.22,
            },
          };
        });
        return changed ? nextCrews : prevCrews;
      });
    }, 850);

    return () => window.clearInterval(interval);
  }, [incidents]);

  const clearDemoTimers = useCallback(() => {
    demoTimersRef.current.forEach((id) => window.clearTimeout(id));
    demoTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearDemoTimers();
  }, [clearDemoTimers]);

  const handleAssignCrew = useCallback(
    (incidentId: string, crewId: string) => {
      const nowLabel = formatCurrentTimeLabel();
      const targetIncident = incidents.find((inc) => inc.id === incidentId);
      const targetCrew = crews.find((c) => c.id === crewId);
      if (!targetIncident || !targetCrew) return;

      const areaShort = targetIncident.areaName.split(' (')[0];

      setCrews((prev) =>
        prev.map((c) => {
          if (c.id === crewId) {
            return {
              ...c,
              status: 'En route',
              assignedIncidentId: incidentId,
              areaLabel: `Heading to ${areaShort}`,
            };
          }
          if (c.assignedIncidentId === incidentId) {
            return {
              ...c,
              status: 'Available',
              assignedIncidentId: null,
              areaLabel: 'Depot standby',
              currentPosition: c.homeBase,
            };
          }
          return c;
        })
      );

      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id !== incidentId) return inc;
          const nextStatus: IncidentStatus =
            inc.status === 'New' ? 'Crew assigned' : inc.status;
          return {
            ...inc,
            assignedCrewId: crewId,
            status: nextStatus,
            updatedAtLabel: nowLabel,
            timeline: [
              ...inc.timeline,
              {
                id: `tl-${Date.now()}-${Math.random()}`,
                timeLabel: nowLabel,
                message: `${targetCrew.name} (${targetCrew.lead}) assigned by BESCOM Desk`,
              },
            ],
          };
        })
      );
    },
    [incidents, crews]
  );

  const handleUpdateStatus = useCallback(
    (incidentId: string, status: IncidentStatus) => {
      const nowLabel = formatCurrentTimeLabel();
      const targetIncident = incidents.find((inc) => inc.id === incidentId);
      if (!targetIncident) return;

      const areaShort = targetIncident.areaName.split(' (')[0];

      setIncidents((prev) =>
        prev.map((inc) => {
          if (inc.id !== incidentId) return inc;
          const messageByStatus: Record<IncidentStatus, string> = {
            New: 'Incident marked as New',
            'Crew assigned': 'Crew assigned to outage',
            'On site': 'Repair crew arrived on site',
            Repairing: 'Equipment repair in progress',
            Restored: 'Power restored to affected customers',
          };
          return {
            ...inc,
            status,
            updatedAtLabel: nowLabel,
            timeline: [
              ...inc.timeline,
              {
                id: `tl-${Date.now()}-${Math.random()}`,
                timeLabel: nowLabel,
                message: messageByStatus[status],
              },
            ],
          };
        })
      );

      // Sync assigned crew status and location
      setCrews((prev) =>
        prev.map((c) => {
          if (c.assignedIncidentId !== incidentId) return c;
          if (status === 'Restored') {
            return {
              ...c,
              status: 'Available',
              assignedIncidentId: null,
              areaLabel: `${areaShort} (Completed)`,
              currentPosition: c.homeBase,
            };
          }
          if (status === 'On site' || status === 'Repairing') {
            return {
              ...c,
              status: 'On site',
              areaLabel: areaShort,
              currentPosition: targetIncident.center,
            };
          }
          if (status === 'Crew assigned') {
            return {
              ...c,
              status: 'En route',
              areaLabel: `Heading to ${areaShort}`,
            };
          }
          return c;
        })
      );
    },
    [incidents]
  );

  const handleMarkRestored = useCallback(
    (incidentId: string) => {
      handleUpdateStatus(incidentId, 'Restored');
    },
    [handleUpdateStatus]
  );

  const handleCustomerReport = useCallback(
    (payload: CustomerReportPayload) => {
      const area =
        BENGALURU_AREAS.find((a) => a.id === payload.areaId) ??
        BENGALURU_AREAS[0];
      const nowLabel = formatCurrentTimeLabel();

      // Group into nearby open incident if matching area or within 1.8 km
      const matchingOpen = incidents.find(
        (inc) =>
          inc.status !== 'Restored' &&
          (inc.areaId === area.id || haversineKm(inc.center, area.center) < 1.8)
      );

      if (matchingOpen) {
        const extraDetail = payload.customStreet
          ? ` near ${payload.customStreet}`
          : '';
        setIncidents((prev) =>
          prev.map((inc) => {
            if (inc.id !== matchingOpen.id) return inc;
            const nextCount = inc.reportCount + 1;
            return {
              ...inc,
              reportCount: nextCount,
              estimatedCustomers: inc.estimatedCustomers + 18,
              priority: nextCount >= 8 ? 'High' : inc.priority,
              updatedAtLabel: nowLabel,
              timeline: [
                ...inc.timeline,
                {
                  id: `tl-${Date.now()}`,
                  timeLabel: nowLabel,
                  message: `Customer report grouped: ${payload.issueType}${extraDetail}`,
                },
              ],
            };
          })
        );
        setSelectedAreaId(area.id);
        setSelectedIncidentId(matchingOpen.id);
        setLastSubmissionBanner(
          `Your report was added to the active incident in ${area.shortName}.`
        );
        return;
      }

      // Otherwise create a brand new incident
      const newId = `inc-${area.id}-${Date.now()}`;
      const isUrgent =
        payload.issueType.includes('Transformer') ||
        payload.issueType.includes('Damaged');

      const newIncident: Incident = {
        id: newId,
        areaId: area.id,
        areaName: area.name,
        streetSummary: payload.customStreet || area.streetHint,
        center: area.center,
        radiusMeters: 400,
        reportedAtLabel: nowLabel,
        updatedAtLabel: nowLabel,
        reportCount: 1,
        estimatedCustomers: 45,
        priority: isUrgent ? 'High' : 'Medium',
        status: 'New',
        equipmentLabel: `Transformer ${area.transformerId} · Feeder ${area.feederId}`,
        transformerId: area.transformerId,
        feederId: area.feederId,
        assignedCrewId: null,
        timeline: [
          {
            id: `tl-${Date.now()}`,
            timeLabel: nowLabel,
            message: `New report submitted: ${payload.issueType}${
              payload.note ? ` (${payload.note})` : ''
            }`,
          },
        ],
      };

      setIncidents((prev) => [newIncident, ...prev]);
      setSelectedAreaId(area.id);
      setSelectedIncidentId(newId);
      setLastSubmissionBanner(
        `New outage reported for ${area.shortName}. BESCOM Desk has been notified.`
      );
    },
    [incidents]
  );

  const handleStopDemo = useCallback(() => {
    clearDemoTimers();
    setIsDemoPlaying(false);
    setDemoStepLabel(null);
  }, [clearDemoTimers]);

  const handleResetDemoData = useCallback(() => {
    handleStopDemo();
    setIncidents(INITIAL_INCIDENTS);
    setCrews(INITIAL_CREWS);
    setSelectedIncidentId(INITIAL_INCIDENTS[0].id);
    setSelectedAreaId('indiranagar');
    setLastSubmissionBanner(null);
  }, [handleStopDemo]);

  const handlePlayDemo = useCallback(() => {
    clearDemoTimers();
    setIsDemoPlaying(true);

    const hsrArea = BENGALURU_AREAS.find((a) => a.id === 'hsr-layout')!;
    const demoId = 'inc-demo-hsr';
    const t0 = formatCurrentTimeLabel();

    // Reset any prior demo incident in HSR Layout and ensure Crew Gamma is ready
    setCrews((prev) =>
      prev.map((c) =>
        c.id === 'crew-gamma'
          ? {
              ...c,
              status: 'Available',
              assignedIncidentId: null,
              areaLabel: 'BTM / HSR Depot',
              currentPosition: c.homeBase,
            }
          : c
      )
    );

    const initialDemoIncident: Incident = {
      id: demoId,
      areaId: hsrArea.id,
      areaName: hsrArea.name,
      streetSummary: '27th Main Rd & 19th Cross, Sector 2',
      center: hsrArea.center,
      radiusMeters: 440,
      reportedAtLabel: t0,
      updatedAtLabel: t0,
      reportCount: 3,
      estimatedCustomers: 95,
      priority: 'Medium',
      status: 'New',
      equipmentLabel: `Transformer ${hsrArea.transformerId} · Feeder ${hsrArea.feederId}`,
      transformerId: hsrArea.transformerId,
      feederId: hsrArea.feederId,
      assignedCrewId: null,
      timeline: [
        {
          id: 'demo-1',
          timeLabel: t0,
          message: '3 customer reports arrived from 27th Main Rd',
        },
      ],
    };

    setIncidents((prev) => [
      initialDemoIncident,
      ...prev.filter((inc) => inc.id !== demoId),
    ]);
    setSelectedIncidentId(demoId);
    setSelectedAreaId(hsrArea.id);
    setDemoStepLabel(
      'Step 1 of 5: Reports arriving in HSR Layout and grouping into one incident'
    );

    // Step 1b: More reports group into same incident
    const id1b = window.setTimeout(() => {
      const now = formatCurrentTimeLabel();
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === demoId
            ? {
                ...inc,
                reportCount: 11,
                estimatedCustomers: 280,
                priority: 'High',
                updatedAtLabel: now,
                timeline: [
                  ...inc.timeline,
                  {
                    id: 'demo-2',
                    timeLabel: now,
                    message:
                      '8 more nearby reports grouped into this single incident',
                  },
                ],
              }
            : inc
        )
      );
    }, 1500);

    // Step 2: Assign Crew Gamma
    const id2 = window.setTimeout(() => {
      const now = formatCurrentTimeLabel();
      setDemoStepLabel(
        'Step 2 of 5: Crew Gamma assigned and moving toward HSR Layout'
      );
      setCrews((prev) =>
        prev.map((c) =>
          c.id === 'crew-gamma'
            ? {
                ...c,
                status: 'En route',
                assignedIncidentId: demoId,
                areaLabel: 'Heading to HSR Layout',
              }
            : c
        )
      );
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === demoId
            ? {
                ...inc,
                status: 'Crew assigned',
                assignedCrewId: 'crew-gamma',
                updatedAtLabel: now,
                timeline: [
                  ...inc.timeline,
                  {
                    id: 'demo-3',
                    timeLabel: now,
                    message: 'Crew Gamma (Karthik N.) assigned and en route',
                  },
                ],
              }
            : inc
        )
      );
    }, 3200);

    // Step 3: Crew Gamma reaches site
    const id3 = window.setTimeout(() => {
      const now = formatCurrentTimeLabel();
      setDemoStepLabel('Step 3 of 5: Crew Gamma arrived on site at TX-601');
      setCrews((prev) =>
        prev.map((c) =>
          c.id === 'crew-gamma'
            ? {
                ...c,
                status: 'On site',
                areaLabel: 'HSR Layout',
                currentPosition: hsrArea.center,
              }
            : c
        )
      );
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === demoId
            ? {
                ...inc,
                status: 'On site',
                updatedAtLabel: now,
                timeline: [
                  ...inc.timeline,
                  {
                    id: 'demo-4',
                    timeLabel: now,
                    message: 'Crew Gamma reached Transformer TX-601 on site',
                  },
                ],
              }
            : inc
        )
      );
    }, 6400);

    // Step 4: Repairs begin
    const id4 = window.setTimeout(() => {
      const now = formatCurrentTimeLabel();
      setDemoStepLabel('Step 4 of 5: Repairs underway on Feeder FDR-HSR-09');
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === demoId
            ? {
                ...inc,
                status: 'Repairing',
                updatedAtLabel: now,
                timeline: [
                  ...inc.timeline,
                  {
                    id: 'demo-5',
                    timeLabel: now,
                    message: 'Repairing damaged drop cable on 27th Main Rd',
                  },
                ],
              }
            : inc
        )
      );
    }, 8800);

    // Step 5: Power restored
    const id5 = window.setTimeout(() => {
      const now = formatCurrentTimeLabel();
      setDemoStepLabel(
        'Step 5 of 5: Power restored in HSR Layout — map and customer view updated'
      );
      setCrews((prev) =>
        prev.map((c) =>
          c.id === 'crew-gamma'
            ? {
                ...c,
                status: 'Available',
                assignedIncidentId: null,
                areaLabel: 'HSR Layout (Completed)',
                currentPosition: c.homeBase,
              }
            : c
        )
      );
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === demoId
            ? {
                ...inc,
                status: 'Restored',
                updatedAtLabel: now,
                timeline: [
                  ...inc.timeline,
                  {
                    id: 'demo-6',
                    timeLabel: now,
                    message: 'Power restored to all 280 customers in Sector 2',
                  },
                ],
              }
            : inc
        )
      );
      setIsDemoPlaying(false);
    }, 11500);

    demoTimersRef.current = [id1b, id2, id3, id4, id5];
  }, [clearDemoTimers]);

  return (
    <APIProvider
      apiKey={GOOGLE_MAPS_API_KEY}
      libraries={['marker']}
      language="en"
      region="IN"
    >
      <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Mandatory Case A Quota Banner */}
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner,
              visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Screen Router: Welcome -> Operations Login (only for Operations) -> Portal */}
        {screen === 'welcome' ? (
          <WelcomePage
            opsSession={opsSession}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSelectRole={(role) => {
              if (role === 'customer') {
                setPortalView('customer');
                setScreen('portal');
              } else if (opsSession) {
                setPortalView('operations');
                setScreen('portal');
              } else {
                setScreen('login');
              }
            }}
            onSignOutOps={() => {
              setOpsSession(null);
            }}
          />
        ) : screen === 'login' ? (
          <LoginPage
            theme={theme}
            onToggleTheme={toggleTheme}
            onBack={() => setScreen('welcome')}
            onSuccess={(newSession) => {
              setOpsSession(newSession);
              setPortalView('operations');
              setScreen('portal');
            }}
          />
        ) : (
          <>
            <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
                {/* Left: Explicit Back Button + Brand Zone */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setScreen('welcome')}
                    aria-label="Back to welcome page"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-2 min-w-0">
                    <GridSathiLogo size="sm" />
                    <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 font-display">
                      GridSathi
                    </span>
                    <span className="hidden md:inline text-xs text-slate-400">
                      ·
                    </span>
                    <span className="hidden md:inline text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap truncate">
                      {portalView === 'operations'
                        ? `BESCOM Desk (${opsSession?.userId ?? 'user'})`
                        : 'Customer · Bengaluru'}
                    </span>
                  </div>
                </div>

                {/* Right: Theme Toggle + Play Demo + Sign out (Operations only) */}
                <div className="flex items-center gap-2 shrink-0">
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />

                  {isDemoPlaying ? (
                    <button
                      type="button"
                      onClick={handleStopDemo}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Stop demo</span>
                      <span className="sm:hidden">Stop</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePlayDemo}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 h-9 rounded-lg bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Play outage demo</span>
                      <span className="sm:hidden">Demo</span>
                    </button>
                  )}

                  {portalView === 'operations' && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpsSession(null);
                        setScreen('welcome');
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sign out</span>
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Non-intrusive Demo Progress Bar */}
            {demoStepLabel && (
              <div className="bg-slate-900 dark:bg-slate-800 text-white border-b border-slate-800 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium truncate">{demoStepLabel}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {!isDemoPlaying && (
                      <button
                        type="button"
                        onClick={handleResetDemoData}
                        className="inline-flex items-center gap-1 text-slate-300 hover:text-white underline whitespace-nowrap"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset demo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Role-Locked Content Viewport */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
              {portalView === 'operations' && opsSession ? (
                <OperationsView
                  incidents={incidents}
                  crews={crews}
                  selectedIncidentId={selectedIncidentId}
                  onSelectIncident={setSelectedIncidentId}
                  onAssignCrew={handleAssignCrew}
                  onUpdateStatus={handleUpdateStatus}
                  onMarkRestored={handleMarkRestored}
                />
              ) : (
                <CustomerView
                  incidents={incidents}
                  crews={crews}
                  selectedAreaId={selectedAreaId}
                  onSelectArea={setSelectedAreaId}
                  onOpenReportModal={() => setIsReportModalOpen(true)}
                  lastSubmissionBanner={lastSubmissionBanner}
                  onDismissBanner={() => setLastSubmissionBanner(null)}
                />
              )}
            </main>

        {/* Quiet Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>GridSathi · Visual prototype with Demo data</span>
            <button
              type="button"
              onClick={handleResetDemoData}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline"
            >
              Reset sample data
            </button>
          </div>
        </footer>

        <ReportOutageModal
          isOpen={isReportModalOpen}
          defaultAreaId={selectedAreaId}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleCustomerReport}
        />
          </>
        )}
      </div>
    </APIProvider>
  );
}
