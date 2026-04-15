# 💰 MoneyThrift Manager: Full-Stack Containerized System

A modern, responsive thrift and savings management application built with the MERN stack. This project has been fully containerized using Docker to demonstrate a production-ready DevOps workflow.

## 🚀 DevOps & Infrastructure Highlights
* **Containerization:** Multi-container architecture using Docker.
* **Orchestration:** Orchestrated with Docker Compose for seamless Service Discovery.
* **Web Server:** Production-grade Nginx configuration to serve the React frontend.
* **Automation:** Integrated Bash scripts for system health monitoring.

---

## 🛠 Tech Stack
* **Frontend:** React.js, Vite, TypeScript, Styled Components
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Infrastructure:** Docker, Docker Compose, Nginx, Bash

---

## 📦 Getting Started (The Docker Way)

To run this entire system (Frontend, Backend, and Database) with a single command, ensure you have **Docker Desktop** installed, then run:

```bash
docker-compose up --build

#📂 Project Structure
├── backend/            # Express.js API logic
├── src/                # React/TypeScript Frontend
├── scripts/            # DevOps automation & health scripts
├── Dockerfile.frontend # Multi-stage build for React/Nginx
├── Dockerfile.backend  # Node.js production environment
└── docker-compose.yml  # Infrastructure-as-Code (IaC) manager
# 🛡 System Monitoring
chmod +x scripts/monitor.sh
./scripts/monitor.sh

##👤 Author
LAMBE FAVOUR
