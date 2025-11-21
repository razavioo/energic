# Deployment Guide

## Option 1: Render.com (Recommended)
1.  Push this code to a GitHub repository.
2.  Log in to [Render.com](https://render.com).
3.  Click **"New +"** -> **"Blueprint"**.
4.  Connect your repository.
5.  Render will automatically detect `render.yaml` and deploy all 4 services:
    *   **Broker**: The MQTT Server.
    *   **Sensor**: The background worker.
    *   **Admin**: The Next.js Dashboard.
    *   **Visualizer**: The Static React Site.

## Option 2: Docker (VPS)
1.  SSH into your VPS.
2.  Clone the repository.
3.  Run:
    ```bash
    docker-compose up -d --build
    ```
4.  Your services will be available at:
    *   Visualizer: `http://<vps-ip>:5173`
    *   Admin: `http://<vps-ip>:3000`

## Notes
- **Environment Variables**: The `render.yaml` automatically links the services.
- **Persistence**: The simulator state is in-memory. If the sensor restarts, the level resets.
