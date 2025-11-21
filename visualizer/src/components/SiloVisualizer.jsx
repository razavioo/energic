import React, { useEffect, useRef, useState } from 'react';

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

export default function SiloVisualizer({ targetLevel, liquidColor, hardness, capacity }) {
    const [visualLevel, setVisualLevel] = useState(0);
    const waveOffsetRef = useRef(0);
    const requestRef = useRef();
    const lastDirectionRef = useRef(0);

    const animate = () => {
        waveOffsetRef.current = (waveOffsetRef.current + 0.1) % (Math.PI * 2);

        setVisualLevel(prev => {
            const diff = targetLevel - prev;

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
    }, [targetLevel]); // Re-trigger if target changes? No, loop runs continuously.

    const topY = CONFIG.silo.y + CONFIG.levels.maxLevelOffset;
    const bottomY = CONFIG.silo.y + CONFIG.levels.emptyLevelOffset;
    const range = bottomY - topY;
    const currentSurfaceY = bottomY - ((visualLevel / 100) * range);

    // Physics Logic (Curve)
    const maxDepth = (hardness / 100) * 25;
    const curveDepth = lastDirectionRef.current === 1 ? maxDepth : -maxDepth;
    const waveAmplitude = (1 - (hardness / 100)) * 3;
    const waveY = Math.sin(waveOffsetRef.current) * waveAmplitude;

    const siloPath = `
    M ${CONFIG.silo.x} ${CONFIG.silo.y} 
    L ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y} 
    L ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight} 
    L ${CONFIG.silo.x + CONFIG.silo.width / 2 + CONFIG.silo.outletWidth / 2} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight} 
    L ${CONFIG.silo.x + CONFIG.silo.width / 2 - CONFIG.silo.outletWidth / 2} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight} 
    L ${CONFIG.silo.x} ${CONFIG.silo.y + CONFIG.silo.cylinderHeight} 
    Z
  `;

    return (
        <div className="relative flex justify-center items-center bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 min-h-[600px]">
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

                <path d={siloPath} fill="url(#siloGradient)" />

                <g clipPath="url(#siloClip)">
                    <path
                        d={`
              M ${CONFIG.silo.x} ${currentSurfaceY}
              Q ${CONFIG.silo.x + CONFIG.silo.width / 2} ${currentSurfaceY + curveDepth + waveY} ${CONFIG.silo.x + CONFIG.silo.width} ${currentSurfaceY}
              L ${CONFIG.silo.x + CONFIG.silo.width} ${700} L ${CONFIG.silo.x} ${700} Z
            `}
                        fill="url(#dynamicLiquidGradient)"
                    />
                    <path
                        d={`M ${CONFIG.silo.x} ${currentSurfaceY} Q ${CONFIG.silo.x + CONFIG.silo.width / 2} ${currentSurfaceY + curveDepth + waveY} ${CONFIG.silo.x + CONFIG.silo.width} ${currentSurfaceY}`}
                        fill="none" stroke={liquidColor} strokeWidth="3" filter="brightness(0.7)"
                    />
                </g>

                <path d={siloPath} fill="none" stroke={CONFIG.colors.siloStroke} strokeWidth="3" />
                <path d={`M ${CONFIG.silo.x} ${CONFIG.silo.y} Q ${CONFIG.silo.x + CONFIG.silo.width / 2} ${CONFIG.silo.y - 25} ${CONFIG.silo.x + CONFIG.silo.width} ${CONFIG.silo.y}`} fill="#e2e8f0" stroke={CONFIG.colors.siloStroke} strokeWidth="2" />

                <g transform={`translate(${CONFIG.silo.x + CONFIG.silo.width / 2}, ${CONFIG.silo.y + CONFIG.silo.cylinderHeight + CONFIG.silo.coneHeight})`}>
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

                <g transform={`translate(${CONFIG.silo.x + CONFIG.silo.width / 2 - 40}, ${CONFIG.silo.y})`}>
                    <line x1="0" y1={CONFIG.levels.maxLevelOffset} x2="0" y2={CONFIG.levels.emptyLevelOffset} stroke="#2d3748" strokeWidth="1" />
                    <path d={`M 0 ${CONFIG.levels.maxLevelOffset} L -3 ${CONFIG.levels.maxLevelOffset + 6} L 3 ${CONFIG.levels.maxLevelOffset + 6} Z`} fill="#2d3748" />
                    <path d={`M 0 ${CONFIG.levels.emptyLevelOffset} L -3 ${CONFIG.levels.emptyLevelOffset - 6} L 3 ${CONFIG.levels.emptyLevelOffset - 6} Z`} fill="#2d3748" />
                    <text x="-8" y={(CONFIG.levels.maxLevelOffset + CONFIG.levels.emptyLevelOffset) / 2} textAnchor="end" fontSize="11" fill="#4a5568" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>Measuring range</text>
                </g>
            </svg>
        </div>
    );
}
