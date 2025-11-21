const mqtt = require('mqtt');

const BROKER_URL = 'mqtt://broker.emqx.io:1883';
const TOPIC_DATA = 'energic-test-user/device/silo-01/data';
const TOPIC_COMMAND = 'energic-test-user/device/silo-01/command';

console.log('Connecting to Broker at', BROKER_URL);
const client = mqtt.connect(BROKER_URL, {
    clientId: 'test-verifier',
    username: 'admin',
    password: 'password'
});

let dataReceived = false;

client.on('connect', () => {
    console.log('✅ Connected to Broker');

    client.subscribe(TOPIC_DATA, (err) => {
        if (!err) {
            console.log(`✅ Subscribed to ${TOPIC_DATA}`);
            console.log('Waiting for data...');
        } else {
            console.error('❌ Subscription failed', err);
            process.exit(1);
        }
    });

    // Send a test command
    setTimeout(() => {
        console.log('Sending START_FILL command...');
        client.publish(TOPIC_COMMAND, JSON.stringify({ action: 'START_FILL' }));
    }, 2000);
});

client.on('message', (topic, message) => {
    if (topic === TOPIC_DATA) {
        const data = JSON.parse(message.toString());
        console.log('✅ Received Data:', data);

        if (data.isFilling) {
            console.log('✅ System is responding to commands (isFilling: true)');
            console.log('🎉 VERIFICATION SUCCESSFUL');
            client.end();
            process.exit(0);
        }

        if (!dataReceived) {
            dataReceived = true;
        }
    }
});

setTimeout(() => {
    console.error('❌ Timeout: No data received after 10 seconds');
    client.end();
    process.exit(1);
}, 15000);
