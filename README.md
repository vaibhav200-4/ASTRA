# ASTRA-PVT (Astronaut Protocol Tracking & Validation System)
**ISRO • Department of Space • On-Board BAS Experiments (SIH 2026 PS174)**

ASTRA-PVT is a space-grade, offline-first mission operations dashboard and edge AI tracking prototype designed for ISRO's microgravity payload experiments on the Bharatiya Antariksh Station (BAS).

---

## 🚀 Key Features & Architectural Highlights

- **100% Offline Edge Architecture**: Operates fully offline without external CDN dependencies, remote APIs, or cloud calls. All fonts and libraries are bundled locally.
- **YOLO26n Edge AI (NMS-free)**: Zero-latency edge object detection for payload equipment and tools.
- **Microgravity 3D Rack Pose Estimator**: ArUco fiducial marker-anchored rigid transformation ($J_{\text{rack}} = R^T(J_{\text{cam}} - t)$) ensuring invariant pose validation regardless of astronaut orientation ("no fixed up").
- **Causal State Verification**: 3-way multi-modal evidence validation (hand proximity + bounding box overlap + payload state change).
- **Bayesian Hypothesis Evidence Engine**: Jeffreys scale Bayes Factor $K$ evidence accumulation.
- **Dempster-Shafer Multi-Sensor Fusion**: Conflict-tolerant sensor fusion ($K < 0.50$).
- **FSM Protocol Validator**: Finite State Machine enforcing expected procedural execution, detecting `SKIPPED`, `REPEATED`, `OUT_OF_ORDER`, and `UNVERIFIED` steps.
- **Thermal-Decoupled dt-Kalman Filter**: Position tracking continuity under thermal throttling (24 → 8 FPS).
- **Triple Modular Redundancy (TMR)**: 3-copy SRAM majority voting for cosmic ray Single Event Upset (SEU) bit-flip scrubbing.
- **DO-178C / FDIR Traceability Matrix**: Software safety hazard and mitigation alignment.

---

## ⏱️ 3-Minute SIH Demo & Pitch Script

### **Minute 0:00 – 0:45 | Overview & Microgravity Problem Statement**
1. Launch `npm run dev` and open `http://localhost:5173`.
2. Highlight top header: **ISRO • Department of Space** logo, live Mission Elapsed Time (MET), and local offline status.
3. Show the **Overview Command Dashboard**:
   - Point to top KPI cards (Steps Verified, Bayes Factor $K$, Fusion Conflict, FPS, Latency, Alerts).
   - Point to central 2D/3D Dual Viewport displaying the payload rack and astronaut position.
   - Show the 6-node Pipeline Strip (`CAMERA` → `PERCEIVE` → `VERIFY` → `FUSE` → `VALIDATE` → `RESPOND`). Click any node to open live detail drawer.

### **Minute 0:45 – 1:30 | 3D Rack Pose & Protocol FSM Deviations**
1. Press `5` or click **Rack Pose** in sidebar:
   - Click **"Randomize Astronaut Pose Angle"** to rotate the 3D GLB astronaut mesh.
   - Point out that while camera-frame coordinates $(X, Y, Z)_{\text{cam}}$ shift dramatically, the calculated rack-frame coordinates $(X, Y, Z)_{\text{rack}}$ remain 100% constant!
2. Press `3` or click **Protocol** in sidebar:
   - View the interactive SVG FSM state graph.
   - Click **"Simulate Skip Step"** in the bottom control bar.
   - Observe the immediate red alert badge: `TRANSITION: SKIPPED (CRITICAL)` and state flash.
   - Click **"Recover FSM State"** to restore nominal tracking.

### **Minute 1:30 – 2:30 | Edge Hardware Reliability & TMR Bit-Flip**
1. Press `8` or click **System** in sidebar:
   - Drag the **Thermal Throttle Load** slider from 0% to 100%. Watch frame rate adapt while the $dt$-based Kalman filter maintains position continuity.
   - Click **"Inject Cosmic Bit-Flip (SEU)"** in the TMR panel. Watch SRAM Copy 02 flash red (`CORRUPT`) and immediately get scrubbed back to `OK` by 2-vs-1 majority voting!
   - Show the ROI Compute Savings chart (~80% reduction in GFLOPS).

### **Minute 2:30 – 3:00 | Architecture & DO-178C Compliance**
1. Press `9` or click **Architecture** in sidebar:
   - Show the 6-node system block diagram and DO-178C / FDIR traceability matrix table.
   - Note the model stack specification: *"YOLO26n deployed on edge; RF-DETR used offline for auto-annotation only."*
2. Press `S` key at any time to open the **Simulation & Stress Test Drawer**.

---

## 💻 Technical Setup & Local Execution

### **Prerequisites**
- Node.js v18+ and npm v9+

### **Installation & Execution**
```bash
# Install local npm dependencies
npm install

# Run Vite local development server
npm run dev

# Run unit test suite
npm test

# Build production bundle
npm run build
```

---

## 📜 Disclaimer
*Interface designed as an experimental mission-control research prototype for Smart India Hackathon 2026 (Problem Statement PS174 / SIH26174) and does not represent an official ISRO operational system or product. DO-178C-aligned traceability is maintained for engineering rigor and does not constitute a formal flight certification claim.*