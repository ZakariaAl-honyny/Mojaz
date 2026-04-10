import React from 'react';

interface CategoryFIconProps {
  size?: number;
  color?: string;
  className?: string;
  title?: string;
  titleId?: string;
  'aria-label'?: string;
}

export const CategoryFIcon: React.FC<CategoryFIconProps> = ({ 
  size = 24, 
  color = '#006C35', 
  className = '', 
  title = 'Category F - Agricultural Vehicle', 
  titleId, 
  'aria-label': ariaLabel = title 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-labelledby={titleId}
      aria-label={ariaLabel}
    >
      <title id={titleId}>{title}</title>
      {/* Agricultural Vehicle Icon - Category F */}
      {/* Main tractor body */}
      <path d="M4 10H2V12H4V14H6V16H8V18H6V20H4V22H6V24H8V22H10V20H12V18H10V16H8V14H6V12H4V10Z" fill={color}/>
      {/* Tractor wheels */}
      <circle cx="6" cy="22" r="2" fill={color}/>
      <circle cx="18" cy="22" r="2" fill={color}/>
      {/* Tractor cabin */}
      <rect x="10" y="14" width="8" height="8" fill={color}/>
      {/* Steering wheel */}
      <circle cx="14" cy="18" r="1.5" fill="white"/>
      {/* Exhaust pipe */}
      <rect x="4" y="8" width="2" height="4" fill={color}/>
      {/* Agricultural attachment (plow) */}
      <path d="M8 20H4L2 22H4L8 20Z" fill={color}/>
      {/* Sun in background (agricultural symbol) */}
      <circle cx="20" cy="4" r="3" fill="#FFD700" opacity="0.8"/>
      {/* Sun rays */}
      <path d="M20 1V3" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
      <path d="M20 21V23" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
      <path d="M1 20H3" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
      <path d="M21 20H23" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
      <path d="M14.34 14.34L12.17 12.17" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
      <path d="M25.86 25.86L23.69 23.69" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
      <path d="M14.34 25.86L12.17 23.69" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
      <path d="M25.86 14.34L23.69 12.17" stroke="#FFD700" strokeWidth="1.5" opacity="0.8"/>
    </svg>
  );
};