import React from 'react';

export default function Configuration({
    liquidColor, setLiquidColor,
    capacity, setCapacity,
    hardness, setHardness,
    unit, setUnit
}) {
    return (
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
    );
}
