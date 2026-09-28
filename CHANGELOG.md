# CHANGELOG — ASTRA-PVT Upgrade Record

All notable changes to the ASTRA-PVT system prototype for SIH 2026 PS174 are documented here.

---

## [2.0.0] - 2026-09-28

### 🌟 Part 0 — Restored GLB 3D Astronaut Viewport
- Restored original 3D Three.js / React Three Fiber model viewer using local GLB models (`/modules/Astronaut.glb` and `/modules/spacecorridor_BY_HN.glb`).
- Fixed scene axes so the payload corridor, ambient lighting, and rack coordinate axes remain stationary while the astronaut mesh tumbles when `poseAngle` orientation shifts.
- Mounted restored GLB `AstronautViewer` across 3D Viewport mode, Dual Viewport mode, and the Rack Relative Pose page.

### 🎨 Part 1 — Mission Control UI App Shell & Layout
- Replaced header badge with **ISRO • Department of Space** official emblem and branding.
- Added dimmed backdrop overlay (`bg-black/40`) to Simulation Control Drawer with `S` key toggle and `Esc` key listener.
- Restructured layout for 1440x900 and 1280x720 resolutions with non-clipped 4-column right sidebar and high-contrast dark navy cards.
- Enforced minimum 12px font size across body and labels, 14px for card titles, 28-32px for numerical KPIs.
- Isolated one-line pitch statement into a clean dedicated footer row.

### 🔬 Part 2 — Phase 4 Pages (Protocol, Rack Pose, System)
- **Protocol Page**: Interactive SVG FSM state transition diagram with glowing active node, red error flashing, 2 side-by-side aligned lanes (Ground Truth Expected vs Live Observed Sequence), and deviation trigger buttons.
- **Rack Pose Page**: Mounted restored GLB `AstronautViewer` alongside live $R$ transformation matrix, $t$ translation vector, matrix equation $J_{\text{rack}} = R^T(J_{\text{cam}} - t)$, and keypoint transformation comparison table.
- **System Health Page**: Added CPU/GPU/Thermal hardware gauges, $dt$-decoupled Kalman line chart, TMR 3-copy memory voting bit-flip animation, lock-free SPSC ring buffer visualization, and ROI compute savings chart (~80% savings).

### 📊 Part 3 — Phase 5 Pages (Logs, Evaluation, Architecture, Timeline, About)
- **Logs Page**: Filterable table with status severity chips (INFO, WARN, ERROR, FSM), search box, CSV/JSON export, and slide-out JSON telemetry payload drawer.
- **Evaluation Page**: Precision/Recall/F1 bar charts, 2x2/3x3 confusion matrix heatmap, live stress-test checklist, and custom JSON metrics loader.
- **Architecture Page**: Interactive 6-node system pipeline block diagram, DO-178C / FDIR traceability matrix table, and explicit model specification: *"YOLO26n deployed on edge; RF-DETR used offline for auto-annotation only."*
- **Timeline & About Pages**: Timestamped mission chronology, team card, ISRO PS174 overview, and honest prototype vs flight target algorithm breakdown table.

### ⌨️ Part 4 — Keyboard Shortcuts & System Polish
- Added global keyboard shortcuts (keys `1`–`9`, `0` for page navigation, `Space` for play/pause simulation, `S` for simulation drawer, `Esc` to close drawers).
- Created `src/config/thresholds.ts` for central system thresholds configuration.
- Created comprehensive `README.md` with 3-minute demo script.
