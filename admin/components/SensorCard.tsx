import React from 'react';
import { SensorData } from '../types';
import { Activity, Battery, Droplets, Power, Settings, Trash2, Volume2 } from 'lucide-react';

interface SensorCardProps {
    id: string;
    data: SensorData | null;
    isConnected: boolean;
    onCommand: (cmd: any) => void;
}

export default function SensorCard({ id, data, isConnected, onCommand }: SensorCardProps) {
    if (!data) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-gray-100 rounded mb-4"></div>
                <div className="flex justify-between">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        {id}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-gray-900">{data.percentage.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Level</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${data.percentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${data.percentage}%` }}
                ></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Droplets className="w-3 h-3" /> Volume</div>
                    <div className="font-mono font-bold">{data.level.toFixed(0)} L</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 flex items-center gap-1 mb-1"><Settings className="w-3 h-3" /> Capacity</div>
                    <div className="font-mono font-bold">{data.capacity} L</div>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onCommand({ action: data.isFilling ? 'STOP_FILL' : 'START_FILL' })}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors ${data.isFilling
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                >
                    <Power className="w-4 h-4" />
                    {data.isFilling ? 'Stop Fill' : 'Start Fill'}
                </button>

                <button
                    onClick={() => onCommand({ action: data.isEmptying ? 'STOP_EMPTY' : 'START_EMPTY' })}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors ${data.isEmptying
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                >
                    <Trash2 className="w-4 h-4" />
                    {data.isEmptying ? 'Stop Empty' : 'Start Empty'}
                </button>
            </div>
        </div>
    );
}
