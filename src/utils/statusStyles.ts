import { IncidentPriority, IncidentStatus } from '../types';

export function getStatusBadgeStyle(status: IncidentStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  mapColor: string;
} {
  switch (status) {
    case 'New':
      return {
        bg: 'bg-red-50 dark:bg-red-950/50',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        dot: 'bg-red-600',
        mapColor: '#DC2626',
      };
    case 'Crew assigned':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-600',
        mapColor: '#D97706',
      };
    case 'On site':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/50',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-600',
        mapColor: '#2563EB',
      };
    case 'Repairing':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/50',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        dot: 'bg-orange-600',
        mapColor: '#EA580C',
      };
    case 'Restored':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-600',
        mapColor: '#16A34A',
      };
  }
}

export function getPriorityTextClass(priority: IncidentPriority): string {
  switch (priority) {
    case 'High':
      return 'text-red-700 dark:text-red-400 font-semibold';
    case 'Medium':
      return 'text-amber-700 dark:text-amber-400 font-semibold';
    case 'Low':
      return 'text-slate-600 dark:text-slate-400 font-medium';
  }
}

export function getCustomerStepIndex(status: IncidentStatus): number {
  switch (status) {
    case 'New':
      return 0;
    case 'Crew assigned':
    case 'On site':
      return 1;
    case 'Repairing':
      return 2;
    case 'Restored':
      return 3;
  }
}
