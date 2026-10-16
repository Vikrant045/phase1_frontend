'use client';

import React from 'react';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  trackColor?: string;
  label?: string;
  className?: string;
  inline?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'var(--primary)',
  trackColor = 'rgba(226, 232, 240, 0.8)',
  label,
  className = '',
  inline = false,
}) => {
  const sizeMap = {
    xs: 14,
    sm: 16,
    md: 24,
    lg: 36,
    xl: 48,
  };

  const strokeMap = {
    xs: 2.2,
    sm: 2.5,
    md: 3,
    lg: 3.5,
    xl: 4,
  };

  const dimension = sizeMap[size];
  const strokeWidth = strokeMap[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * 0.3; // 70% visible arc

  const spinnerContent = (
    <svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`spinner-svg ${className}`}
      style={{
        animation: 'spinnerRotate 0.85s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        flexShrink: 0,
      }}
    >
      {/* Background Track Circle */}
      <circle
        cx={dimension / 2}
        cy={dimension / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Spinning Indicator Arc */}
      <circle
        cx={dimension / 2}
        cy={dimension / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );

  if (inline) {
    return spinnerContent;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: label ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: label ? '0.75rem' : '0.5rem',
      }}
    >
      {spinnerContent}
      {label && (
        <span
          style={{
            fontSize: size === 'lg' || size === 'xl' ? '0.875rem' : '0.8rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
