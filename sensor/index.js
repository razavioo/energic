const mqtt = require('mqtt');
const Simulator = require('./Simulator');
require('dotenv').config();

// Use WS by default for Render compatibility, or fallback to public broker
const BROKER_URL = process.env.BROKER_URL || 'ws://broker.emqx.io:8083/mqtt';
const DEVICE_ID = process.env.DEVICE_ID || 'silo-01';
const TOPIC_PREFIX = 'energic-test-user';

const simulator = new Simulator({
    capacity: 10000,
    fillRate: 20,
    emptyRate: 15
});

const client = mqtt.connect(BROKER_URL, {
    clientId: DEVICE_ID,
    username: 'sensor',
    password: 'password' // In real app, use env var
});

client.on('connect', () => {
    console.log(`Sensor ${DEVICE_ID} connected to broker at ${BROKER_URL}`);

    // Subscribe to commands
    client.subscribe(`${TOPIC_PREFIX}/device/${DEVICE_ID}/command`, (err) => {
        if (!err) console.log(`Subscribed to ${TOPIC_PREFIX}/device/${DEVICE_ID}/command`);
    });

    // Simulation Loop
    setInterval(() => {
        const state = simulator.tick();
        client.publish(`${TOPIC_PREFIX}/device/${DEVICE_ID}/data`, JSON.stringify(state));
        // console.log('Published state:', state);
    }, 100); // 10Hz update rate
});

client.on('message', (topic, message) => {
    if (topic === `${TOPIC_PREFIX}/device/${DEVICE_ID}/command`) {
        try {
            const cmd = JSON.parse(message.toString());
            console.log('Received command:', cmd);

            switch (cmd.action) {
                case 'START_FILL': simulator.startFill(); break;
                case 'STOP_FILL': simulator.stopFill(); break;
                case 'START_EMPTY': simulator.startEmpty(); break;
                case 'STOP_EMPTY': simulator.stopEmpty(); break;
                case 'SET_LEVEL':
                    if (cmd.value !== undefined) simulator.setLevel(cmd.value);
                    break;
                case 'CONFIGURE':
                    if (cmd.capacity) simulator.capacity = cmd.capacity;
                    if (cmd.hardness) simulator.hardness = cmd.hardness;
                    break;
            }
        } catch (e) {
            console.error('Invalid command format', e);
        }
    }
});

client.on('error', (err) => {
    console.error('MQTT Error:', err);
});
