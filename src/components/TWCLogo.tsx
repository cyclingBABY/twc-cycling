import React from 'react';

interface TWCLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const TWCLogo: React.FC<TWCLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const dimensions = {
    sm: { w: 38, h: 38, textSize: 'text-xs', subSize: 'text-[9px]' },
    md: { w: 48, h: 48, textSize: 'text-sm', subSize: 'text-[10px]' },
    lg: { w: 72, h: 72, textSize: 'text-lg', subSize: 'text-xs' },
    xl: { w: 110, h: 110, textSize: 'text-2xl', subSize: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Authentic TWC Cycling Emblem recreated with SVG */}
      <div
        className="relative flex-shrink-0"
        style={{ width: dimensions.w, height: dimensions.h }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="twcSunburst" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="45%" stopColor="#FFA000" />
              <stop offset="85%" stopColor="#E65100" />
              <stop offset="100%" stopColor="#BF360C" />
            </radialGradient>
            <linearGradient id="twcGoldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FF6F00" />
            </linearGradient>
            <linearGradient id="gearMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4E342E" />
              <stop offset="100%" stopColor="#1A0D08" />
            </linearGradient>
          </defs>

          {/* Outer Bike Cogwheel Gear Teeth */}
          <g transform="translate(100, 100)">
            {Array.from({ length: 18 }).map((_, i) => {
              const angle = (i * 360) / 18;
              return (
                <rect
                  key={i}
                  x="-7"
                  y="-94"
                  width="14"
                  height="16"
                  rx="2"
                  fill="#3E2723"
                  transform={`rotate(${angle})`}
                />
              );
            })}
            <circle r="84" fill="#4E342E" stroke="#FFB300" strokeWidth="4" />
            <circle r="76" fill="url(#twcSunburst)" stroke="#3E2723" strokeWidth="4" />

            {/* Inner Mountain Silhouettes */}
            <path
              d="M-74 35 L-40 -5 L-10 20 L25 -18 L74 38 L74 74 L-74 74 Z"
              fill="#2E1B14"
            />
            <path
              d="M-55 45 L-20 18 L15 35 L50 8 L72 45 L72 74 L-55 74 Z"
              fill="#1A0D08"
            />

            {/* Cyclist Silhouette jumping/pedaling over terrain */}
            <g transform="translate(-5, -5) scale(0.9)">
              {/* Rear wheel */}
              <circle cx="-26" cy="18" r="14" stroke="#120A06" strokeWidth="4" fill="none" />
              <circle cx="-26" cy="18" r="3" fill="#FFB300" />
              {/* Front wheel elevated */}
              <circle cx="28" cy="-8" r="14" stroke="#120A06" strokeWidth="4" fill="none" />
              <circle cx="28" cy="-8" r="3" fill="#FFB300" />
              {/* Bike frame */}
              <path
                d="M-26 18 L-5 18 L-14 -2 L-26 18 M-5 18 L16 -6 L7 -7 M-14 -2 L7 -7 L28 -8"
                stroke="#120A06"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Handlebars */}
              <path d="M22 -14 L29 -12" stroke="#120A06" strokeWidth="4.5" strokeLinecap="round" />
              {/* Rider Body */}
              <circle cx="3" cy="-28" r="7.5" fill="#120A06" />
              {/* Helmet visor */}
              <path d="M1 -33 L13 -29" stroke="#120A06" strokeWidth="3" strokeLinecap="round" />
              {/* Torso & Arms */}
              <path
                d="M2 -22 L-10 -7 L10 -4 L25 -13"
                stroke="#120A06"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Legs & Pedals */}
              <path
                d="M-10 -7 L-4 5 L-5 18"
                stroke="#120A06"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Ribbon Banner for "TOGETHER WE CAN CYCLING UG LTD" */}
          <g transform="translate(100, 160)">
            {/* Banner shape */}
            <path
              d="M-92 -18 L-80 -25 L80 -25 L92 -18 L86 10 L-86 10 Z"
              fill="#2E1B14"
              stroke="#FFB300"
              strokeWidth="2.5"
            />
            {/* Ribbon notch tails */}
            <path d="M-92 -18 L-98 -8 L-86 10" fill="#1A0D08" />
            <path d="M92 -18 L98 -8 L86 10" fill="#1A0D08" />

            {/* Banner Typography */}
            <text
              x="0"
              y="-7"
              textAnchor="middle"
              fill="#FFD54F"
              fontFamily="'Chakra Petch', sans-serif"
              fontWeight="800"
              fontSize="12.5"
              letterSpacing="0.8"
            >
              TOGETHER WE CAN CYCLING
            </text>
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#FFF8E1"
              fontFamily="'Chakra Petch', sans-serif"
              fontWeight="700"
              fontSize="8"
              letterSpacing="1.8"
            >
              UG LTD
            </text>
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold tracking-tight text-white ${dimensions.textSize} font-heading leading-tight`}>
            TOGETHER WE CAN
          </span>
          <span className={`font-semibold tracking-wider text-amber-400 ${dimensions.subSize} uppercase flex items-center gap-1.5`}>
            <span>Cycling Academy</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block"></span>
            <span className="text-zinc-400 font-normal">Uganda</span>
          </span>
        </div>
      )}
    </div>
  );
};
