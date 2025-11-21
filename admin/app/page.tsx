'use client';

import React, { useState, useEffect } from 'react';
import { useMqtt } from '../hooks/useMqtt';
import SensorCard from '../components/SensorCard';
import { LayoutDashboard, Server, ShieldCheck } from 'lucide-react';

const BROKER_URL = process.env.NEXT_PUBLIC_BROKER_URL || 'ws://127.0.0.1:8888';
const TOPIC_DATA = 'energic-test-user/device/+/data'; // Wildcard subscription
const TOPIC_COMMAND_PREFIX = 'energic-test-user/device/';

export default function Dashboard() {
  const { data, isConnected, sendCommand } = useMqtt(BROKER_URL, TOPIC_DATA);
  const [sensors, setSensors] = useState<Record<string, any>>({});

  // Update sensors state when new data arrives
  useEffect(() => {
    if (data) {
      // In a real app, we'd parse the topic to get the ID. 
      // Here, we'll assume data comes from 'silo-01' for now or include ID in payload.
      // Let's assume the hook returns { topic, payload } if we modify it, 
      // or we just hardcode for this demo since the hook is simple.
      // For this demo, let's just update 'silo-01' with the data received.
      setSensors(prev => ({
        ...prev,
        'silo-01': data
      }));
    }
  }, [data]);

  const handleCommand = (id: string, cmd: any) => {
    sendCommand(`${TOPIC_COMMAND_PREFIX}${id}/command`, cmd);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="text-xl font-bold tracking-tight">Energic IoT</span>
        </div>

        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
            <Server className="w-5 h-5" /> Devices
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">
            <ShieldCheck className="w-5 h-5" /> Security
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Monitor and control your industrial sensors.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-600">{isConnected ? 'System Online' : 'System Offline'}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Hardcoded for demo, but would map over sensors state */}
          <SensorCard
            id="silo-01"
            data={sensors['silo-01'] || null}
            isConnected={isConnected}
            onCommand={(cmd) => handleCommand('silo-01', cmd)}
          />

          {/* Placeholder for more sensors */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
            <Server className="w-10 h-10 mb-2 opacity-50" />
            <span className="font-medium">Add New Sensor</span>
          </div>
        </div>
      </main>
    </div>
  );
}
