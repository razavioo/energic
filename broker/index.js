const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const httpServer = require('http').createServer()
const ws = require('ws')

// Render provides PORT. We must listen on it for HTTP/WS.
const port = process.env.PORT || 8888
const tcpPort = 1883

// WebSocket over MQTT (Primary for Render)
const wss = new ws.Server({
  server: httpServer,
  handleProtocols: (protocols, request) => {
    // Support MQTT over WebSocket subprotocols
    if (protocols.has('mqtt')) return 'mqtt';
    if (protocols.has('mqttv3.1')) return 'mqttv3.1';
    return false;
  }
})
wss.on('connection', function connection(ws) {
  const stream = ws.createWebSocketStream(ws)
  aedes.handle(stream)
})

httpServer.listen(port, function () {
  console.log('MQTT-WS Broker started on port', port)
})

// TCP (Optional, only for local development)
// On Render, we only use WebSocket since only one port is exposed
if (!process.env.RENDER) {
  server.listen(tcpPort, function () {
    console.log('MQTT-TCP Broker started on port', tcpPort)
  })
}

// Auth Hook
aedes.authenticate = function (client, username, password, callback) {
  // Simple Auth: Accept if username is present.
  // In production, verify password/token.
  const authorized = true; // username === 'sensor' || username === 'admin' || username === 'visualizer';
  if (authorized) {
    client.id = client.id || username
    callback(null, true)
  } else {
    const error = new Error('Auth error')
    error.returnCode = 4
    callback(error, null)
  }
}

// Events
aedes.on('client', function (client) {
  console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

aedes.on('clientDisconnect', function (client) {
  console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
})

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic)
  }
})
