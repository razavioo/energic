import React from 'react';

export default function Indicators({ level, capacity, unit, liquidColor }) {
    const currentVolume = (level / 100) * capacity;

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                {/* A. ANALOG INDICATOR */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm">
                    <div className="flex gap-2 h-48">
                        <div className="flex flex-col justify-between text-[10px] font-bold text-gray-500 py-0.5 text-right">
                            <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
                        </div>
                        <div className="relative w-10 bg-gray-900 border-2 border-gray-700 rounded-sm overflow-hidden shadow-inner">
                            <div
                                className="absolute bottom-0 w-full transition-all duration-75 ease-linear"
                                style={{ height: `${level}%`, backgroundColor: liquidColor }}
                            >
                                <div className="absolute inset-0 bg-white opacity-20"></div>
                            </div>
                            {[25, 50, 75].map(t => <div key={t} className="absolute w-full border-t border-gray-500 opacity-50" style={{ bottom: `${t}%` }} />)}
                        </div>
                    </div>
                </div>

                {/* B. DIGITAL INDICATOR */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-center shadow-sm">
                    <div className="bg-gray-300 p-1 rounded shadow-lg border border-gray-400 w-full max-w-[180px]">
                        <div className="bg-[#d1d5db] border border-gray-400 p-2 flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-gray-600">Silo 1</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-bold">%</span>
                                    <div className="w-3 h-5 bg-white border border-gray-600 relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}>
                                        <div className="absolute bottom-0 w-full bg-black transition-all duration-75" style={{ height: `${level}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-1">
                                <div className="flex-1 bg-black h-10 flex items-center justify-center border-2 border-gray-500 relative overflow-hidden">
                                    <span className="text-xl font-mono text-amber-500 tracking-widest z-10" style={{ textShadow: '0 0 5px #f59e0b' }}>
                                        {level.toFixed(2)}
                                    </span>
                                    <div className="absolute top-0 w-full h-1/2 bg-white opacity-10"></div>
                                </div>
                                <div className="flex flex-col justify-between w-5 py-0.5">
                                    {['▲', 'SET', '▼'].map((btn, i) => (
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

            {/* CALCULATED VALUES */}
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
                    <div className="text-xl font-mono font-bold text-blue-600">{level.toFixed(2)}%</div>
                </div>
            </div>
        </div>
    );
}
