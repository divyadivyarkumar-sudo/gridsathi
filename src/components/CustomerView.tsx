import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Truck,
  Zap,
} from 'lucide-react';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { Incident, RepairCrew } from '../types';
import { getCustomerStepIndex } from '../utils/statusStyles';
import { BengaluruMap } from './BengaluruMap';

const TRACKER_STEPS = [
  'Reported',
  'Crew assigned',
  'Repairing',
  'Restored',
] as const;

interface CustomerViewProps {
  incidents: Incident[];
  crews: RepairCrew[];
  selectedAreaId: string;
  onSelectArea: (areaId: string) => void;
  onOpenReportModal: () => void;
  lastSubmissionBanner: string | null;
  onDismissBanner: () => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  incidents,
  crews,
  selectedAreaId,
  onSelectArea,
  onOpenReportModal,
  lastSubmissionBanner,
  onDismissBanner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const matchingAreas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return BENGALURU_AREAS;
    return BENGALURU_AREAS.filter(
      (area) =>
        area.name.toLowerCase().includes(q) ||
        area.shortName.toLowerCase().includes(q) ||
        area.streetHint.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedArea =
    BENGALURU_AREAS.find((a) => a.id === selectedAreaId) ?? BENGALURU_AREAS[0];

  const areaOpenIncident = incidents.find(
    (inc) => inc.areaId === selectedArea.id && inc.status !== 'Restored'
  );
  const areaRestoredIncident = !areaOpenIncident
    ? incidents.find(
        (inc) => inc.areaId === selectedArea.id && inc.status === 'Restored'
      )
    : undefined;

  const activeIncident = areaOpenIncident ?? areaRestoredIncident ?? null;
  const isOutageActive = Boolean(areaOpenIncident);
  const currentStep = activeIncident
    ? getCustomerStepIndex(activeIncident.status)
    : 3;

  const assignedCrew = activeIncident?.assignedCrewId
    ? crews.find((c) => c.id === activeIncident.assignedCrewId)
    : undefined;

  const mapIncidents = useMemo(() => {
    if (activeIncident) return [activeIncident];
    return [];
  }, [activeIncident]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Feedback banner after submitting report */}
      {lastSubmissionBanner && (
        <div className="flex items-center justify-between gap-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">{lastSubmissionBanner}</span>
          </div>
          <button
            type="button"
            onClick={onDismissBanner}
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline whitespace-nowrap shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Quick Area Selection Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              Check power in your area
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Search or tap a Bengaluru neighborhood
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenReportModal}
            className="h-11 px-5 rounded-xl bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 text-sm font-bold transition-colors whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Report outage
          </button>
        </div>

        {/* Search Input + Location Dropdown */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area or street (e.g., Indiranagar, Hebbal, Whitefield)"
              aria-label="Search Bengaluru area"
              className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400"
            />
          </div>

          <div className="sm:w-72 shrink-0">
            <select
              aria-label="Select Bengaluru location"
              value={selectedArea.id}
              onChange={(e) => onSelectArea(e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400"
            >
              {BENGALURU_AREAS.map((area) => {
                const areaOutage = incidents.find(
                  (inc) => inc.areaId === area.id && inc.status !== 'Restored'
                );
                return (
                  <option key={area.id} value={area.id}>
                    {area.name} — {areaOutage ? 'Outage' : 'Power OK'}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Quick-Pick Area Cards */}
        {matchingAreas.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-2">
            No matching areas found. Pick any of the {BENGALURU_AREAS.length}{' '}
            areas from the dropdown.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                {searchQuery.trim()
                  ? `Showing ${matchingAreas.length} matching areas`
                  : `Quick areas (${BENGALURU_AREAS.length} locations in dropdown)`}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(searchQuery.trim()
                ? matchingAreas
                : matchingAreas.slice(0, 6)
              ).map((area) => {
                const isSelected = area.id === selectedArea.id;
                const areaOutage = incidents.find(
                  (inc) => inc.areaId === area.id && inc.status !== 'Restored'
                );
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => onSelectArea(area.id)}
                    className={`text-left p-3 rounded-xl border transition-colors min-h-[64px] flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                        : 'bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="text-xs font-semibold truncate block w-full">
                      {area.shortName}
                    </span>
                    <span
                      className={`text-[11px] font-medium mt-1 block ${
                        isSelected
                          ? areaOutage
                            ? 'text-amber-300 dark:text-red-700'
                            : 'text-emerald-300 dark:text-emerald-700'
                          : areaOutage
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {areaOutage ? 'Outage' : 'Power OK'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Focused Area Status + Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Status & Order-Style Progress Tracker Card (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          {/* Selected Area Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedArea.streetHint}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {selectedArea.name}
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Demo data
            </span>
          </div>

          {/* Primary Power Status Box */}
          {isOutageActive && areaOpenIncident ? (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-4 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Outage in your area
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Current status:{' '}
                  <strong className="font-semibold">
                    {areaOpenIncident.status}
                  </strong>
                  {' · '}
                  <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    Updated {areaOpenIncident.updatedAtLabel}
                  </span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                  {areaOpenIncident.reportCount} neighbour reports grouped
                  {assignedCrew
                    ? ` · ${assignedCrew.name} (${assignedCrew.status.toLowerCase()})`
                    : ' · Waiting for crew assignment'}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Power is available
                </p>
                {areaRestoredIncident ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Recent outage was restored at{' '}
                    <strong className="font-semibold">
                      {areaRestoredIncident.updatedAtLabel}
                    </strong>
                    .
                  </p>
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    No active outage reported in {selectedArea.shortName}.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Amazon-Style 4-Step Progress Tracker */}
          {activeIncident && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Restoration progress
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Reported at {activeIncident.reportedAtLabel}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TRACKER_STEPS.map((label, idx) => {
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={label} className="space-y-2">
                      <div className="flex items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors shrink-0 ${
                            activeIncident.status === 'Restored'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : isCompleted
                              ? 'bg-slate-900 dark:bg-[#FF9900] text-white dark:text-slate-950 border-slate-900 dark:border-[#FF9900]'
                              : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        {idx < TRACKER_STEPS.length - 1 && (
                          <div
                            className={`h-1 flex-1 mx-1 rounded-full ${
                              idx < currentStep
                                ? activeIncident.status === 'Restored'
                                  ? 'bg-emerald-600'
                                  : 'bg-slate-900 dark:bg-[#FF9900]'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        )}
                      </div>
                      <p
                        className={`text-xs leading-tight ${
                          isCurrent
                            ? 'font-bold text-slate-900 dark:text-slate-100'
                            : isCompleted
                            ? 'font-medium text-slate-700 dark:text-slate-300'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Latest Timeline Update */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  {assignedCrew ? (
                    <>
                      <Truck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
                      <span>
                        {assignedCrew.name} ({assignedCrew.lead})
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                      <span>{activeIncident.streetSummary}</span>
                    </>
                  )}
                </span>
                <span className="font-mono-code text-slate-500 dark:text-slate-400 shrink-0">
                  {activeIncident.updatedAtLabel}
                </span>
              </div>
            </div>
          )}

          {/* Bottom Report CTA */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isOutageActive
                ? 'Facing an issue nearby? Add your report to this area.'
                : 'No power at your home? Let BESCOM know right away.'}
            </p>
            <button
              type="button"
              onClick={onOpenReportModal}
              className="h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              Report outage in {selectedArea.shortName}
            </button>
          </div>
        </div>

        {/* Live Area Map Card (5 cols on lg) */}
        <div className="lg:col-span-5">
          <BengaluruMap
            incidents={mapIncidents}
            crews={crews}
            selectedIncidentId={activeIncident?.id ?? null}
            focusCenter={selectedArea.center}
            focusZoom={14}
            compactMode={true}
            heightClassName="h-[300px] lg:h-[380px]"
          />
        </div>
      </div>
    </div>
  );
};
