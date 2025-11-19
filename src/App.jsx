import React, { useState, useEffect, useRef } from 'react';

// --- Constants ---
const CONFIG = {
  silo: {
    x: 120, y: 60, width: 260, cylinderHeight: 320, coneHeight: 100, outletWidth: 40,
  },
  levels: {
    maxLevelOffset: 20, emptyLevelOffset: 380,
  },
  colors: {
    siloStroke: '#2d3748',
    siloFill: 'url(#siloGradient)',
    sensorTape: '#4a5568',
    sensorWeight: '#e53e3e',
    text: '#4a5568'
  },
};

export default function UltimateSiloMonitor() {
  // --- 1. User Configuration State ---
  const [liquidColor, setLiquidColor] = useState('#3b82f6');
  const [capacity, setCapacity] = useState(99999);
  const [unit, setUnit] = useState('Liters');
  const [hardness, setHardness] = useState(50);
  
  // --- 2. System State ---
  const [visualLevel, setVisualLevel] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // --- 3. Refs ---
  const targetDataRef = useRef(0);
  const requestRef = useRef();
  const waveOffsetRef = useRef(0);
  const lastDirectionRef = useRef(0); // 1 = Filling, -1 = Emptying

  // --- 4. Data Simulation Engine ---
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        const current = targetDataRef.current;
        let noise = (Math.random() - 0.5) * 4; 
        let next = current + noise;
        next = Math.max(0, Math.min(100, next));
        targetDataRef.current = next;
      }, 10); 
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // --- 5. Animation Loop ---
  const animate = () => {
    waveOffsetRef.current = (waveOffsetRef.current + 0.1) % (Math.PI * 2);

    setVisualLevel(prev => {
      const target = targetDataRef.current;
      const diff = target - prev;
      
      if (Math.abs(diff) > 0.05) {
        lastDirectionRef.current = diff > 0 ? 1 : -1;
      }

      if (Math.abs(diff) < 0.01) return prev;
      return prev + (diff * 0.15);
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // --- Calculations ---
  const topY = CONFIG.silo.y + CONFIG.levels.maxLevelOffset;
  const bottomY = CONFIG.silo.y + CONFIG.levels.emptyLevelOffset;
  const range = bottomY - topY;
  const currentSurfaceY = bottomY - ((visualLevel / 100) * range);
  const currentVolume = (visualLevel / 100) * capacity;

  // --- Physics Logic (Curve) ---
  let curveDepth = 0;
  
  if (isSimulating) {
    curveDepth = 0;
  } else {
    const maxDepth = (hardness / 100) * 25; 
    // REVERSED LOGIC: 
    // Filling (1) -> Positive (Down/Concave)
    // Emptying (-1) -> Negative (Up/Convex)
    curveDepth = lastDirectionRef.current === 1 ? maxDepth : -maxDepth;
  }

  const waveAmplitude = isSimulating ? 0 : (1 - (hardness / 100)) * 3;
  const waveY = Math.sin(waveOffsetRef.current) * waveAmplitude;

  // Silo Path
  const siloPath = `
    M ${CONFIG.silo.x} ${CONFIG.silo.y} 
    L ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y} 
    L ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight} 
    L ${CONFIG.silo.x + CONFIG.silo.width/2 + CONFIG.silo.outletWidth/2} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight} 
    L ${CONFIG.silo.x + CONFIG.silo.width/2 - CONFIG.silo.outletWidth/2} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight} 
    L ${CONFIG.silo.x} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight} 
    Z
  `;

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center justify-center select-none">
      
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 border border-gray-300">
        
        {/* --- LEFT COLUMN: Visualization --- */}
        <div className="lg:col-span-7 relative flex justify-center items-center bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 min-h-[600px]">
          <svg width="500" height="650" viewBox="0 0 500 650" className="overflow-visible">
            <defs>
              <linearGradient id="siloGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f7fafc" />
                <stop offset="15%" stopColor="#edf2f7" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="85%" stopColor="#edf2f7" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>

              <linearGradient id="dynamicLiquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={liquidColor} stopOpacity="0.7" />
                <stop offset="100%" stopColor={liquidColor} stopOpacity="1" />
              </linearGradient>

              <clipPath id="siloClip"><path d={siloPath} /></clipPath>
              <filter id="shadow"><feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.2" /></filter>
            </defs>

            {/* --- SILO DRAWING (Same as before) --- */}
            <path d={siloPath} fill="url(#siloGradient)" />

            <g clipPath="url(#siloClip)">
              <path 
                d={`
                  M ${CONFIG.silo.x} ${currentSurfaceY}
                  Q ${CONFIG.silo.x + CONFIG.silo.width/2} ${currentSurfaceY + curveDepth + waveY} ${CONFIG.silo.x + CONFIG.silo.width} ${currentSurfaceY}
                  L ${CONFIG.silo.x + CONFIG.silo.width} ${700} L ${CONFIG.silo.x} ${700} Z
                `}
                fill="url(#dynamicLiquidGradient)"
              />
              <path 
                d={`M ${CONFIG.silo.x} ${currentSurfaceY} Q ${CONFIG.silo.x + CONFIG.silo.width/2} ${currentSurfaceY + curveDepth + waveY} ${CONFIG.silo.x + CONFIG.silo.width} ${currentSurfaceY}`}
                fill="none" stroke={liquidColor} strokeWidth="3" filter="brightness(0.7)"
              />
            </g>

            <path d={siloPath} fill="none" stroke={CONFIG.colors.siloStroke} strokeWidth="3" />
            <path d={`M ${CONFIG.silo.x} ${CONFIG.silo.y} Q ${CONFIG.silo.x + CONFIG.silo.width/2} ${CONFIG.silo.y - 25} ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y}`} fill="#e2e8f0" stroke={CONFIG.colors.siloStroke} strokeWidth="2" />

            <g transform={`translate(${CONFIG.silo.x + CONFIG.silo.width/2}, ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight})`}>
               <rect x="-20" y="0" width="40" height="10" fill="#cbd5e0" stroke={CONFIG.colors.siloStroke} strokeWidth="2" />
               <path d="M -25 10 L 25 10" stroke={CONFIG.colors.siloStroke} strokeWidth="3" />
            </g>

            <g transform={`translate(${CONFIG.silo.x + 40}, ${CONFIG.silo.y - 50})`}>
              <rect x="0" y="0" width="18" height="60" fill="#e2e8f0" stroke="#718096" strokeWidth="1.5" />
              <rect x="-2" y="0" width="22" height="5" fill="#cbd5e0" stroke="#718096" />
              <text x="-5" y="30" textAnchor="end" fontSize="10" fill="#718096">Filling pipe</text>
            </g>

            <g transform={`translate(${CONFIG.silo.x + 180}, ${CONFIG.silo.y - 35})`}>
              <rect x="-25" y="-15" width="50" height="35" rx="2" fill="#718096" stroke="#2d3748" strokeWidth="2" filter="url(#shadow)" />
              <text x="0" y="5" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">LF20</text>
              <line x1="0" y1="20" x2="0" y2={currentSurfaceY - (CONFIG.silo.y - 35)} stroke={CONFIG.colors.sensorTape} strokeWidth="1.5" strokeDasharray="3,2" />
              <rect x="-6" y={currentSurfaceY - (CONFIG.silo.y - 35) - 12} width="12" height="12" fill={CONFIG.colors.sensorWeight} stroke="#9b2c2c" />
            </g>

            <g transform={`translate(${CONFIG.silo.x + CONFIG.silo.width}, ${CONFIG.silo.y + 80})`}>
               <rect x="0" y="-12" width="25" height="24" rx="2" fill="#a0aec0" stroke="#4a5568" strokeWidth="2" filter="url(#shadow)" />
               <text x="30" y="4" fontSize="11" fontWeight="bold" fill="#4a5568">DF23</text>
               <text x="30" y="16" fontSize="8" fill="#718096">Full indicator</text>
               <circle cx="12" cy="0" r="3" fill={visualLevel > 85 ? "#fc8181" : "#cbd5e0"} stroke="#718096" />
            </g>

            <text x={CONFIG.silo.x + 40} y={CONFIG.silo.y + 200} fontSize="14" fontWeight="bold" fill="#2d3748" opacity="0.6">Bulk solids</text>
            <text x={CONFIG.silo.x + 40} y={CONFIG.silo.y + 100} fontSize="16" fontWeight="bold" fill="#2d3748" opacity="0.8">Silo</text>

            <line x1={CONFIG.silo.x} y1={topY} x2={CONFIG.silo.x + CONFIG.silo.width} y2={topY} stroke="#e53e3e" strokeDasharray="4,2" />
            <text x={CONFIG.silo.x + 5} y={topY - 5} fontSize="10" fill="#e53e3e">Maximum level</text>
            
            <line x1={CONFIG.silo.x + 60} y1={bottomY} x2={CONFIG.silo.x + CONFIG.silo.width + 40} y2={bottomY} stroke="#e53e3e" />
            <text x={CONFIG.silo.x + CONFIG.silo.width + 45} y={bottomY + 3} fontSize="11" fill="#e53e3e" fontWeight="bold">Empty</text>

            <g transform={`translate(${CONFIG.silo.x + CONFIG.silo.width/2 - 40}, ${CONFIG.silo.y})`}>
               <line x1="0" y1={CONFIG.levels.maxLevelOffset} x2="0" y2={CONFIG.levels.emptyLevelOffset} stroke="#2d3748" strokeWidth="1" />
               <path d={`M 0 ${CONFIG.levels.maxLevelOffset} L -3 ${CONFIG.levels.maxLevelOffset + 6} L 3 ${CONFIG.levels.maxLevelOffset + 6} Z`} fill="#2d3748" />
               <path d={`M 0 ${CONFIG.levels.emptyLevelOffset} L -3 ${CONFIG.levels.emptyLevelOffset - 6} L 3 ${CONFIG.levels.emptyLevelOffset - 6} Z`} fill="#2d3748" />
               <text x="-8" y={(CONFIG.levels.maxLevelOffset + CONFIG.levels.emptyLevelOffset)/2} textAnchor="end" fontSize="11" fill="#4a5568" style={{writingMode: "vertical-rl", textOrientation: "mixed"}}>Measuring range</text>
            </g>
          </svg>
        </div>

        {/* --- RIGHT COLUMN: Controls & Config --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* --- 1. INDICATORS SECTION (Moved to Top) --- */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* A. ANALOG INDICATOR (Separate Box) */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm">
              <div className="flex gap-2 h-48">
                {/* Percentage Labels */}
                <div className="flex flex-col justify-between text-[10px] font-bold text-gray-500 py-0.5 text-right">
                  <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
                </div>
                
                {/* Bar */}
                <div className="relative w-10 bg-gray-900 border-2 border-gray-700 rounded-sm overflow-hidden shadow-inner">
                  <div 
                    className="absolute bottom-0 w-full transition-all duration-75 ease-linear"
                    style={{ height: `${visualLevel}%`, backgroundColor: liquidColor }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20"></div>
                  </div>
                  {[25, 50, 75].map(t => <div key={t} className="absolute w-full border-t border-gray-500 opacity-50" style={{bottom: `${t}%`}} />)}
                </div>
              </div>
            </div>

            {/* B. DIGITAL INDICATOR (Separate Box) */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm">
              <div className="bg-gray-300 p-1 rounded shadow-lg border border-gray-400 w-full max-w-[180px]">
                <div className="bg-[#d1d5db] border border-gray-400 p-2 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-gray-600">Silo 1</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-bold">%</span>
                      
                      {/* Mini Silo Icon (Correct Shape) */}
                      <div className="w-3 h-5 bg-white border border-gray-600 relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}>
                        <div className="absolute bottom-0 w-full bg-black transition-all duration-75" style={{height: `${visualLevel}%`}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <div className="flex-1 bg-black h-10 flex items-center justify-center border-2 border-gray-500 relative overflow-hidden">
                      <span className="text-xl font-mono text-amber-500 tracking-widest z-10" style={{textShadow: '0 0 5px #f59e0b'}}>
                        {visualLevel.toFixed(2)}
                      </span>
                      <div className="absolute top-0 w-full h-1/2 bg-white opacity-10"></div>
                    </div>
                    <div className="flex flex-col justify-between w-5 py-0.5">
                      {['▲','SET','▼'].map((btn,i) => (
                        <div key={i} className="h-2.5 bg-gray-600 rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-500">
                          <span className="text-[4px] text-white">{btn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between"><span className="text-[8px] font-bold text-gray-500">ENDA</span><span className="text-[6px]">EI141</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- 2. CALCULATED VALUES --- */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Current Volume</div>
              <div className="text-2xl font-mono font-bold text-gray-800">
                {currentVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm ml-1 text-gray-500">{unit}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 font-bold uppercase">Fill %</div>
              <div className="text-xl font-mono font-bold text-blue-600">{visualLevel.toFixed(2)}%</div>
            </div>
          </div>

          {/* --- 3. CONFIGURATION PANEL (Moved to Bottom) --- */}
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 shadow-sm">
            <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
              <span className="text-lg">⚙️</span> Configuration
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Material Color</label>
                <div className="flex items-center gap-2 bg-white p-1 rounded border border-gray-200">
                  <input type="color" value={liquidColor} onChange={(e) => setLiquidColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none" />
                  <span className="text-xs font-mono text-gray-500">{liquidColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full text-xs p-2 rounded border border-gray-300 bg-white outline-none">
                  <option value="Liters">Liters (L)</option>
                  <option value="m³">Cubic Meters (m³)</option>
                  <option value="Kg">Kilograms (Kg)</option>
                </select>
              </div>

              <div className="col-span-2">
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-gray-600">Material Hardness</label>
                  <span className="text-xs text-blue-600 font-bold">{hardness}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={hardness} onChange={(e) => setHardness(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-600 block mb-1">Max Capacity</label>
                <div className="relative">
                  <input 
                    type="number" max="99999" value={capacity} 
                    onChange={(e) => setCapacity(Math.min(99999, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full text-sm p-2 rounded border border-gray-300 outline-none font-mono"
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-400">{unit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- 4. SIMULATION CONTROL (Bottom) --- */}
          <div className="bg-gray-800 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">High-Speed Simulation</span>
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${isSimulating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isSimulating ? 'STOP' : 'START'}
              </button>
            </div>
            
            {!isSimulating && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Manual Control</label>
                <input 
                  type="range" min="0" max="100" step="0.01"
                  value={targetDataRef.current}
                  onChange={(e) => { targetDataRef.current = parseFloat(e.target.value); }}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}