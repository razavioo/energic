# Energic - Smart Silo Monitoring System

Energic is a robust, real-time IoT monitoring solution designed to track and visualize the fill levels of industrial silos. It uses a microservices architecture to simulate sensor data, transmit it via MQTT, and display it on a modern dashboard and a 3D visualizer.

## 🚀 Features

*   **Real-Time Monitoring**: Live updates of silo fill levels using WebSockets/MQTT.
*   **Interactive Control**: Admin dashboard to start/stop filling and manually set levels.
*   **Visual Feedback**: A dynamic "Visualizer" app that provides a graphical representation of the silo state.
*   **Robust Architecture**: Decoupled services (Broker, Sensor, Admin, Visualizer) for scalability.
*   **Cloud Ready**: Fully configured for one-click deployment on Render.com.

## 🏗 Architecture & Implementation

The project is built as a monorepo containing four distinct services:

1.  **Broker (`/broker`)**:
    *   **Tech**: Node.js, Aedes.
    *   **Role**: The central nervous system. It handles MQTT connections (TCP & WebSocket) and routes messages between the sensor and the frontends.
    *   **Key Feature**: Supports both standard MQTT (for sensors) and MQTT-over-WebSockets (for web apps).

2.  **Sensor (`/sensor`)**:
    *   **Tech**: Node.js.
    *   **Role**: Simulates a physical IoT device. It publishes `silo/level` data and subscribes to `silo/control` commands.
    *   **Logic**: Simulates filling and emptying rates with realistic physics.

3.  **Admin Dashboard (`/admin`)**:
    *   **Tech**: Next.js (App Router), TailwindCSS.
    *   **Role**: The control center. Allows operators to view system status and send commands (e.g., "Start Fill", "Emergency Stop") to the sensor.

4.  **Visualizer (`/visualizer`)**:
    *   **Tech**: React, Vite.
    *   **Role**: A dedicated display unit. It subscribes to the sensor data to render a live animation of the silo level, perfect for a wall-mounted monitor.

## 📂 Project Structure

```
energic/
├── admin/          # Next.js Admin Dashboard
├── broker/         # MQTT Broker Service
├── sensor/         # IoT Sensor Simulator
├── visualizer/     # React Visualization App
├── render.yaml     # Render.com Infrastructure-as-Code
└── docker-compose.yml # Local development orchestration
```

## 🌍 Deployment

### Option 1: Render.com (Recommended)

This project is configured with a `render.yaml` Blueprint for zero-config deployment.

1.  Push this repository to GitHub/GitLab.
2.  Log in to [Render.com](https://render.com).
3.  Click **New +** -> **Blueprint**.
4.  Connect your repository.
5.  Render will detect the `render.yaml` and propose creating 4 services.
6.  Click **Apply**.
    *   *Note: The services are automatically linked via environment variables defined in the blueprint.*

### Option 2: Docker (Self-Hosted)

You can run the entire stack on any VPS or local machine using Docker Compose.

1.  Clone the repository.
2.  Run the stack:
    ```bash
    docker-compose up -d --build
    ```
3.  Access the services:
    *   **Admin**: `http://localhost:3000`
    *   **Visualizer**: `http://localhost:5173`
    *   **Broker**: `mqtt://localhost:1883` (TCP) / `ws://localhost:8888` (WebSocket)

## 🔮 Future Plans

*   **Persistence**: Integrate a database (PostgreSQL/InfluxDB) to store historical level data.
*   **Multi-Silo Support**: Update the schema to support tracking multiple silos simultaneously.
*   **User Authentication**: Secure the Admin dashboard with login functionality.
*   **Alerting**: Send email/SMS notifications when levels reach critical thresholds.
*   **Physical Hardware**: Replace the simulated sensor with an actual ESP32/Ultrasonic sensor.

## 📜 License

**Closed Source / Proprietary**

Copyright © 2025 Energic Systems. All Rights Reserved.

This software is the confidential and proprietary information of Energic Systems. Unauthorized copying, distribution, modification, or use of this file, via any medium, is strictly prohibited.

## 🙌 Special Thanks

*   **Render.com** for the seamless cloud hosting platform.
*   **MQTT.js & Aedes** for the robust messaging capabilities.
*   **Vite & Next.js** for the modern frontend tooling.
