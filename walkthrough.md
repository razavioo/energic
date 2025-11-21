# IoT Sensor Simulator - Walkthrough

## Overview
This project is a complete IoT system simulation consisting of 4 components:
1.  **Broker (`broker/`)**: A custom Node.js MQTT Broker (Aedes) supporting both TCP (1883) and WebSockets (8888).
2.  **Sensor (`sensor/`)**: A Node.js service that simulates a Silo sensor. It runs a physics loop (filling/emptying) and publishes data to the broker.
3.  **Visualizer (`visualizer/`)**: The original React frontend, refactored to receive real-time data via MQTT over WebSockets.
4.  **Admin Panel (`admin/`)**: A new Next.js Dashboard to monitor and control the sensors.

## How to Run (Recommended)
The easiest way to run the entire stack is using Docker Compose.

1.  **Start the System**:
    ```bash
    docker-compose up --build
    ```

2.  **Access the Services**:
    - **Visualizer**: [http://localhost:5173](http://localhost:5173) (The Silo Monitor)
    - **Admin Panel**: [http://localhost:3000](http://localhost:3000) (The Control Dashboard)
    - **Broker**: `localhost:1883` (MQTT), `localhost:8888` (WS)

## Manual Verification Steps
1.  Open the **Visualizer**. You should see the silo level changing if the simulation is running.
2.  Open the **Admin Panel**. You should see "silo-01" listed with its current status.
3.  **Control Test**:
    - In the Admin Panel, click **"Start Fill"**.
    - Watch the **Visualizer**: The silo level should rise.
    - Watch the **Admin Panel**: The progress bar should update in real-time.
4.  **Stop Test**:
    - Click **"Stop Fill"** in the Admin Panel.
    - The level should stabilize (with minor noise if configured).

## Architecture
- **Protocol**: MQTT (Message Queuing Telemetry Transport).
- **Transport**: WebSockets for browser clients (Admin/Visualizer), TCP for backend services (Sensor).
- **Security**: The Broker is configured to accept connections. In production, you can enable the auth hook in `broker/index.js`.

## Deployment
To deploy to a VPS or Cloud:
1.  Copy the entire project.
2.  Run `docker-compose up -d`.
3.  Expose ports `3000` (Admin) and `5173` (Visualizer) via a reverse proxy (Nginx/Traefik) with SSL.
