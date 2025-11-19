import React, { useState, useEffect, useRef } from 'react';

// Seven-segment font simulation style
const segmentStyle = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: '2px',
  textShadow: '0 0 2px #39ff14',
};

export default function SiloLevelMonitor() {
  // --- Settings and Inputs ---
  // We assume the sensor sends a percentage (0-100%) or a value converted to percentage.
  
  const [totalVolumeM3, setTotalVolumeM3] = useState(50); // Total Tank Capacity in m3
  const [currentLevelPercent, setCurrentLevelPercent] = useState(53.2); // Value from sensor (%)
  const [isSimulating, setIsSimulating] = useState(true);
  const intervalRef = useRef(null);
  
  // Simulate variable sensor readings
  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(() => {
        // Simulate small random variations in sensor reading (±0.3%)
        setCurrentLevelPercent(prev => {
          const variation = (Math.random() - 0.5) * 0.6; // -0.3 to +0.3
          const newValue = prev + variation;
          // Keep within bounds
          return Math.max(0, Math.min(100, newValue));
        });
      }, 2000); // Update every 2 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulating]);
  
  // --- Calculations ---
  const currentVolumeM3 = (totalVolumeM3 * currentLevelPercent) / 100;
  const currentVolumeLiters = currentVolumeM3 * 1000;
  
  // --- Graphic Dimensions (SVG Configuration) ---
  // Properly scaled to match reference image proportions
  const svgHeight = 700;
  const svgWidth = 500;
  const siloTopY = 100;
  const siloStraightHeight = 380;
  const siloConeHeight = 140;
  const siloWidth = 280;
  const siloX = 140; // Center offset
  
  // Calculate fill height in pixels
  const totalPixelHeight = siloStraightHeight + siloConeHeight;
  const fillPixelHeight = (currentLevelPercent / 100) * totalPixelHeight;
  
  // Material Peak Y Position (Bulk solids are curved/peaked)
  const materialY = (siloTopY + totalPixelHeight) - fillPixelHeight;

  // --- Render ---
  return (
    <div className="bg-white p-4 min-h-screen font-sans select-none flex flex-col items-center">
      
      {/* --- Control Panel (Simulating Sensor & Configuration) --- */}
      <div className="w-full max-w-4xl mb-8 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm flex flex-wrap gap-6 justify-between items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Total Tank Volume (m³)
          </label>
          <input 
            type="number" 
            value={totalVolumeM3} 
            onChange={(e) => setTotalVolumeM3(Number(e.target.value))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Sensor Data (Level %)
          </label>
          <div className="flex items-center gap-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.1" 
              value={currentLevelPercent} 
              onChange={(e) => {
                setCurrentLevelPercent(Number(e.target.value));
                setIsSimulating(false);
              }}
              className="flex-1 cursor-pointer"
            />
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-3 py-1 text-xs rounded ${isSimulating ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {isSimulating ? 'Pause' : 'Simulate'}
            </button>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Empty (0%)</span>
            <span className="font-bold">{currentLevelPercent.toFixed(1)}%</span>
            <span>Full (100%)</span>
          </div>
        </div>

        {/* Calculated Values Display */}
        <div className="flex gap-4 text-right">
          <div className="bg-white p-2 rounded border border-gray-200 shadow-sm min-w-[100px]">
            <div className="text-xs text-gray-500">Volume (Liters)</div>
            <div className="font-mono font-bold text-lg text-blue-600">
              {currentVolumeLiters.toLocaleString(undefined, {maximumFractionDigits: 0})} L
            </div>
          </div>
          <div className="bg-white p-2 rounded border border-gray-200 shadow-sm min-w-[100px]">
            <div className="text-xs text-gray-500">Volume (m³)</div>
            <div className="font-mono font-bold text-lg text-blue-800">
              {currentVolumeM3.toFixed(2)} m³
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Diagram Container (Grid Layout) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl w-full">
        
        {/* --- Silo Visualization (SVG) --- */}
        <div className="lg:col-span-5 relative flex justify-center">
          <h2 className="absolute top-0 w-full text-center text-gray-800 font-bold text-lg border-b pb-2">
            Yo-Yo tape and weight for continuous level measurement of bulk solids.
          </h2>
          
          <svg width={svgWidth + 200} height={svgHeight} className="mt-20 overflow-visible">
            <defs>
              {/* Gradient for Bulk Solids - light indigo-blue, matching reference */}
              <linearGradient id="bulkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8fa8d0" />
                <stop offset="15%" stopColor="#9bb0d8" />
                <stop offset="30%" stopColor="#8fa8d0" />
                <stop offset="50%" stopColor="#7d9ac8" />
                <stop offset="70%" stopColor="#8fa8d0" />
                <stop offset="85%" stopColor="#9bb0d8" />
                <stop offset="100%" stopColor="#7d9ac8" />
              </linearGradient>
              
              {/* Silo wall gradient for 3D effect */}
              <linearGradient id="siloWallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f5f5f5" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e8e8e8" />
              </linearGradient>
              
              {/* Sensor body gradient */}
              <linearGradient id="sensorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b8bcc0" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
              
              {/* Clip path for Silo Shape */}
              <clipPath id="siloShape">
                <path d={`
                  M ${siloX} ${siloTopY} 
                  L ${siloX + siloWidth} ${siloTopY} 
                  L ${siloX + siloWidth} ${siloTopY + siloStraightHeight} 
                  L ${siloX + siloWidth/2} ${siloTopY + siloStraightHeight + siloConeHeight} 
                  L ${siloX} ${siloTopY + siloStraightHeight} 
                  Z
                `} />
              </clipPath>
            </defs>

            {/* --- 1. Draw Silo Body with 3D effect --- */}
            {/* Silo fill background */}
            <rect x={siloX} y={siloTopY} width={siloWidth} height={siloStraightHeight} fill="url(#siloWallGradient)" />
            <path d={`M ${siloX} ${siloTopY + siloStraightHeight} L ${siloX + siloWidth/2} ${siloTopY + siloStraightHeight + siloConeHeight} L ${siloX + siloWidth} ${siloTopY + siloStraightHeight} Z`} fill="url(#siloWallGradient)" />
            
            <g stroke="#2d3748" strokeWidth="2.5" fill="none">
              {/* Top Line */}
              <line x1={siloX} y1={siloTopY} x2={siloX + siloWidth} y2={siloTopY} />
              
              {/* Left Wall */}
              <line x1={siloX} y1={siloTopY} x2={siloX} y2={siloTopY + siloStraightHeight} />
              
              {/* Right Wall */}
              <line x1={siloX + siloWidth} y1={siloTopY} x2={siloX + siloWidth} y2={siloTopY + siloStraightHeight} />
              
              {/* Bottom Cone - sharper/more pointed */}
              <line x1={siloX} y1={siloTopY + siloStraightHeight} x2={siloX + siloWidth/2} y2={siloTopY + siloStraightHeight + siloConeHeight} strokeWidth="2.5" />
              <line x1={siloX + siloWidth} y1={siloTopY + siloStraightHeight} x2={siloX + siloWidth/2} y2={siloTopY + siloStraightHeight + siloConeHeight} strokeWidth="2.5" />
              
              {/* Bottom Valve - more detailed */}
              <rect x={siloX + siloWidth/2 - 12} y={siloTopY + siloStraightHeight + siloConeHeight} width="24" height="12" fill="#d1d5db" stroke="#4b5563" strokeWidth="1.5" />
              <path d={`M ${siloX + siloWidth/2 - 18} ${siloTopY + siloStraightHeight + siloConeHeight + 12} L ${siloX + siloWidth/2 + 18} ${siloTopY + siloStraightHeight + siloConeHeight + 12}`} stroke="#4b5563" strokeWidth="3" />
            </g>

            {/* --- 2. Material Fill (Bulk Solids) - with concave curve and smooth animation --- */}
            <g clipPath="url(#siloShape)">
               {/* Fill Area - concave curve (middle lower than edges) with smooth animation */}
               <path 
                 d={`
                   M ${siloX} ${siloTopY + totalPixelHeight} 
                   L ${siloX} ${materialY} 
                   Q ${siloX + siloWidth/2} ${materialY + 15} ${siloX + siloWidth} ${materialY}
                   L ${siloX + siloWidth} ${siloTopY + totalPixelHeight} 
                   Z
                 `} 
                 fill="url(#bulkGradient)" 
                 stroke="none"
                 style={{ 
                   transition: 'd 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                   transformOrigin: 'center'
                 }}
               />
               
               {/* Curve line for material peak - concave (middle lower) - matching reference color */}
               <path 
                 d={`M ${siloX} ${materialY} Q ${siloX + siloWidth/2} ${materialY + 15} ${siloX + siloWidth} ${materialY}`}
                 fill="none"
                 stroke="#6b8fc8"
                 strokeWidth="2.5"
                 opacity="0.85"
                 style={{ 
                   transition: 'd 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                 }}
               />
            </g>

            {/* --- 3. Labels & Static Details --- */}
            {/* Bulk solids Label */}
            <text x={siloX + 40} y={siloTopY + siloStraightHeight - 40} className="font-bold text-sm text-gray-600">Bulk solids</text>
            
            {/* Maximum level label and dashed line */}
            <text x={siloX + 10} y={siloTopY + 15} className="text-[10px] fill-gray-600">Maximum level</text>
            <line x1={siloX} y1={siloTopY + 20} x2={siloX + siloWidth} y2={siloTopY + 20} stroke="red" strokeWidth="1" strokeDasharray="4,2" />

            {/* Measuring Range - simplified, only essential lines */}
            <g stroke="#666" strokeWidth="1.5">
               {/* Top Horizontal (Max level) */}
               <line x1={siloX + siloWidth + 10} y1={siloTopY + 20} x2={siloX + siloWidth + 60} y2={siloTopY + 20} />
               {/* Bottom Horizontal (Empty level) */}
               <line x1={siloX + siloWidth/2} y1={siloTopY + totalPixelHeight - 40} x2={siloX + siloWidth + 60} y2={siloTopY + totalPixelHeight - 40} />
               {/* Vertical Line connecting max and empty */}
               <line x1={siloX + siloWidth + 45} y1={siloTopY + 20} x2={siloX + siloWidth + 45} y2={siloTopY + totalPixelHeight - 40} />
            </g>

            {/* Empty level indicator - only essential */}
            <text x={siloX + siloWidth/2 - 30} y={siloTopY + totalPixelHeight - 35} className="text-xs fill-red-600 font-bold">Empty</text>
            
            {/* Level alignment lines - only top and bottom of tank to analog indicator */}
            <line x1={siloX + siloWidth} y1={siloTopY + 20} x2={siloX + siloWidth + 80} y2={siloTopY + 20} stroke="#666" strokeWidth="1.5" strokeDasharray="4,2" />
            <line x1={siloX + siloWidth/2} y1={siloTopY + totalPixelHeight - 40} x2={siloX + siloWidth + 80} y2={siloTopY + totalPixelHeight - 40} stroke="#666" strokeWidth="1.5" strokeDasharray="4,2" />

            {/* Gutter/channel at top right for LF20 - Positioned based on 16-section grid (sections 1-2) --- */}
            <g transform={`translate(${siloX + siloWidth - 50}, ${siloTopY - 5})`}>
              {/* Gutter body - U-shaped channel */}
              <path d="M 0 8 Q 0 0 5 0 L 45 0 Q 50 0 50 8 L 50 10 L 0 10 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Gutter inner detail */}
              <rect x="3" y="2" width="44" height="6" fill="#e2e8f0" />
              {/* Gutter detail lines */}
              <line x1="8" y1="3" x2="42" y2="3" stroke="#94a3b8" strokeWidth="0.5" />
              <line x1="8" y1="7" x2="42" y2="7" stroke="#94a3b8" strokeWidth="0.5" />
            </g>
            
            {/* Chimney-like closed gutter in middle of silo - Positioned based on 16-section grid (section 9-10) --- */}
            <g transform={`translate(${siloX + siloWidth/2 - 20}, ${siloTopY + 200})`}>
              {/* Chimney body - rectangular with rounded top */}
              <rect x="0" y="8" width="36" height="55" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" rx="1" />
              {/* Chimney top cap - closed/sealed */}
              <path d="M 0 8 Q 0 0 18 0 Q 36 0 36 8" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Cap detail line */}
              <line x1="4" y1="4" x2="32" y2="4" stroke="#94a3b8" strokeWidth="0.5" />
              {/* Chimney detail lines inside */}
              <line x1="6" y1="20" x2="30" y2="20" stroke="#cbd5e1" strokeWidth="0.5" />
              <line x1="6" y1="35" x2="30" y2="35" stroke="#cbd5e1" strokeWidth="0.5" />
              <line x1="6" y1="50" x2="30" y2="50" stroke="#cbd5e1" strokeWidth="0.5" />
            </g>

            {/* --- 4. LF20 Sensor (Yo-Yo) - In gutter at top right, more detailed --- */}
            <g transform={`translate(${siloX + siloWidth - 30}, ${siloTopY - 3})`}>
              {/* Sensor Body - sits in gutter, more detailed shape */}
              <rect x="-20" y="-22" width="40" height="26" fill="url(#sensorGradient)" stroke="#4b5563" strokeWidth="2" rx="1.5" />
              {/* Top section detail */}
              <rect x="-18" y="-20" width="36" height="4" fill="#b8bcc0" />
              {/* Bottom section detail */}
              <rect x="-18" y="-2" width="36" height="4" fill="#b8bcc0" />
              {/* Top detail line */}
              <line x1="-16" y1="-20" x2="16" y2="-20" stroke="#6b7280" strokeWidth="0.5" />
              {/* Bottom detail line */}
              <line x1="-16" y1="0" x2="16" y2="0" stroke="#6b7280" strokeWidth="0.5" />
              
              {/* Neck - extends down from sensor */}
              <rect x="-6" y="3" width="12" height="18" fill="#d1d5db" stroke="#4b5563" strokeWidth="1.5" />
              {/* Neck detail */}
              <line x1="-4" y1="6" x2="4" y2="6" stroke="#9ca3af" strokeWidth="0.5" />
              
              {/* Labels */}
              <text x="22" y="-8" className="text-xs font-bold fill-gray-800">LF20</text>
              <text x="22" y="2" className="text-[10px] fill-gray-600">Level measurement</text>
              
              {/* Measuring Tape - dotted line */}
              <line x1="0" y1="21" x2="0" y2={materialY - (siloTopY - 3) - 12} stroke="#1a1a1a" strokeDasharray="3,2" strokeWidth="2.5" opacity="0.9" />
              
              {/* Sensing Weight (Red) - small square shape as in reference */}
              <g transform={`translate(0, ${materialY - (siloTopY - 3) - 12})`}>
                 <rect x="-6" y="-4" width="12" height="12" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                 <text x="14" y="4" className="text-[10px] fill-gray-700 font-semibold">Sensing weight</text>
                 
                 {/* Current Level Line - Red horizontal line extending to analog indicator (important line) */}
                 <line x1="0" y1="0" x2={siloWidth + 80} y2="0" stroke="#dc2626" strokeWidth="2.5" />
                 <text x={siloWidth + 85} y="4" className="text-xs fill-gray-800 font-semibold">Current level</text>
              </g>
            </g>

             {/* --- 5. Filling Pipe - Positioned based on 16-section grid (section 1 has "pipe" text) --- */}
             <g transform={`translate(${siloX + 20}, ${siloTopY - 50})`}>
               {/* Pipe body with gradient */}
               <rect x="0" y="0" width="22" height="70" fill="#d1d5db" stroke="#6b7280" strokeWidth="2" rx="1" />
               {/* Pipe highlight */}
               <rect x="2" y="2" width="18" height="66" fill="#e5e7eb" />
               {/* Pipe connection ring */}
               <rect x="-2" y="0" width="26" height="6" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" rx="1" />
               {/* Pipe end cap */}
               <ellipse cx="11" cy="70" rx="11" ry="3" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
               {/* Pipe hole/opening at bottom */}
               <ellipse cx="11" cy="70" rx="8" ry="2" fill="#ffffff" stroke="#6b7280" strokeWidth="0.5" />
               <text x="-12" y="30" className="text-[10px] fill-gray-600 text-right font-semibold">Filling pipe</text>
             </g>

             {/* --- 6. DF23 Full Indicator Sensor - Positioned based on 16-section grid analysis (section 6) --- */}
             <g transform={`translate(${siloX + siloWidth - 20}, ${siloTopY + 30})`}>
               {/* Sensor body with gradient - more complex shape */}
               <rect x="0" y="0" width="32" height="24" fill="url(#sensorGradient)" stroke="#4b5563" strokeWidth="2" rx="2" />
               {/* Top section detail */}
               <rect x="2" y="2" width="28" height="6" fill="#b8bcc0" stroke="#6b7280" strokeWidth="0.5" rx="1" />
               {/* Middle section */}
               <rect x="2" y="8" width="28" height="8" fill="#9ca3af" />
               {/* Bottom section detail */}
               <rect x="2" y="16" width="28" height="6" fill="#b8bcc0" stroke="#6b7280" strokeWidth="0.5" rx="1" />
               {/* Sensor detail lines */}
               <line x1="4" y1="5" x2="28" y2="5" stroke="#6b7280" strokeWidth="0.5" />
               <line x1="4" y1="19" x2="28" y2="19" stroke="#6b7280" strokeWidth="0.5" />
               {/* Center indicator dot */}
               <circle cx="16" cy="12" r="2" fill="#4b5563" />
               
               {/* Paddle arm - extends into silo */}
               <line x1="0" y1="12" x2="-18" y2="22" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
               {/* Paddle - more complex with detail */}
               <circle cx="-18" cy="22" r="6" fill="#4b5563" stroke="#2d3748" strokeWidth="1.5" />
               <circle cx="-18" cy="22" r="3" fill="#6b7280" />
               <circle cx="-18" cy="22" r="1" fill="#9ca3af" />
               
               <text x="36" y="8" className="text-xs font-bold fill-gray-800">DF23</text>
               <text x="36" y="22" className="text-[10px] fill-gray-600">Full indicator</text>
               
               {/* Red dot at DF23 */}
               <circle cx="36" cy="12" r="3" fill="red" />
               <text x="42" y="15" className="text-xs fill-red-600 font-bold">Full</text>
               {/* Red line connecting to Full mark on analog indicator (important line) */}
               <line x1="36" y1="12" x2={siloX + siloWidth + 80} y2={siloTopY + 20} stroke="red" strokeWidth="2" strokeDasharray="4,2" />
             </g>


          </svg>
        </div>

        {/* --- Analog Indicator - Between silo and digital --- */}
        <div className="lg:col-span-3 flex flex-col gap-6 pt-20 items-center">
          
          {/* --- Analog Indication - Aligned with silo min/max --- */}
          <div className="flex flex-col items-center w-full">
             <h3 className="font-bold text-gray-800 mb-1">Level indication</h3>
             <div className="flex w-full justify-center gap-8 text-sm text-gray-600 mb-2">
               <span>analog</span>
               <span>or</span>
               <span>digital</span>
             </div>
             
             <div className="flex gap-3 items-center">
               {/* Bar Indicator - aligned with silo height */}
               <div className="relative w-14 h-[520px] bg-white border-[3px] border-black shadow-md">
                 {/* Light Blue Fill from 0% (bottom) to current level - matching silo color */}
                 <div 
                    className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
                    style={{ 
                      height: `${currentLevelPercent}%`,
                      backgroundColor: '#8fa8d0'
                    }}
                 />
                 {/* Black Fill from current level to 100% (top) */}
                 <div 
                    className="absolute top-0 w-full bg-black transition-all duration-500 ease-in-out"
                    style={{ height: `${100 - currentLevelPercent}%` }}
                 />
                 {/* Graduations on the right side with small lines - more visible */}
                 <div className="absolute right-0 top-0 h-full w-full flex flex-col pointer-events-none" style={{ paddingRight: '6px' }}>
                    {/* 100% mark at top */}
                    <div className="absolute top-0 right-0 flex items-center">
                      <span className="w-3 h-0.5 bg-black"></span>
                    </div>
                    {/* 75% mark */}
                    <div className="absolute right-0 flex items-center" style={{ top: '25%' }}>
                      <span className="w-3 h-0.5 bg-black"></span>
                    </div>
                    {/* 50% mark */}
                    <div className="absolute right-0 flex items-center" style={{ top: '50%' }}>
                      <span className="w-3 h-0.5 bg-black"></span>
                    </div>
                    {/* 25% mark */}
                    <div className="absolute right-0 flex items-center" style={{ top: '75%' }}>
                      <span className="w-3 h-0.5 bg-black"></span>
                    </div>
                    {/* Current level mark - dynamic position with red indicator */}
                    <div 
                      className="absolute right-0 flex items-center"
                      style={{ top: `${100 - currentLevelPercent}%` }}
                    >
                      <span className="w-3 h-0.5 bg-red-600"></span>
                    </div>
                    {/* 0% mark at bottom */}
                    <div className="absolute bottom-0 right-0 flex items-center">
                      <span className="w-3 h-0.5 bg-black"></span>
                    </div>
                 </div>
                 
                 {/* Red line indicator at current level position - extends from sensing weight, visible across bar */}
                 <div 
                   className="absolute left-0 w-full pointer-events-none"
                   style={{ 
                     top: `${100 - currentLevelPercent}%`,
                     height: '2.5px',
                     backgroundColor: '#dc2626',
                     zIndex: 10
                   }}
                 />
               </div>
               
               {/* Percentage labels on the right side with small lines */}
               <div className="relative h-[520px] flex flex-col justify-between py-1 text-xs font-semibold text-gray-700">
                 <span>100%</span>
                 <span>75%</span>
                 <span>50%</span>
                 <span>25%</span>
                 <span 
                   className="absolute text-red-600 font-bold"
                   style={{ 
                     top: `${(100 - currentLevelPercent) * 5.2 - 8}px`,
                     left: '0'
                   }}
                 >
                   {currentLevelPercent.toFixed(1)}%
                 </span>
                 <span>0%</span>
               </div>
               
               {/* Labels on the left */}
               <div className="relative h-[520px] flex flex-col justify-between py-1 text-sm font-bold text-gray-800" style={{ minWidth: '55px' }}>
                 <span>Full</span>
                 <span 
                   className="absolute text-red-600"
                   style={{ 
                     top: `${(100 - currentLevelPercent) * 5.2 - 8}px`,
                     left: '0'
                   }}
                 >
                   Current<br/>level
                 </span>
                 <span>Empty</span>
               </div>
             </div>
             
             {/* Lines connecting silo min/max to analog indicator - will be drawn in SVG overlay */}
          </div>
        </div>

        {/* --- Digital Indicator - Right of analog --- */}
        <div className="lg:col-span-4 flex flex-col gap-6 pt-20 items-center">

          {/* --- 2. Digital Indicator - Matching reference image shape and style --- */}
          <div className="flex justify-center">
            <div className="bg-[#1a1a1a] p-1.5 rounded shadow-2xl border-[3px] border-gray-800 w-48 relative">
              {/* Top section - White background with Silo 1, more prominent */}
              <div className="bg-white border-b-[3px] border-gray-800 p-2.5 mb-1.5 rounded-t">
                <div className="text-base font-extrabold text-black tracking-wide">Silo 1</div>
              </div>
              
              {/* Middle section - Horizontal bar with % symbol, matching reference proportions */}
              <div className="bg-white border-[2px] border-gray-700 p-3 mb-1.5 rounded relative">
                 <div className="flex flex-col items-center gap-1.5">
                   {/* Horizontal bar - more prominent, matching reference */}
                   <div className="relative w-full h-5 bg-white border-2 border-gray-500 rounded-sm">
                     {/* Filled part from left (silo color) */}
                     <div 
                        className="absolute left-0 top-0 h-full rounded-sm transition-all duration-500 ease-in-out"
                        style={{ 
                          width: `${currentLevelPercent}%`,
                          backgroundColor: '#8fa8d0'
                        }}
                     />
                     {/* White empty part from right */}
                     <div 
                        className="absolute right-0 top-0 h-full rounded-sm transition-all duration-500 ease-in-out"
                        style={{ 
                          width: `${100 - currentLevelPercent}%`,
                          backgroundColor: '#ffffff'
                        }}
                     />
                   </div>
                   {/* % symbol - larger, matching reference */}
                   <span className="text-sm font-extrabold text-gray-900">%</span>
                 </div>
              </div>
              
              {/* Bottom section - Digital display with ENDA and E1141, matching reference style */}
              <div className="bg-black border-[2px] border-gray-700 p-2.5 rounded-b">
                 {/* Large number display - green, matching reference */}
                 <div className="flex justify-center items-center mb-1.5">
                   <span className="text-5xl font-extrabold tracking-wider" style={segmentStyle}>
                     {currentLevelPercent.toFixed(1)}
                   </span>
                 </div>
                 {/* ENDA and model number - matching reference positioning */}
                 <div className="flex justify-center items-baseline gap-2 pt-1">
                   <span className="text-white font-bold text-sm italic">ENDA</span>
                   <span className="text-gray-400 text-[10px] font-semibold">E1141</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

