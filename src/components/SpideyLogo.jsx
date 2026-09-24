import React from 'react';

export default function SpideyLogo({ size = 26, className = '' }) {
  return (
    <span
      className={`spidey-brand-mark ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="28"
          height="28"
          rx="7"
          fill="#131720"
          stroke="#22c55e"
          strokeWidth="1.2"
          strokeOpacity="0.45"
        />
        {/* Cyber Spider Body */}
        <path
          d="M14 6.5C12.7 6.5 11.6 7.4 11.6 8.7C11.6 9.5 12 10.2 12.7 10.7C11.8 11.5 11.2 12.6 11.2 14C11.2 16.1 12.4 17.5 14 17.5C15.6 17.5 16.8 16.1 16.8 14C16.8 12.6 16.2 11.5 15.3 10.7C16 10.2 16.4 9.5 16.4 8.7C16.4 7.4 15.3 6.5 14 6.5Z"
          fill="#22c55e"
        />
        {/* Left Legs */}
        <path
          d="M11.5 9.5L7.5 8M11.2 12L6.5 11.5M11.4 14.5L7 15.8M12.2 16.5L8.8 19.5"
          stroke="#22c55e"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Legs */}
        <path
          d="M16.5 9.5L20.5 8M16.8 12L21.5 11.5M16.6 14.5L21 15.8M15.8 16.5L19.2 19.5"
          stroke="#22c55e"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Spider Eyes */}
        <circle cx="13" cy="8.4" r="0.7" fill="#0d1117" />
        <circle cx="15" cy="8.4" r="0.7" fill="#0d1117" />
      </svg>
    </span>
  );
}
