import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Truck,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import { Incident, IncidentStatus, RepairCrew } from '../types';
import {
  getPriorityTextClass,
  getStatusBadgeStyle,
} from '../utils/statusStyles';
import { BengaluruMap } from './BengaluruMap';

const STATUS_OPTIONS: IncidentStatus[] = [
  'New',
  'Crew assigned',
  'On site',
  'Repairing',
  'Restored',
];

interface OperationsViewProps {
  incidents: Incident[];
  crews: RepairCrew[];
  selectedIncidentId: string | null;
  onSelectIncident: (incidentId: string) => void;
  onAssignCrew: (incidentId: string, crewId: string) => void;
  onUpdateStatus: (incidentId: string, status: IncidentStatus) => void;
  onMarkRestored: (incidentId: string) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  incidents,
  crews,
  selectedIncidentId,
  onSelectIncident,
  onAssignCrew,
  onUpdateStatus,
  onMarkRestored,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'open' | 'restored'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [crewPickId, setCrewPickId] = useState<string>('');

  const openIncidents = incidents.filter((inc) => inc.status !== 'Restored');
  const totalCustomersAffected = openIncidents.reduce(
    (sum, inc) => sum + inc.estimatedCustomers,
    0
  );
  const availableCrewsCount = crews.filter(
    (crew) => crew.status === 'Available'
  ).length;

  const filteredIncidents = incidents.filter((inc) => {
    if (filterMode === 'open' && inc.status === 'Restored') return false;
    if (filterMode === 'restored' && inc.status !== 'Restored') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inc.areaName.toLowerCase().includes(q) ||
        inc.streetSummary.toLowerCase().includes(q) ||
        inc.equipmentLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedIncident =
    incidents.find((inc) => inc.id === selectedIncidentId) ??
    filteredIncidents[0] ??
    null;

  useEffect(() => {
    if (!selectedIncident) return;
    if (selectedIncident.assignedCrewId) {
      setCrewPickId(selectedIncident.assignedCrewId);
    } else {
      const firstAvail = crews.find((c) => c.status === 'Available') ?? crews[0];
      setCrewPickId(firstAvail ? firstAvail.id : '');
    }
  }, [selectedIncident?.id, selectedIncident?.assignedCrewId, crews]);

  const getCrewById = (crewId: string | null): RepairCrew | undefined =>
    crewId ? crews.find((c) => c.id === crewId) : undefined;

  return (
    <div className="space-y-4">
      {/* Panel Title */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
          BESCOM Desk
        </h1>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Bengaluru · Demo data
        </span>
      </div>

      {/* Top 3-metric Summary Strip */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Open outages
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          </div>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums font-display">
            {openIncidents.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Customers affected
            </span>
            <Users className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          </div>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums font-display">
            {totalCustomersAffected.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              Crews available
            </span>
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums font-display">
            {availableCrewsCount}
            <span className="text-sm font-normal text-slate-400 dark:text-slate-500">
              {' '}
              / {crews.length}
            </span>
          </p>
        </div>
      </div>

      {/* Main Operations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-3">
          <BengaluruMap
            incidents={incidents}
            crews={crews}
            selectedIncidentId={selectedIncident?.id ?? null}
            onSelectIncident={onSelectIncident}
            heightClassName="h-[380px] sm:h-[460px] lg:h-[600px]"
          />

          {/* Compact Crew Status Strip below map */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Repair Crews
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Live map locations
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {crews.map((crew) => (
                <div
                  key={crew.id}
                  className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {crew.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {crew.lead} · {crew.areaLabel}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                      crew.status === 'Available'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : crew.status === 'En route'
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {crew.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident List & Selected Incident Action Panel (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search + Filter Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by area or equipment..."
                aria-label="Filter incidents by area or equipment"
                className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filterMode === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  All ({incidents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('open')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filterMode === 'open'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Open ({openIncidents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('restored')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filterMode === 'restored'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Restored ({incidents.length - openIncidents.length})
                </button>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Grouped by area
              </span>
            </div>
          </div>

          {/* Incident Cards */}
          <div className="space-y-2.5 max-h-[370px] overflow-y-auto pr-0.5">
            {filteredIncidents.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No matching incidents
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Try clearing the search or switching filters.
                </p>
              </div>
            ) : (
              filteredIncidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                const statusStyle = getStatusBadgeStyle(inc.status);
                const assignedCrew = getCrewById(inc.assignedCrewId);

                return (
                  <button
                    key={inc.id}
                    type="button"
                    onClick={() => onSelectIncident(inc.id)}
                    className={`w-full text-left bg-white dark:bg-slate-900 rounded-xl p-3.5 border transition-colors ${
                      isSelected
                        ? 'border-slate-900 dark:border-[#FF9900] ring-1 ring-slate-900 dark:ring-[#FF9900]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {inc.areaName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {inc.streetSummary}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 ${statusStyle.text}`}
                      >
                        {inc.status === 'Restored' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        {inc.status}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                      <span>Reported {inc.reportedAtLabel}</span>
                      <span
                        className="text-slate-300 dark:text-slate-600"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {inc.reportCount} reports
                      </span>
                      <span
                        className="text-slate-300 dark:text-slate-600"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                      <span>~{inc.estimatedCustomers} customers</span>
                      <span
                        className="text-slate-300 dark:text-slate-600"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                      <span className={getPriorityTextClass(inc.priority)}>
                        {inc.priority} priority
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-mono-code truncate">
                        {inc.equipmentLabel}
                      </span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap shrink-0">
                        {assignedCrew ? assignedCrew.name : 'No crew yet'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Incident Management Panel */}
          {selectedIncident && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Selected incident
                  </p>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {selectedIncident.areaName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="font-mono-code">
                      {selectedIncident.equipmentLabel}
                    </span>
                  </p>
                </div>

                {selectedIncident.status !== 'Restored' && (
                  <button
                    type="button"
                    onClick={() => onMarkRestored(selectedIncident.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as restored
                  </button>
                )}
              </div>

              {/* Assign Crew Control */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label
                  htmlFor="crew-select"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  BESCOM Desk — Crew assignment
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    id="crew-select"
                    value={crewPickId}
                    onChange={(e) => setCrewPickId(e.target.value)}
                    className="flex-1 h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400"
                  >
                    {crews.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.lead}) — {c.status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={
                      !crewPickId || selectedIncident.status === 'Restored'
                    }
                    onClick={() =>
                      onAssignCrew(selectedIncident.id, crewPickId)
                    }
                    className="px-4 h-10 rounded-lg bg-[#FF9900] hover:bg-[#e68a00] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0"
                  >
                    Assign crew
                  </button>
                </div>
              </div>

              {/* Simple Status Selector */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Update status
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {STATUS_OPTIONS.map((statusOpt) => {
                    const isActive = selectedIncident.status === statusOpt;
                    return (
                      <button
                        key={statusOpt}
                        type="button"
                        onClick={() =>
                          onUpdateStatus(selectedIncident.id, statusOpt)
                        }
                        className={`px-2 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-slate-900 dark:bg-[#FF9900] text-white dark:text-slate-950 border-slate-900 dark:border-[#FF9900]'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {statusOpt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Wrench className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Activity timeline
                </div>
                <ol className="space-y-2">
                  {[...selectedIncident.timeline].reverse().map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-start gap-2.5 text-xs"
                    >
                      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono-code whitespace-nowrap shrink-0 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {entry.timeLabel}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {entry.message}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
