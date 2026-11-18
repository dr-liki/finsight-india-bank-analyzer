import React from 'react';

export default function FinSightLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" className="shrink-0 shadow-md rounded-xl">
      <defs>
        <linearGradient id="fsBg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="55%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="fsEm" x1="96" y1="96" x2="416" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#fsBg)" stroke="#10b981" strokeWidth="14" strokeOpacity="0.45" />
      <circle cx="256" cy="256" r="176" stroke="#1e293b" strokeWidth="16" />
      <path d="M256 80 A176 176 0 0 1 432 256" stroke="url(#fsEm)" strokeWidth="18" strokeLinecap="round" />
      <rect x="148" y="284" width="38" height="84" rx="12" fill="#0ea5e9" fillOpacity="0.85" />
      <rect x="206" y="232" width="38" height="136" rx="12" fill="#10b981" fillOpacity="0.9" />
      <rect x="264" y="176" width="38" height="192" rx="12" fill="url(#fsEm)" />
      <path
        d="M172 146 H344 M172 192 H324 M254 146 C288 146 308 164 308 192 C308 222 284 242 242 242 H196 L316 368"
        stroke="#f8fafc"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="348" cy="146" r="18" fill="#34d399" />
    </svg>
  );
}
