import React, { useState, useEffect, useRef } from 'react';

// Seven-segment font simulation style - yellow-orange/amber color
const segmentStyle = {
  fontFamily: '"Courier New", Courier, monospace',
  letterSpacing: '2px',
  color: '#ffa500',
  textShadow: '0 0 3px #ffa500, 0 0 6px #ffa500',
};

export default function SiloLevelMonitor() {
  // --- Settings and Inputs ---
  // We assume the sensor sends a percentage (0-100%) or a value converted to percentage.
  
  const [totalVolumeM3, setTotalVolumeM3] = useState(50); // Total Tank Capacity in m3
  const [currentLevelPercent, setCurrentLevelPercent] = useState(53.2); // Value from sensor (%)
  const [isSimulating, setIsSimulating] = useState(true);
  const [siloWidth, setSiloWidth] = useState(280); // Silo width in pixels
  const [materialCurvature, setMaterialCurvature] = useState(15); // Material curve depth in pixels
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
  const siloTopY = 0; // Now relative to alignment container, starts at top
  const siloStraightHeight = 380;
  const siloConeHeight = 140;
  const siloX = 140; // Center offset
  
  // Calculate fill height in pixels
  const totalPixelHeight = siloStraightHeight + siloConeHeight;
  const fillPixelHeight = (currentLevelPercent / 100) * totalPixelHeight;
  
  // Material Peak Y Position (Bulk solids are curved/peaked)
  const materialY = (siloTopY + totalPixelHeight) - fillPixelHeight;

  // --- Render ---
  return (
    <div className="bg-white min-h-screen font-sans select-none flex flex-col">
      
      {/* --- Control Panel (Simulating Sensor & Configuration) - Full Width, Material Design --- */}
      <div className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          {/* Total Volume */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Volume (m³):</label>
            <input 
              type="number" 
              value={totalVolumeM3} 
              onChange={(e) => setTotalVolumeM3(Number(e.target.value))}
              className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Level Slider */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Level:</label>
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
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-bold text-gray-700 w-12 text-right">{currentLevelPercent.toFixed(1)}%</span>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm transition-all ${
                isSimulating 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {isSimulating ? '⏸ Pause' : '▶ Simulate'}
            </button>
          </div>

          {/* Silo Width Control */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Width:</label>
            <input 
              type="range" 
              min="200" 
              max="360" 
              step="10" 
              value={siloWidth} 
              onChange={(e) => setSiloWidth(Number(e.target.value))}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs text-gray-600 w-10">{siloWidth}px</span>
          </div>

          {/* Material Curvature Control */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Curve:</label>
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="1" 
              value={materialCurvature} 
              onChange={(e) => setMaterialCurvature(Number(e.target.value))}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs text-gray-600 w-8">{materialCurvature}px</span>
          </div>

          {/* Calculated Values Display */}
          <div className="flex gap-3 ml-auto">
            <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Liters</div>
              <div className="font-mono font-bold text-base text-blue-600">
                {currentVolumeLiters.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </div>
            </div>
            <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">m³</div>
              <div className="font-mono font-bold text-base text-blue-800">
                {currentVolumeM3.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Diagram Container (Grid Layout) --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl w-full mx-auto px-4 py-6">
        
        {/* --- Silo Visualization (SVG) --- */}
        <div className="lg:col-span-5 relative flex flex-col min-h-[600px]">
          {/* Background box for silo - colorful and visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl shadow-xl border-2 border-emerald-200 -z-10"></div>
          
          {/* Spacer to match analog indicator title section for alignment */}
          <div className="h-[60px] mb-4"></div>
          
          {/* Alignment container - silo body starts here at Y=0 relative to this container */}
          <div className="relative flex justify-center" style={{ height: `${totalPixelHeight}px` }}>
            <svg width={svgWidth + 200} height={svgHeight} className="absolute top-0 left-1/2 transform -translate-x-1/2 overflow-visible" style={{ height: `${totalPixelHeight}px` }}>
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
                   Q ${siloX + siloWidth/2} ${materialY + materialCurvature} ${siloX + siloWidth} ${materialY}
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
                 d={`M ${siloX} ${materialY} Q ${siloX + siloWidth/2} ${materialY + materialCurvature} ${siloX + siloWidth} ${materialY}`}
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

            {/* Empty level indicator - only essential */}
            <text x={siloX + siloWidth/2 - 30} y={siloTopY + totalPixelHeight - 35} className="text-xs fill-red-600 font-bold">Empty</text>

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
              <line x1="0" y1="21" x2="0" y2={materialY} stroke="#1a1a1a" strokeDasharray="3,2" strokeWidth="2.5" opacity="0.9" />
              
              {/* Sensing Weight (Red) - small square shape as in reference */}
              <g transform={`translate(0, ${materialY})`}>
                 <rect x="-6" y="-16" width="12" height="12" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                 <text x="14" y="-8" className="text-[10px] fill-gray-700 font-semibold">Sensing weight</text>
                 
                 {/* Current Level Line - Red horizontal line extending to analog indicator (important line) - aligned with materialY */}
                 {/* Line length is inverse of silo width: smaller silo = longer line, larger silo = shorter line */}
                 {/* Formula: base length (400) minus silo width, with min/max bounds */}
                 {(() => {
                   const baseLength = 400;
                   const lineLength = Math.max(150, Math.min(350, baseLength - siloWidth + 200));
                   return (
                     <>
                       <line x1="0" y1="0" x2={lineLength} y2="0" stroke="#dc2626" strokeWidth="2.5" />
                       <text x={lineLength + 5} y="4" className="text-xs fill-gray-800 font-semibold">{currentLevelPercent.toFixed(1)}%</text>
                     </>
                   );
                 })()}
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
             </g>


            </svg>
          </div>
        </div>

        {/* --- Analog Indicator - Between silo and digital --- */}
        <div className="lg:col-span-3 relative flex flex-col min-h-[600px]">
          {/* Background box for analog indicator - colorful and visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-xl border-2 border-blue-200 -z-10"></div>
          
          {/* Title matching silo title position */}
          <div className="h-[60px] flex items-end justify-center mb-4 relative z-0">
            <h3 className="font-bold text-gray-800">Level indication</h3>
          </div>
          
          {/* Alignment container - matches silo alignment container exactly */}
          <div className="relative flex justify-center z-0" style={{ height: `${totalPixelHeight}px` }}>
            {/* Text above - positioned absolutely to not affect bar alignment */}
            <div className="absolute top-0 left-0 right-0 flex w-full justify-center gap-8 text-sm text-gray-600" style={{ top: '-24px' }}>
              <span>analog</span>
              <span>or</span>
              <span>digital</span>
            </div>
            
            {/* --- Analog Indication - Bar starts at exact top of alignment container --- */}
            <div className="absolute top-0 left-0 right-0 flex justify-center">
             <div className="flex gap-3 items-start">
               {/* Labels on the left - Full and Empty with percentages */}
               <div className="relative text-sm font-bold text-gray-800 flex flex-col justify-between" style={{ minWidth: '60px', height: `${totalPixelHeight}px` }}>
                 <span className="absolute top-0 left-0">%100</span>
                 <span className="absolute bottom-0 left-0">%0</span>
               </div>
               
               {/* Bar Indicator - aligned with silo height - exactly matches totalPixelHeight, starts at top=0 */}
               {/* Positioned to align red mark with red line from silo */}
               <div className="relative w-14 bg-white border-[3px] border-black shadow-md" style={{ height: `${totalPixelHeight}px` }}>
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
                 
               </div>
               
               {/* Percentage labels on the right side - 25, 50, 75 inside the box */}
               <div className="relative text-xs font-semibold text-gray-700" style={{ height: `${totalPixelHeight}px`, marginLeft: '8px' }}>
                 <span className="absolute right-0" style={{ top: '25%', transform: 'translateY(-50%)' }}>75</span>
                 <span className="absolute right-0" style={{ top: '50%', transform: 'translateY(-50%)' }}>50</span>
                 <span className="absolute right-0" style={{ top: '75%', transform: 'translateY(-50%)' }}>25</span>
                 <span 
                   className="absolute text-red-600 font-bold"
                   style={{ 
                     top: `${100 - currentLevelPercent}%`,
                     right: '0',
                     transform: 'translateY(-50%)'
                   }}
                 >
                   {currentLevelPercent.toFixed(1)}%
                 </span>
               </div>
               
               {/* Needles/pointers on the far right - outside the indicator box */}
               <div className="relative" style={{ height: `${totalPixelHeight}px`, marginLeft: '16px' }}>
                 {/* 100% needle at top */}
                 <div className="absolute top-0 right-0">
                   <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-gray-800"></div>
                 </div>
                 {/* 75% needle */}
                 <div className="absolute right-0" style={{ top: '25%', transform: 'translateY(-50%)' }}>
                   <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-gray-600"></div>
                 </div>
                 {/* 50% needle */}
                 <div className="absolute right-0" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                   <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-gray-600"></div>
                 </div>
                 {/* 25% needle */}
                 <div className="absolute right-0" style={{ top: '75%', transform: 'translateY(-50%)' }}>
                   <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-gray-600"></div>
                 </div>
                 {/* Current level needle - red */}
                 <div 
                   className="absolute right-0"
                   style={{ 
                     top: `${100 - currentLevelPercent}%`,
                     transform: 'translateY(-50%)'
                   }}
                 >
                   <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-red-600"></div>
                 </div>
                 {/* 0% needle at bottom */}
                 <div className="absolute bottom-0 right-0">
                   <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-gray-800"></div>
                 </div>
               </div>
             </div>
            </div>
          </div>
        </div>

        {/* --- Digital Indicator - Right of analog --- */}
        <div className="lg:col-span-4 relative flex flex-col min-h-[600px]">
          {/* Background box for digital indicator - colorful and visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-xl shadow-xl border-2 border-amber-200 -z-10"></div>
          
          {/* Title matching silo title position */}
          <div className="h-[60px] flex items-end justify-center mb-4 relative z-0">
          </div>
          
          {/* Content area - can be positioned independently */}
          <div className="flex justify-center relative z-0">
            {/* --- Digital Indicator - Three main sections --- */}
            <div className="bg-[#e5e7eb] rounded-lg shadow-2xl border-2 border-gray-400 w-64 relative overflow-hidden">
              
              {/* Row 1: Top section - Light gray background */}
              <div className="bg-gray-200 p-3 border-b-2 border-gray-400 flex items-center justify-between">
                 {/* Silo 1 label on left */}
                 <div className="text-gray-800 text-sm font-bold">Silo 1</div>
                 
                 {/* Right side: % symbol and mini silo indicator */}
                 <div className="flex items-center gap-2">
                   <span className="text-gray-800 text-sm font-bold">%</span>
                   {/* Mini silo indicator - small silo shape filled to current level */}
                   <div className="relative w-10 h-6 border border-gray-600 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                     <div 
                       className="absolute bottom-0 w-full bg-black transition-all duration-500"
                       style={{ 
                         height: `${currentLevelPercent}%`,
                         clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%, 0 100%)'
                       }}
                     />
                   </div>
                 </div>
              </div>
              
              {/* Row 2: Middle section - Digital display in black box with buttons outside */}
              <div className="flex items-center gap-2">
                 {/* Black box with number display */}
                 <div className="bg-black p-4 flex-1 flex items-center justify-center min-h-[100px]">
                   <span className="text-6xl font-extrabold tracking-wider leading-none" style={segmentStyle}>
                     {currentLevelPercent.toFixed(1)}
                   </span>
                 </div>
                 
                 {/* Three buttons on the right - outside the black box */}
                 <div className="flex flex-col gap-2 pr-2">
                   {/* Up arrow button - green triangle */}
                   <div className="w-7 h-7 bg-green-500 rounded-sm flex items-center justify-center shadow-md">
                     <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                       <path d="M5 1 L1 7 L9 7 Z" />
                     </svg>
                   </div>
                   
                   {/* Center white button - circular */}
                   <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md mx-auto">
                   </div>
                   
                   {/* Down arrow button - green triangle */}
                   <div className="w-7 h-7 bg-green-500 rounded-sm flex items-center justify-center shadow-md">
                     <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                       <path d="M5 9 L1 3 L9 3 Z" />
                     </svg>
                   </div>
                 </div>
              </div>
              
              {/* Row 3: Bottom section - ENDA and model number */}
              <div className="bg-gray-200 p-3 border-t-2 border-gray-400 flex items-center justify-between">
                 <span className="text-gray-800 font-bold text-sm">ENDA</span>
                 <span className="text-gray-600 text-xs font-semibold">EI141</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

