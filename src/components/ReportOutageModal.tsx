import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { CustomerReportPayload } from '../types';

interface ReportOutageModalProps {
  isOpen: boolean;
  defaultAreaId: string;
  onClose: () => void;
  onSubmit: (payload: CustomerReportPayload) => void;
}

const ISSUE_OPTIONS = [
  'No power at all',
  'Low voltage or flickering',
  'Transformer spark or noise',
  'Damaged wire or pole',
];

export const ReportOutageModal: React.FC<ReportOutageModalProps> = ({
  isOpen,
  defaultAreaId,
  onClose,
  onSubmit,
}) => {
  const [areaId, setAreaId] = useState(defaultAreaId || BENGALURU_AREAS[0].id);
  const [customStreet, setCustomStreet] = useState('');
  const [issueType, setIssueType] = useState(ISSUE_OPTIONS[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen && defaultAreaId) {
      setAreaId(defaultAreaId);
    }
  }, [isOpen, defaultAreaId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      areaId,
      customStreet: customStreet.trim(),
      issueType,
      note: note.trim(),
    });
    setCustomStreet('');
    setNote('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-outage-title"
    >
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2
              id="report-outage-title"
              className="text-base font-bold text-slate-900 dark:text-slate-100"
            >
              Report a power outage
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close report form"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label
              htmlFor="report-area"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Your area
            </label>
            <select
              id="report-area"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full h-11 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400"
            >
              {BENGALURU_AREAS.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="report-street"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Street or landmark (optional)
            </label>
            <input
              id="report-street"
              type="text"
              value={customStreet}
              onChange={(e) => setCustomStreet(e.target.value)}
              placeholder="e.g., Near 12th Main signal"
              className="w-full h-11 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              What happened?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ISSUE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIssueType(option)}
                  className={`px-3 py-2.5 text-left text-xs font-medium rounded-xl border transition-colors ${
                    issueType === option
                      ? 'bg-slate-900 dark:bg-[#FF9900] text-white dark:text-slate-950 border-slate-900 dark:border-[#FF9900]'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="report-note"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Extra note (optional)
            </label>
            <input
              id="report-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Streetlights also off"
              className="w-full h-11 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400"
            />
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 text-sm font-bold transition-colors"
            >
              Submit report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
