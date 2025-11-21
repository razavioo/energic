import React from 'react';

export default function ControlPanel({ isSimulating, onToggleSimulation, onManualControl, level }) {
    return (
        <div className="bg-gray-800 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">Remote Simulation</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onToggleSimulation('START_FILL')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all bg-green-500 hover:bg-green-600`}
                    >
                        FILL
                    </button>
                    <button
                        onClick={() => onToggleSimulation('START_EMPTY')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all bg-red-500 hover:bg-red-600`}
                    >
                        EMPTY
                    </button>
                    <button
                        onClick={() => onToggleSimulation('STOP')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all bg-gray-500 hover:bg-gray-600`}
                    >
                        STOP
                    </button>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Manual Level Set</label>
                <input
                    type="range" min="0" max="100" step="0.01"
                    value={level}
                    onChange={(e) => onManualControl(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>
        </div>
    );
}
