#!/bin/bash
echo "------------------------------------------"
echo "💰 MONEY THRIFT SYSTEM MONITOR 💰"
echo "------------------------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "Checking API..."
curl -s localhost:5000 > /dev/null && echo "✅ Backend: ONLINE" || echo "❌ Backend: OFFLINE"
echo "------------------------------------------"
