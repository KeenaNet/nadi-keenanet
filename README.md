# NADI — The Intelligence Core of KeenaNet
> **Interactive 3D Sci-Fi Experience**  
> *Network • Automation • Development • Intelligence*

---

## ⚡ Overview

**NADI** is the AI Technical Co-Pilot, Engineering Partner, and AI Orchestrator running via **OpenClaw** on the **KeenaNet** homelab ecosystem.

This application is a real-time, interactive 3D WebGL cinematic experience built with **Three.js**, **React**, and **TypeScript**. It visualizes NADI as a futuristic humanoid male AI engineering guardian, his neural synapses, homelab ecosystem topology, and interactive command terminal.

---

## 🌟 Key Features & Scenes

### 1. Scene 1 — NADI Awakening
- Cinematic power-on boot sequence with live diagnostic console.
- Particle convergence, kernel loading simulation, and audio chimes generated via the Web Audio API.
- Quick **"INITIALIZE NADI"** launch or **"SKIP SEQUENCE"**.

### 2. Scene 2 — NADI Interactive Avatar
- **Procedural 3D Humanoid Male AI**:
  - Dark titanium robotic cranial chassis with beveled cheekbones and chiselled jawline.
  - Matte graphite chest armor, chrome cervical vertebrae, and hydraulic neck pistons.
  - Glowing electric-cyan optical matrices with subtle eye glow pulsing.
  - **Chest Neural Arc Reactor**: Multi-tier counter-rotating rings and glowing crystal core.
  - **Dynamic Head Tracking**: Smoothly tracks user mouse/touch position with exponential damping (`THREE.MathUtils.damp`).
  - **Idle Breathing & Hovering**: Procedural physics oscillation.
  - **Direct Interaction**: Orbit rotation (drag), zoom with boundary clamps (scroll), click chest reactor to trigger Neural Synapses, double-click to reset camera.

### 3. Scene 3 — Neural Intelligence Network
- 3D spatial network orbiting around NADI across 7 key disciplines:
  1. **AI Engineering** (OpenClaw, Multi-Agent Mesh, RAG)
  2. **Software Development** (TypeScript, React, Python microservices)
  3. **Network Infrastructure** (MikroTik RouterOS, WireGuard, VLANs)
  4. **Cybersecurity** (Zero-Trust Access, Fail2ban, Hardened Firewalls)
  5. **Automation** (n8n pipelines, GoWA WhatsApp automation)
  6. **DevOps & Systems** (Docker, CasaOS, Coolify, Ubuntu Server)
  7. **Data Intelligence** (Prometheus, Grafana, PostgreSQL)
- Real-time traveling data pulses along network links.
- Interactive telemetry inspector modal on node click.

### 4. Scene 4 — KeenaNet Ecosystem Topology
- Holographic 3D topology visualising 17 homelab nodes across 4 concentric zones:
  - **Infrastructure**: Ubuntu Server, Docker, CasaOS, OpenClaw
  - **Services**: n8n, GoWA, Nextcloud, Immich, Jellyfin, Grafana
  - **Development**: Codex, Cursor, OpenCode, Git
  - **Network**: MikroTik, WireGuard VPN, Local VLANs, Remote Access
- Fiber-optic connection lines leading into NADI's central processing hub.
- Deep-dive inspector displaying operational roles, port numbers, tech stacks, and NADI relationships.

### 5. Scene 5 — AI Command Interface
- Cyberpunk command terminal with typing effects, command history, and realistic latency telemetry.
- One-click presets:
  - `Analyze KeenaNet Architecture`
  - `Inspect Automation Workflows`
  - `Explore AI Coding Agents`
  - `Show Network Topology`
  - `Explain NADI Capabilities`
  - `Diagnose Homelab Server Load`
  - `Audit Zero-Trust Security`
- Interactive command input supporting free-form technical questions.
- Built-in abstraction layer ready for live OpenClaw FastMCP WebSocket bridge.

### 6. Scene 6 — Identity & Core Principles
- Storytelling section explaining the NADI acronym, mission, and philosophy:
  > *"Think critically. Build deliberately. Automate responsibly."*
- Interactive breakdown of the **6 Core Engineering Principles**:
  1. *Truth over agreement*
  2. *Engineering over guesswork*
  3. *Stability before novelty*
  4. *Automation with accountability*
  5. *Security by design*
  6. *Human approval for high-impact operations*

---

## 🛠️ Technical Architecture & Design Rules

- **Zero-Dependency Web Audio API**: Procedural synthesizer generating sci-fi chirps, clicks, transition sweeps, and low-frequency reactor drones with no external audio file downloads.
- **Studio PBR Lighting**:
  - `ACESFilmicToneMapping` with `SRGBColorSpace`.
  - `RoomEnvironment` procedural studio reflection map compiled with `PMREMGenerator`.
  - 3-point lighting: Warm directional key light, cool hemisphere ambient fill, electric cyan rim light.
  - Soft radial contact shadow plane beneath the model.
- **Zero Garbage Collection (GC) in Render Loop**: All scratch vectors (`_vec3`, `_raycaster`, `_mouse`, `_camPos`) are pre-allocated at module scope.
- **Ergonomic Collapsible Bottom Dock**: Compact horizontal control dock pinned to bottom center (`max-width: min(940px, 94vw)`), leaving 100% of the 3D viewport unobstructed. Toggle with **[H]** key.
- **Homelab Optimization (Dell OptiPlex 3050 Micro)**:
  - Client-side WebGL rendering.
  - Static Nginx production container consuming **< 30MB RAM** and **0% server GPU**.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+ or 22+
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🐳 Deployment (Docker & Homelab)

### Option A: Docker Compose
```bash
docker compose up -d --build
```
Access the application on port `3000` (e.g. `http://<homelab-ip>:3000`).

### Option B: Coolify Deployment (Recommended for KeenaNet)
1. In your Coolify dashboard, create a new **Application** -> **From Git Repository** or **Dockerfile**.
2. Set Build Pack: `Dockerfile`.
3. Set Exposed Port: `80` (or map host port `3000`).
4. Set Resource Limits:
   - Memory: `256MB`
   - CPU: `1.0 vCPU`
5. Click **Deploy**. Coolify will execute the multi-stage build and serve the optimized static bundle via Nginx.

### Option C: CasaOS Custom App
1. Go to CasaOS App Store -> Click **Custom Install**.
2. Set Docker Image: `keenanet-nadi-3d:latest` (built locally via `docker build -t keenanet-nadi-3d .`).
3. Set Web UI Port: `80` mapped to host `3000`.
4. Set App Name: `NADI 3D Experience`.
5. Submit.

---

## 🧩 Future Extensibility: Custom 3D Model (.GLB) Drop-in
If a custom high-poly 3D humanoid `.glb` model is exported in the future:
1. Place `nadi_avatar.glb` in `/public/models/`.
2. In `src/three/NadiModel.ts`, replace or augment `this.group` using Three.js `GLTFLoader`.
3. The lighting, environment reflection, OrbitControls, and camera presets will automatically light and frame the model seamlessly.
