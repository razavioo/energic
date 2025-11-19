import React, { useState, useEffect, useRef } from 'react';

// --- Constants & Configuration ---
const CONFIG = {
  silo: {
    x: 120,
    y: 60,
    width: 260,
    cylinderHeight: 320,
    coneHeight: 100,
    outletWidth: 60,
  },
  levels: {
    maxLevelOffset: 20,    // 100% line
    emptyLevelOffset: 380, // 0% line
  },
  colors: {
    siloStroke: '#2d3748',
    siloFill: 'url(#siloGradient)',
    materialFill: 'url(#materialGradient)',
    sensorTape: '#4a5568',
    sensorWeight: '#e53e3e',
  },
  animation: {
    waveSpeed: 0.08,
  }
};

export default function ProfessionalSiloMonitor() {
  // --- State ---
  const [level, setLevel] = useState(66.9);
  const [targetLevel, setTargetLevel] = useState(66.9);
  const [isFilling, setIsFilling] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);
  
  const requestRef = useRef();
  const previousTimeRef = useRef();

  // --- Animation Loop ---
  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      setWaveOffset(prev => (prev + CONFIG.animation.waveSpeed) % (Math.PI * 2));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // --- Level Smoothing Logic ---
  useEffect(() => {
    if (Math.abs(level - targetLevel) < 0.1) {
      setIsFilling(false);
      return;
    }
    
    const diff = targetLevel - level;
    const step = Math.abs(diff) < 0.5 ? diff : diff * 0.1; 
    
    setIsFilling(true);
    const timer = requestAnimationFrame(() => {
      setLevel(prev => prev + step);
    });

    return () => cancelAnimationFrame(timer);
  }, [level, targetLevel]);

  // --- Calculations ---
  const topY = CONFIG.silo.y + CONFIG.levels.maxLevelOffset;
  const bottomY = CONFIG.silo.y + CONFIG.levels.emptyLevelOffset;
  const range = bottomY - topY;
  const currentSurfaceY = bottomY - ((level / 100) * range);

  // Surface Curve
  const curveDepth = isFilling ? -12 : 6; 
  const waveY = Math.sin(waveOffset) * 2.5;

  // Silo Path Definition (Used for both Clip and Stroke to ensure perfect match)
  const siloPathDefinition = `
    M ${CONFIG.silo.x} ${CONFIG.silo.y} 
    L ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y} 
    L ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight} 
    L ${CONFIG.silo.x + CONFIG.silo.width/2 + CONFIG.silo.outletWidth/2} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight} 
    L ${CONFIG.silo.x + CONFIG.silo.width/2 - CONFIG.silo.outletWidth/2} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight} 
    L ${CONFIG.silo.x} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight} 
    Z
  `;

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans flex flex-col items-center justify-center select-none">
      
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 border border-gray-200">
        
        {/* --- LEFT: Visualization (SVG) --- */}
        <div className="lg:col-span-7 relative flex justify-center items-center bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-100 min-h-[500px]">
          
          <svg width="500" height="600" viewBox="0 0 500 600" className="overflow-visible">
            <defs>
              <linearGradient id="siloGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f7fafc" />
                <stop offset="15%" stopColor="#edf2f7" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="85%" stopColor="#edf2f7" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>

              <linearGradient id="materialGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#90cdf4" />
                <stop offset="100%" stopColor="#63b3ed" />
              </linearGradient>

              {/* Clip Path based on the exact silo shape */}
              <clipPath id="siloInteriorClip">
                <path d={siloPathDefinition} />
              </clipPath>

              <filter id="compShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* --- LAYER 1: Background & Material (Behind the stroke) --- */}
            
            {/* Silo Background Fill */}
            <path d={siloPathDefinition} fill="url(#siloGradient)" />

            {/* Material Fill (Clipped) */}
            <g clipPath="url(#siloInteriorClip)">
              <path 
                d={`
                  M ${CONFIG.silo.x} ${currentSurfaceY}
                  Q ${CONFIG.silo.x + CONFIG.silo.width/2} ${currentSurfaceY + curveDepth + waveY} ${CONFIG.silo.x + CONFIG.silo.width} ${currentSurfaceY}
                  L ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight + 50}
                  L ${CONFIG.silo.x} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight + 50}
                  Z
                `}
                fill="url(#materialGradient)"
                stroke="none"
              />
              {/* Surface Line */}
              <path 
                d={`M ${CONFIG.silo.x} ${currentSurfaceY} Q ${CONFIG.silo.x + CONFIG.silo.width/2} ${currentSurfaceY + curveDepth + waveY} ${CONFIG.silo.x + CONFIG.silo.width} ${currentSurfaceY}`}
                fill="none"
                stroke="#3182ce"
                strokeWidth="2"
                opacity="0.8"
              />
            </g>

            {/* --- LAYER 2: Silo Structure (Stroke on TOP to hide jagged edges) --- */}
            <path 
              d={siloPathDefinition}
              fill="none"
              stroke={CONFIG.colors.siloStroke}
              strokeWidth="3" 
            />
            
            {/* Roof (Separate to sit on top) */}
            <path 
              d={`M ${CONFIG.silo.x} ${CONFIG.silo.y} Q ${CONFIG.silo.x + CONFIG.silo.width/2} ${CONFIG.silo.y - 25} ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y}`}
              fill="#e2e8f0"
              stroke={CONFIG.colors.siloStroke}
              strokeWidth="2"
            />

            {/* --- LAYER 3: Sensors & Details --- */}
            
            {/* LF20 (Yo-Yo) */}
            <g transform={`translate(${CONFIG.silo.x + 180}, ${CONFIG.silo.y - 35})`}>
              <rect x="-12" y="20" width="24" height="15" fill="#cbd5e0" stroke="#4a5568" />
              <rect x="-25" y="-15" width="50" height="35" rx="2" fill="#718096" stroke="#2d3748" strokeWidth="2" filter="url(#compShadow)" />
              <text x="0" y="5" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" fontFamily="Arial">LF20</text>
              
              <line 
                x1="0" y1="20" 
                x2="0" y2={currentSurfaceY - (CONFIG.silo.y - 35)} 
                stroke={CONFIG.colors.sensorTape} 
                strokeWidth="1.5" 
                strokeDasharray="3,2"
              />
              
              <g transform={`translate(0, ${currentSurfaceY - (CONFIG.silo.y - 35)})`}>
                <rect x="-6" y="-12" width="12" height="12" fill={CONFIG.colors.sensorWeight} stroke="#9b2c2c" strokeWidth="1" />
                <line x1="6" y1="-6" x2="150" y2="-6" stroke="#e53e3e" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
              </g>
            </g>

            {/* DF23 */}
            <g transform={`translate(${CONFIG.silo.x + CONFIG.silo.width}, ${CONFIG.silo.y + 80})`}>
               <rect x="0" y="-12" width="25" height="24" rx="2" fill="#a0aec0" stroke="#4a5568" strokeWidth="2" filter="url(#compShadow)" />
               <text x="30" y="4" fontSize="11" fontWeight="bold" fill="#4a5568">DF23</text>
               <circle cx="12" cy="0" r="3" fill={level > 85 ? "#fc8181" : "#cbd5e0"} stroke="#718096" />
            </g>

            {/* Filling Pipe */}
            <g transform={`translate(${CONFIG.silo.x + 40}, ${CONFIG.silo.y - 50})`}>
              <rect x="0" y="0" width="18" height="60" fill="#e2e8f0" stroke="#718096" strokeWidth="1.5" />
              <text x="-5" y="30" textAnchor="end" fontSize="10" fill="#718096">Filling pipe</text>
            </g>

            {/* Markers */}
            <line x1={CONFIG.silo.x} y1={topY} x2={CONFIG.silo.x + CONFIG.silo.width} y2={topY} stroke="#e53e3e" strokeWidth="1" strokeDasharray="4,2" />
            <text x={CONFIG.silo.x + 5} y={topY - 5} fontSize="10" fill="#e53e3e">Maximum level</text>

            <line x1={CONFIG.silo.x + 60} y1={bottomY} x2={CONFIG.silo.x + CONFIG.silo.width + 40} y2={bottomY} stroke="#e53e3e" strokeWidth="1" />
            <text x={CONFIG.silo.x + CONFIG.silo.width + 45} y={bottomY + 3} fontSize="11" fill="#e53e3e" fontWeight="bold">Empty</text>

            <g transform={`translate(${CONFIG.silo.x + CONFIG.silo.width/2 - 20}, ${CONFIG.silo.y})`}>
               <line x1="0" y1={CONFIG.levels.maxLevelOffset} x2="0" y2={CONFIG.levels.emptyLevelOffset} stroke="#2d3748" strokeWidth="1" />
               <path d={`M 0 ${CONFIG.levels.maxLevelOffset} L -3 ${CONFIG.levels.maxLevelOffset + 6} L 3 ${CONFIG.levels.maxLevelOffset + 6} Z`} fill="#2d3748" />
               <path d={`M 0 ${CONFIG.levels.emptyLevelOffset} L -3 ${CONFIG.levels.emptyLevelOffset - 6} L 3 ${CONFIG.levels.emptyLevelOffset - 6} Z`} fill="#2d3748" />
               <text x="-8" y={(CONFIG.levels.maxLevelOffset + CONFIG.levels.emptyLevelOffset)/2} textAnchor="end" fontSize="11" fill="#4a5568" style={{writingMode: "vertical-rl", textOrientation: "mixed"}}>Measuring range</text>
            </g>

          </svg>
        </div>

        {/* --- RIGHT: Controls & Indicators --- */}
        <div className="lg:col-span-5 flex flex-col justify-between py-4">
          
          {/* 1. ANALOG BAR GRAPH */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="flex gap-3 h-[350px] w-full max-w-[200px]">
              <div className="flex flex-col justify-between text-xs font-bold text-gray-500 py-1 text-right w-12">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              
              <div className="relative flex-1 bg-gray-900 border-2 border-gray-800 shadow-inner">
                <div 
                  className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ height: `${level}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                  <div className="absolute top-0 w-full h-[1px] bg-blue-300"></div>
                </div>
                {[25, 50, 75].map(tick => (
                  <div key={tick} className="absolute w-full border-t border-gray-600 opacity-50" style={{ bottom: `${tick}%` }}></div>
                ))}
              </div>

              <div className="relative w-6">
                 <div 
                   className="absolute left-0 transition-all duration-300 ease-out"
                   style={{ bottom: `${level}%`, transform: 'translateY(50%)' }}
                 >
                   <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-red-600 border-b-[6px] border-b-transparent filter drop-shadow-sm"></div>
                 </div>
              </div>
            </div>
          </div>

          {/* 2. DIGITAL INDICATOR (Redesigned Layout) */}
          <div className="mb-8 flex justify-center">
            <div className="bg-gray-200 p-1 rounded shadow-lg border border-gray-400 w-72">
              <div className="bg-[#e0e0e0] border border-gray-400 rounded-sm p-3 relative flex flex-col gap-2">
                
                {/* Header: Label + Mini Silo Indicator */}
                <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <span className="text-[10px] font-bold text-gray-600">Silo 1</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-600">%</span>
                    
                    {/* Mini Silo Icon */}
                    <div className="relative w-3 h-4 border border-gray-600 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                      <div 
                        className="absolute bottom-0 w-full bg-black transition-all duration-300"
                        style={{ height: `${level}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Main Body: Screen + Buttons Side-by-Side */}
                <div className="flex gap-2 h-16">
                  {/* Screen (Left) */}
                  <div className="flex-1 bg-black rounded-sm border-2 border-gray-500 shadow-inner flex items-center justify-center relative overflow-hidden">
                    <span 
                      className="text-3xl font-mono text-amber-500 tracking-widest z-10"
                      style={{ 
                        textShadow: '0 0 5px #f6ad55, 0 0 10px #ed8936',
                        fontFamily: '"Courier New", Courier, monospace'
                      }}
                    >
                      {level.toFixed(1)}
                    </span>
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent opacity-10"></div>
                  </div>

                  {/* Buttons (Right) - Vertical Stack */}
                  <div className="w-8 flex flex-col justify-between py-0.5">
                    <div className="w-full h-4 bg-gray-700 rounded-sm shadow flex items-center justify-center cursor-pointer hover:bg-gray-600 active:translate-y-px">
                      <svg width="6" height="4" viewBox="0 0 10 6"><path d="M5 0L10 6H0L5 0Z" fill="white"/></svg>
                    </div>
                    <div className="w-full h-4 bg-gray-700 rounded-sm shadow flex items-center justify-center cursor-pointer hover:bg-gray-600 active:translate-y-px">
                      <span className="text-[5px] text-white font-bold">SET</span>
                    </div>
                    <div className="w-full h-4 bg-gray-700 rounded-sm shadow flex items-center justify-center cursor-pointer hover:bg-gray-600 active:translate-y-px">
                      <svg width="6" height="4" viewBox="0 0 10 6"><path d="M5 6L0 0H10L5 6Z" fill="white"/></svg>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end pt-1">
                  <span className="font-black text-gray-500 text-xs italic">ENDA</span>
                  <span className="text-[8px] text-gray-400 font-semibold">EI141</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. SIMULATION CONTROLS */}
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Set Level</label>
              <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-300 text-blue-600">
                {targetLevel.toFixed(1)}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.1"
              value={targetLevel}
              onChange={(e) => setTargetLevel(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4"
            />
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setTargetLevel(100)}
                className="py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
              >
                FILL (100%)
              </button>
              <button 
                onClick={() => setTargetLevel(0)}
                className="py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm"
              >
                EMPTY (0%)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}