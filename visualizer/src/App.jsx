import React, { useState, useEffect } from 'react';
import SiloVisualizer from './components/SiloVisualizer';
import Indicators from './components/Indicators';
import Configuration from './components/Configuration';
import ControlPanel from './components/ControlPanel';
import { useMqtt } from './hooks/useMqtt';

const BROKER_URL = import.meta.env.VITE_BROKER_URL || 'ws://localhost:8888';
const TOPIC_DATA = 'energic-test-user/device/silo-01/data';
const TOPIC_COMMAND = 'energic-test-user/device/silo-01/command';

export default function UltimateSiloMonitor() {
  // --- 1. User Configuration State ---
  const [liquidColor, setLiquidColor] = useState('#3b82f6');
  const [capacity, setCapacity] = useState(10000);
  const [unit, setUnit] = useState('Liters');
  const [hardness, setHardness] = useState(50);

  // --- 2. MQTT Integration ---
  const { data, isConnected, sendCommand } = useMqtt(BROKER_URL, TOPIC_DATA);

  // --- 3. Derived State ---
  const level = data ? data.percentage : 0;
  const isSimulating = data ? (data.isFilling || data.isEmptying) : false;

  // --- 4. Handlers ---
  const handleToggleSimulation = (action) => {
    if (action === 'STOP') {
      sendCommand(TOPIC_COMMAND, { action: 'STOP_FILL' });
      sendCommand(TOPIC_COMMAND, { action: 'STOP_EMPTY' });
    } else {
      sendCommand(TOPIC_COMMAND, { action });
    }
  };

  const handleManualControl = (value) => {
    sendCommand(TOPIC_COMMAND, { action: 'SET_LEVEL', value });
  };

  // Sync config to simulator (optional, if we want simulator to know capacity)
  useEffect(() => {
    if (isConnected) {
      sendCommand(TOPIC_COMMAND, { action: 'CONFIGURE', capacity, hardness });
    }
  }, [capacity, hardness, isConnected]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center justify-center select-none">

      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 border border-gray-300">

        {/* --- LEFT COLUMN: Visualization --- */}
        <div className="lg:col-span-7">
          <SiloVisualizer
            targetLevel={level}
            liquidColor={liquidColor}
            hardness={hardness}
            capacity={capacity}
          />
          <div className="mt-2 text-center text-xs text-gray-400">
            Status: <span className={isConnected ? "text-green-500" : "text-red-500"}>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Controls & Config --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          <Indicators
            level={level}
            capacity={capacity}
            unit={unit}
            liquidColor={liquidColor}
          />

          <Configuration
            liquidColor={liquidColor} setLiquidColor={setLiquidColor}
            capacity={capacity} setCapacity={setCapacity}
            hardness={hardness} setHardness={setHardness}
            unit={unit} setUnit={setUnit}
          />

          <ControlPanel
            isSimulating={isSimulating}
            onToggleSimulation={handleToggleSimulation}
            onManualControl={handleManualControl}
            level={level}
          />

        </div>
      </div>
    </div>
  );
}