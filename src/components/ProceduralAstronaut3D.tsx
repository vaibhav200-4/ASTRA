import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useMission } from '../context/MissionContext';
import { Activity, RotateCcw, Compass, Shuffle } from 'lucide-react';

interface ProceduralAstronaut3DProps {
  onRandomizeOrientation?: () => void;
}

// Procedural 3D Astronaut constructed purely from Three.js Geometries (No GLTF/CDN)
function ProceduralAstronautMesh({ poseAngle }: { poseAngle: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bodyRef.current) {
      const t = state.clock.getElapsedTime();
      bodyRef.current.position.y = Math.sin(t * 1.2) * 0.08;
      bodyRef.current.rotation.z = Math.sin(t * 0.7) * 0.04;
      bodyRef.current.rotation.x = Math.cos(t * 0.5) * 0.03;
    }
  });

  const rad = (poseAngle * Math.PI) / 180;

  return (
    <group ref={groupRef} rotation={[0, rad, 0]}>
      <group ref={bodyRef}>
        {/* Torso Suit */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.32, 0.65, 16, 32]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Chest Control Pack */}
        <mesh position={[0, 0.1, 0.28]}>
          <boxGeometry args={[0.3, 0.25, 0.12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Chest Indicators */}
        <mesh position={[-0.08, 0.14, 0.35]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <mesh position={[0, 0.14, 0.35]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        <mesh position={[0.08, 0.14, 0.35]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshBasicMaterial color="#06B6D4" />
        </mesh>

        {/* Helmet */}
        <mesh position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Helmet Visor */}
        <mesh position={[0, 0.64, 0.12]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color="#0F172A" roughness={0.05} metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.64, 0.13]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.19, 0.015, 16, 32]} />
          <meshStandardMaterial color="#F26B21" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Backpack (Life Support System) */}
        <mesh position={[0, 0.15, -0.3]}>
          <boxGeometry args={[0.48, 0.65, 0.22]} />
          <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Shoulders */}
        <mesh position={[-0.38, 0.3, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#123F8C" roughness={0.5} />
        </mesh>
        <mesh position={[0.38, 0.3, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#123F8C" roughness={0.5} />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.42, 0.05, 0.1]} rotation={[0.4, 0, -0.2]}>
          <capsuleGeometry args={[0.09, 0.35, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
        </mesh>
        <mesh position={[0.42, 0.1, 0.2]} rotation={[0.8, 0.2, 0.3]}>
          <capsuleGeometry args={[0.09, 0.35, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
        </mesh>

        {/* Gloves */}
        <mesh position={[-0.45, -0.18, 0.24]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#F26B21" roughness={0.6} />
        </mesh>
        <mesh position={[0.48, -0.05, 0.4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#F26B21" roughness={0.6} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.18, -0.55, -0.05]} rotation={[-0.2, 0, 0.1]}>
          <capsuleGeometry args={[0.11, 0.45, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
        </mesh>
        <mesh position={[0.18, -0.55, 0.05]} rotation={[0.1, 0, -0.1]}>
          <capsuleGeometry args={[0.11, 0.45, 16, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
        </mesh>

        {/* Boots */}
        <mesh position={[-0.2, -0.9, 0.02]}>
          <boxGeometry args={[0.15, 0.12, 0.25]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>
        <mesh position={[0.2, -0.88, 0.12]}>
          <boxGeometry args={[0.15, 0.12, 0.25]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// Procedural Payload Rack Frame & Coordinate Axes
function PayloadRackFrame3D() {
  return (
    <group position={[0, 0, -0.5]}>
      {/* Outer Rack Box Wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3.2, 2.4, 2.0)]} />
        <lineBasicMaterial color="#123F8C" transparent opacity={0.4} linewidth={1} />
      </lineSegments>

      {/* ArUco Marker Plane on Rear Wall */}
      <mesh position={[-1.2, 0.8, -0.98]}>
        <planeGeometry args={[0.35, 0.35]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-1.2, 0.8, -0.97]}>
        <planeGeometry args={[0.28, 0.28]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-1.23, 0.83, -0.96]}>
        <planeGeometry args={[0.12, 0.12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-1.17, 0.77, -0.96]}>
        <planeGeometry args={[0.1, 0.1]} />
        <meshBasicMaterial color="#F26B21" />
      </mesh>

      {/* Rack Origin Coordinate Axes */}
      <group position={[-1.4, -1.0, -0.8]}>
        {/* X Axis Red */}
        <line>
          <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0.5,0,0)])} />
          <lineBasicMaterial attach="material" color="#EF4444" linewidth={3} />
        </line>
        {/* Y Axis Green */}
        <line>
          <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0.5,0)])} />
          <lineBasicMaterial attach="material" color="#10B981" linewidth={3} />
        </line>
        {/* Z Axis Blue */}
        <line>
          <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0.5)])} />
          <lineBasicMaterial attach="material" color="#06B6D4" linewidth={3} />
        </line>
      </group>
    </group>
  );
}

export const ProceduralAstronaut3D: React.FC<ProceduralAstronaut3DProps> = ({ onRandomizeOrientation }) => {
  const { poseAngle, randomizeOrientation, resetOrientation, fps } = useMission();
  const controlsRef = useRef<any>(null);

  const handleRandomize = () => {
    if (onRandomizeOrientation) onRandomizeOrientation();
    else randomizeOrientation();
  };

  return (
    <div className="relative w-full h-full min-h-[300px] bg-[#040814] rounded overflow-hidden select-none font-sans">
      {/* Radial Sci-Fi Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#123F8C_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0.4, 3.2], fov: 50 }}
        gl={{ antialias: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 4]} intensity={2.0} color="#FFFFFF" />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#06B6D4" />
        <pointLight position={[0, 2, 2]} intensity={1.2} color="#F26B21" />

        {/* 3D Procedural Payload Rack */}
        <PayloadRackFrame3D />

        {/* Procedural Astronaut Mesh */}
        <ProceduralAstronautMesh poseAngle={poseAngle} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableZoom={true}
          enablePan={true}
          minDistance={1.2}
          maxDistance={8}
        />
      </Canvas>

      {/* Viewport Overlay Controls */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none text-xs">
        <div className="flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700/80 text-white font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-400">3D PROCEDURAL VIEW</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400">ANGLE: {poseAngle}°</span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={handleRandomize}
            className="bg-[#F26B21] hover:bg-[#d95914] text-white px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
            title="Tumble astronaut orientation in 3D microgravity"
          >
            <Shuffle size={12} />
            <span>RANDOMIZE ORIENTATION</span>
          </button>

          <button
            onClick={resetOrientation}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Coordinate Telemetry Footnote */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/90 px-3 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-300 pointer-events-none">
        <span className="text-emerald-400 font-bold">RACK AXES: FIXED IN SPACE (J_RACK)</span>
        <span className="text-slate-400">POSE MATRIX: INVARIANT UNDER ROTATION</span>
      </div>
    </div>
  );
};
