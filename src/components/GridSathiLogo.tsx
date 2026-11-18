import React from 'react';

interface GridSathiLogoProps {
  size?: 'sm' | 'lg';
}

export const GridSathiLogo: React.FC<GridSathiLogoProps> = ({ size = 'lg' }) => {
  const dimensions =
    size === 'lg' ? 'w-28 h-28 rounded-3xl' : 'w-9 h-9 rounded-lg';
  const iconSize = size === 'lg' ? 'w-16 h-16' : 'w-5 h-5';

  return (
    <div
      className={`${dimensions} bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-800 dark:border-slate-700 shrink-0`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={iconSize}
      >
        {/* Subtle grid ring */}
        <circle cx="24" cy="24" r="18" stroke="#334155" strokeWidth="2" />
        {/* Grid connection nodes */}
        <circle cx="24" cy="6" r="2.5" fill="#10B981" />
        <circle cx="42" cy="24" r="2.5" fill="#FF9900" />
        <circle cx="6" cy="24" r="2.5" fill="#38BDF8" />
        {/* Crisp central power bolt */}
        <path
          d="M26.5 11L15 26H23.5L21.5 37L33 22H24.5L26.5 11Z"
          fill="#FF9900"
          stroke="#FF9900"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
