import React, { useState } from 'react';
import { LUBIRI_CIRCUIT_DETAILS, CLUB_INFO } from '../data/cyclingData';
import { MapPin, Navigation, Flag, Award, AlertCircle, Phone, Sparkles, Layers, Info } from 'lucide-react';

interface LubiriCircuitInteractiveProps {
  onSelectCategory?: (categoryName: string) => void;
}

export const LubiriCircuitInteractive: React.FC<LubiriCircuitInteractiveProps> = ({
  onSelectCategory,
}) => {
  const [activeCheckpoint, setActiveCheckpoint] = useState<number>(0);
  const [selectedLaps, setSelectedLaps] = useState<number>(30);

  const calculatedDistance = (selectedLaps * LUBIRI_CIRCUIT_DETAILS.lapLengthKm).toFixed(1);
  const calculatedElevation = selectedLaps * LUBIRI_CIRCUIT_DETAILS.elevationPerLapM;

  const checkpointCoords = [
    { x: 260, y: 70, name: 'Start / Finish Arch', label: '0.0 KM' },
    { x: 440, y: 190, name: 'Feed & Mechanical Zone', label: '1.2 KM' },
    { x: 380, y: 350, name: 'Mengo Hill False Flat', label: '2.1 KM' },
    { x: 140, y: 320, name: 'Palace Wall Corner 3', label: '2.8 KM' },
    { x: 120, y: 150, name: '400m Sprint Straight', label: '3.1 KM' },
  ];

  return (
    <div id="circuit" className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-8 lg:p-10 text-zinc-100 shadow-2xl relative overflow-hidden">
      {/* Background road texture glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider font-heading mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>Official Race Course Technical Map</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Lubiri Ring Road Closed Circuit
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Circumnavigating the historic walls of Kabaka’s Palace in Mengo. A high-speed 3.5 km loop with dedicated safety barriers and police escort.
          </p>
        </div>

        {/* Quick Quick Category Lap Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { laps: 30, cat: 'Elite (105 km)' },
            { laps: 15, cat: 'Armed Forces (52.5 km)' },
            { laps: 6, cat: 'Schools/Youth (21 km)' },
            { laps: 2, cat: 'Family & Fans (7 km)' },
          ].map((preset) => (
            <button
              key={preset.laps}
              onClick={() => {
                setSelectedLaps(preset.laps);
                if (onSelectCategory) onSelectCategory(preset.cat.split(' (')[0]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedLaps === preset.laps
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {preset.cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Circuit Map & Technical Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Custom SVG Interactive Circuit Map */}
        <div className="lg:col-span-7 bg-zinc-950 p-4 sm:p-6 rounded-2xl border border-zinc-800/90 relative">
          {/* Circuit Map Legend */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 border-b border-zinc-900 pb-2">
            <span className="flex items-center gap-1.5 font-medium text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse"></span>
              Click any checkpoint on the circuit to inspect
            </span>
            <span className="text-[11px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 font-mono">
              3.5 KM LOOP
            </span>
          </div>

          <div className="relative w-full aspect-[16/11] flex items-center justify-center">
            <svg
              viewBox="0 0 520 420"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="circuitRoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="40%" stopColor="#10B981" />
                  <stop offset="80%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <pattern id="roadHash" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 0 10 L 20 10" stroke="#3F3F46" strokeWidth="1" strokeDasharray="3,3" />
                </pattern>
              </defs>

              {/* Palace Grounds Center fill */}
              <ellipse
                cx="270"
                cy="220"
                rx="140"
                ry="100"
                fill="#18181B"
                stroke="#27272A"
                strokeWidth="2"
              />
              <text
                x="270"
                y="205"
                textAnchor="middle"
                fill="#A1A1AA"
                fontSize="12"
                fontWeight="700"
                fontFamily="'Chakra Petch', sans-serif"
                letterSpacing="1"
              >
                KABAKA'S ROYAL PALACE
              </text>
              <text
                x="270"
                y="225"
                textAnchor="middle"
                fill="#71717A"
                fontSize="10"
              >
                Mengo Lubiri Perimeter Grounds
              </text>
              <text
                x="270"
                y="245"
                textAnchor="middle"
                fill="#F59E0B"
                fontSize="11"
                fontWeight="600"
              >
                100% Traffic Closed Circuit
              </text>

              {/* Road Asphalt Underlay */}
              <path
                d="M 260 70 C 370 65, 455 120, 450 200 C 445 285, 385 365, 270 365 C 165 365, 95 300, 95 210 C 95 130, 160 75, 260 70 Z"
                stroke="#27272A"
                strokeWidth="26"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Circuit Active Road Line */}
              <path
                d="M 260 70 C 370 65, 455 120, 450 200 C 445 285, 385 365, 270 365 C 165 365, 95 300, 95 210 C 95 130, 160 75, 260 70 Z"
                stroke="url(#circuitRoadGrad)"
                strokeWidth="8"
                strokeDasharray="12,4"
                className="motion-safe:animate-pulse"
              />

              {/* Directional Flow Arrows */}
              <g fill="#F59E0B" opacity="0.8">
                <path d="M 350 78 L 365 72 L 350 66 Z" />
                <path d="M 444 260 L 442 276 L 433 263 Z" />
                <path d="M 200 360 L 184 366 L 200 372 Z" />
                <path d="M 100 150 L 102 134 L 111 147 Z" />
              </g>

              {/* Checkpoint nodes */}
              {checkpointCoords.map((cp, idx) => {
                const isActive = activeCheckpoint === idx;
                return (
                  <g
                    key={idx}
                    transform={`translate(${cp.x}, ${cp.y})`}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setActiveCheckpoint(idx)}
                  >
                    <circle
                      r={isActive ? '16' : '11'}
                      fill={isActive ? '#F59E0B' : '#18181B'}
                      stroke={isActive ? '#FFFFFF' : '#F59E0B'}
                      strokeWidth={isActive ? '3' : '2'}
                      className="transition-all"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={isActive ? '#000000' : '#FFFFFF'}
                      fontSize="9"
                      fontWeight="800"
                    >
                      {idx + 1}
                    </text>
                    {/* Floating label */}
                    <rect
                      x="-35"
                      y="-28"
                      width="70"
                      height="18"
                      rx="4"
                      fill="#09090B"
                      stroke="#3F3F46"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-16"
                      textAnchor="middle"
                      fill="#E4E4E7"
                      fontSize="9"
                      fontWeight="600"
                    >
                      {cp.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Checkpoint Detail Bar */}
          <div className="mt-4 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-black font-extrabold flex items-center justify-center font-heading text-sm flex-shrink-0">
              {activeCheckpoint + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-white font-heading">
                  {LUBIRI_CIRCUIT_DETAILS.checkpoints[activeCheckpoint]?.name}
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-semibold">
                  Checkpoint {activeCheckpoint + 1} of 5
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {LUBIRI_CIRCUIT_DETAILS.checkpoints[activeCheckpoint]?.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Technical Stats, Lap Calculator & Safety Logistics */}
        <div className="lg:col-span-5 space-y-5">
          {/* Interactive Lap & Telemetry Calculator */}
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Race Distance & Lap Calculator</span>
              </div>
              <span className="text-xs text-zinc-400">3.5 km / lap</span>
            </div>

            {/* Slider control */}
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1.5 font-mono">
                <span>Selected Laps: <strong className="text-amber-400 text-sm">{selectedLaps} Laps</strong></span>
                <span>Max: 30 Laps</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={selectedLaps}
                onChange={(e) => setSelectedLaps(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer bg-zinc-800 h-2 rounded-lg"
              />
            </div>

            {/* Calculated Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[11px] text-zinc-400 uppercase font-medium">Total Race Distance</div>
                <div className="text-2xl font-black text-amber-400 font-heading">
                  {calculatedDistance} <span className="text-xs font-normal text-zinc-400">KM</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  {selectedLaps === 30 ? 'Full Elite Marquee' : `${selectedLaps} x 3.5 km circuit`}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[11px] text-zinc-400 uppercase font-medium">Elevation Climb</div>
                <div className="text-2xl font-black text-emerald-400 font-heading">
                  +{calculatedElevation} <span className="text-xs font-normal text-zinc-400">M</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  Mengo Hill punchy grade
                </div>
              </div>
            </div>
          </div>

          {/* Key Circuit Highlights */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-white font-bold font-heading text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Safety, Medical & Spectator Amenities</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span><strong>Closed High-Speed Circuit:</strong> Zero vehicular traffic, secured in partnership with traffic authorities and Katwe division police.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span><strong>Emergency Evacuation:</strong> Dedicated Red Cross & ambulance standby at Start/Finish Gate and Corner 3.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span><strong>Spectator Areas:</strong> Safe viewing plazas with refreshments and music at BMK House spectator grandstand.</span>
              </li>
            </ul>

            {/* Direct hotline */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400">Race Marshals Contact:</span>
              <a
                href={`tel:${CLUB_INFO.primaryPhone}`}
                className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                {CLUB_INFO.primaryPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
