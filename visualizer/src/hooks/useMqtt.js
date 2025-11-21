import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

export function useMqtt(brokerUrl, topic) {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        console.log('Connecting to MQTT broker:', brokerUrl);
        const client = mqtt.connect(brokerUrl, {
            keepalive: 30,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
        });

        client.on('connect', () => {
            console.log('Connected to MQTT');
            setIsConnected(true);
            client.subscribe(topic, (err) => {
                if (err) console.error('Subscription error:', err);
            });
        });

        client.on('message', (t, message) => {
            if (t === topic) {
                try {
                    const payload = JSON.parse(message.toString());
                    setData(payload);
                } catch (e) {
                    console.error('Failed to parse MQTT message', e);
                }
            }
        });

        client.on('error', (err) => {
            console.error('MQTT Error:', err);
            setIsConnected(false);
        });

        client.on('offline', () => {
            setIsConnected(false);
        });

        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.end();
            }
        };
    }, [brokerUrl, topic]);

    const sendCommand = (commandTopic, command) => {
        if (clientRef.current && isConnected) {
            clientRef.current.publish(commandTopic, JSON.stringify(command));
        }
    };

    return { data, isConnected, sendCommand };
}
