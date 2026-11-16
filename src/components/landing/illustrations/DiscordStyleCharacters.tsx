'use client';

import React from 'react';

export const DiscordStyleMascot: React.FC<{ size?: number; className?: string }> = ({
  size = 220,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={`select-none filter drop-shadow-[0_20px_35px_rgba(88,101,242,0.45)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blurpleGrad" x1="40" y1="20" x2="200" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7983F5" />
          <stop offset="50%" stopColor="#5865F2" />
          <stop offset="100%" stopColor="#4752C4" />
        </linearGradient>
        <linearGradient id="hoodieYellow" x1="60" y1="120" x2="180" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEE75C" />
          <stop offset="100%" stopColor="#F0B232" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="120" cy="225" rx="70" ry="10" fill="#000000" opacity="0.3" />

      {/* Left Ear / Horn */}
      <path
        d="M 68 85 C 50 45 65 20 85 30 C 95 35 90 60 82 82 Z"
        fill="#5865F2"
      />
      <path d="M 72 75 C 62 50 72 35 80 40" stroke="#7983F5" strokeWidth="4" strokeLinecap="round" />

      {/* Right Ear / Horn */}
      <path
        d="M 172 85 C 190 45 175 20 155 30 C 145 35 150 60 158 82 Z"
        fill="#4752C4"
      />

      {/* Little Sprout / Antenna on Head */}
      <path d="M 120 45 Q 128 20 142 22 Q 138 35 124 45 Z" fill="#57F287" />
      <circle cx="142" cy="22" r="3" fill="#FFFFFF" />

      {/* Main Round Head Body */}
      <rect
        x="50"
        y="45"
        width="140"
        height="125"
        rx="56"
        fill="url(#blurpleGrad)"
      />

      {/* Head Highlight */}
      <path
        d="M 75 62 C 95 52 145 52 165 62"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Cheeks */}
      <ellipse cx="78" cy="122" rx="10" ry="6" fill="#EB459E" opacity="0.75" />
      <ellipse cx="162" cy="122" rx="10" ry="6" fill="#EB459E" opacity="0.75" />

      {/* Big Expressive Cartoon Eyes */}
      {/* Left Eye */}
      <g>
        <ellipse cx="92" cy="102" rx="14" ry="18" fill="#FFFFFF" />
        <ellipse cx="94" cy="102" rx="9" ry="12" fill="#23272A" />
        <circle cx="91" cy="96" r="4" fill="#FFFFFF" />
        <circle cx="98" cy="106" r="2" fill="#FFFFFF" />
      </g>

      {/* Right Eye */}
      <g>
        <ellipse cx="148" cy="102" rx="14" ry="18" fill="#FFFFFF" />
        <ellipse cx="146" cy="102" rx="9" ry="12" fill="#23272A" />
        <circle cx="143" cy="96" r="4" fill="#FFFFFF" />
        <circle cx="150" cy="106" r="2" fill="#FFFFFF" />
      </g>

      {/* Happy Open Curved Mouth */}
      <path
        d="M 110 118 Q 120 134 130 118 Z"
        fill="#23272A"
      />
      {/* Tongue */}
      <path d="M 114 126 Q 120 134 126 126 Z" fill="#EB459E" />

      {/* Yellow Gamer Hoodie / Scarf */}
      <path
        d="M 68 152 C 65 175 75 205 120 205 C 165 205 175 175 172 152 C 160 162 140 168 120 168 C 100 168 80 162 68 152 Z"
        fill="url(#hoodieYellow)"
      />
      {/* Hoodie Drawstrings */}
      <path d="M 108 168 L 106 192" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="106" cy="193" r="2.5" fill="#FFFFFF" />
      <path d="M 132 168 L 134 188" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="134" cy="189" r="2.5" fill="#FFFFFF" />

      {/* Stubby Feet */}
      <ellipse cx="95" cy="215" rx="16" ry="10" fill="#23272A" />
      <ellipse cx="145" cy="215" rx="16" ry="10" fill="#23272A" />
    </svg>
  );
};

export const DiscordStyleRobot: React.FC<{ size?: number; className?: string }> = ({
  size = 200,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`select-none filter drop-shadow-[0_15px_30px_rgba(87,242,135,0.4)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="185" rx="50" ry="8" fill="#000000" opacity="0.3" />

      {/* Antenna */}
      <line x1="100" y1="40" x2="100" y2="18" stroke="#57F287" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="16" r="6" fill="#FEE75C" />

      {/* Floating Ear Pods */}
      <rect x="25" y="70" width="16" height="36" rx="8" fill="#5865F2" />
      <rect x="159" y="70" width="16" height="36" rx="8" fill="#5865F2" />

      {/* Robot Chassis Head */}
      <rect x="36" y="38" width="128" height="100" rx="42" fill="#FFFFFF" stroke="#E3E5E8" strokeWidth="2" />

      {/* Screen Face */}
      <rect x="48" y="52" width="104" height="72" rx="28" fill="#23272A" />

      {/* Glowing Happy Curved Eyes on Screen */}
      <path d="M 68 84 Q 78 70 88 84" stroke="#57F287" strokeWidth="5" strokeLinecap="round" />
      <path d="M 112 84 Q 122 70 132 84" stroke="#57F287" strokeWidth="5" strokeLinecap="round" />

      {/* Little Floating Body Base */}
      <path d="M 80 144 C 80 165 120 165 120 144 Z" fill="#5865F2" />
      <ellipse cx="100" cy="156" rx="6" ry="3" fill="#57F287" />
    </svg>
  );
};
