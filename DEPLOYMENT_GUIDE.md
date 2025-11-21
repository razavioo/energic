# Deployment Guide for Render.com

This project is configured as a Monorepo and is ready to be deployed to Render.com using a "Blueprint".

## Prerequisites
1.  Push your code to a GitHub or GitLab repository.
2.  Create a Render.com account.

## Deployment Steps

1.  **New Blueprint Instance**:
    *   Go to your Render Dashboard.
    *   Click **New +** -> **Blueprint**.
    *   Connect your repository.
    *   Render will automatically detect the `render.yaml` file.

2.  **Service Configuration**:
    *   Render will propose creating 4 services:
        *   `energic-broker` (Web Service)
        *   `energic-sensor` (Background Worker)
        *   `energic-admin` (Web Service)
        *   `energic-visualizer` (Static Site)
    *   **CRITICAL**: Ensure the Broker service is named `energic-broker`. If Render forces a unique name (e.g., `energic-broker-xyz`), you MUST update the `BROKER_URL` environment variable in the other 3 services to match: `wss://energic-broker-xyz.onrender.com`.

3.  **Deploy**:
    *   Click **Apply**. Render will build and deploy all services.

## Verification

1.  **Check Broker**: Open the URL for `energic-broker`. It should say "Not Found" (since it's a WebSocket server), but it means it's running.
2.  **Check Visualizer**: Open the URL for `energic-visualizer`. It should load the Silo Monitor.
3.  **Check Admin**: Open the URL for `energic-admin`. It should load the Dashboard.
4.  **Verify Connection**: Both apps should show "Connected" (Green status). If they show "Disconnected", check the `BROKER_URL` environment variable in their settings on Render.

## Troubleshooting

*   **Connection Failed**: Ensure `BROKER_URL` starts with `wss://` (Secure WebSocket) and matches your deployed broker's URL.
*   **CORS Issues**: The broker is configured to accept connections from any origin, so CORS should not be an issue.
