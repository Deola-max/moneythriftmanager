#!/bin/bash
echo "--- MoneyThrift System Status ---"
# Check if containers are running
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "--- Checking API Connectivity ---"
# Check if the backend is actually responding
curl -s localhost:5000 > /dev/null && echo "Backend API: ONLINE ✅" || echo "Backend API: OFFLINE ❌"