// src/components/UI/Logo.tsx — Geometric eye + mountain MALAI VIZHI brand mark
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  hideText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'light',
  hideText = false,
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'md' ? 40 : 56;
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl';
  const subSize = size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[11px]' : 'text-xs';
  const textColor = variant === 'light' ? 'text-white' : 'text-[#071A2B]';
  const subColor = variant === 'light' ? 'text-[#2DD4BF]' : 'text-[#0F766E]';

  return (
    <div className="flex items-center gap-3">
      {/* SVG Mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MALAI VIZHI logo mark"
        role="img"
      >
        {/* Mountain silhouette */}
        <path
          d="M6 36 L18 14 L26 24 L32 16 L42 36 Z"
          fill="#0B3948"
          stroke="#14B8A6"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Snow cap */}
        <path
          d="M18 14 L22 21 L14 21 Z"
          fill="#14B8A6"
          opacity="0.7"
        />
        <path
          d="M32 16 L36 22 L28 22 Z"
          fill="#14B8A6"
          opacity="0.5"
        />
        {/* Eye outer ellipse */}
        <ellipse
          cx="24"
          cy="30"
          rx="11"
          ry="6.5"
          stroke="#14B8A6"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Eye iris */}
        <circle
          cx="24"
          cy="30"
          r="3.5"
          fill="#14B8A6"
          opacity="0.9"
        />
        {/* Eye pupil */}
        <circle
          cx="24"
          cy="30"
          r="1.5"
          fill="#071A2B"
        />
        {/* Scan line */}
        <line
          x1="13"
          y1="30"
          x2="8"
          y2="30"
          stroke="#14B8A6"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="35"
          y1="30"
          x2="40"
          y2="30"
          stroke="#14B8A6"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>

      {/* Text mark */}
      {!hideText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-widest uppercase ${textSize} ${textColor}`}>
            MALAI VIZHI
          </span>
          {size !== 'sm' && (
            <span className={`font-medium tracking-wider uppercase mt-0.5 ${subSize} ${subColor}`}>
              AI Landslide Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
