import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, useAnimations, OrbitControls, Center, Bounds, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useMission } from '../context/MissionContext';
import { RotateCcw, Activity, Shuffle } from 'lucide-react';

interface ModelProps {
  currentAnim: string;
  showEnvironment: boolean;
  onLoadInfo?: (info: { bbox: string; materialsCount: number; texturesValid: boolean; animations: string[] }) => void;
}

// Inner 3D Space Station Corridor Environment Component
function SpaceCorridorModel() {
  const corridorGltf = useGLTF('/modules/spacecorridor_BY_HN.glb');

  return (
    <primitive
      object={corridorGltf.scene}
      position={[0, -1.2, -1.5]}
      scale={[0.012, 0.012, 0.012]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

// Inner Astronaut 3D Model Component with PBR Textures & Animation Clips
function AstronautModel({ currentAnim, onLoadInfo }: { currentAnim: string; onLoadInfo?: ModelProps['onLoadInfo'] }) {
  const gltf = useGLTF('/modules/Astronaut.glb');
  const groupRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(gltf.animations, groupRef);

  // Load PBR Textures from /modules/
  const textures = useTexture({
    diffuse0: '/modules/gltf_embedded_0.png',
    normal0: '/modules/gltf_embedded_2.png',
    roughness0: '/modules/gltf_embedded_3.png',
    diffuse1: '/modules/gltf_embedded_4.png',
    normal1: '/modules/gltf_embedded_6.png',
    roughness1: '/modules/gltf_embedded_7.png',
  });

  useEffect(() => {
    Object.values(textures).forEach((tex) => {
      if (tex) {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
      }
    });

    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const nameLower = mesh.name.toLowerCase();
        if (nameLower.includes('body') || nameLower.includes('suit') || nameLower.includes('mesh0')) {
          mesh.material = new THREE.MeshStandardMaterial({
            map: textures.diffuse0,
            normalMap: textures.normal0,
            roughnessMap: textures.roughness0,
            roughness: 0.4,
            metalness: 0.2,
          });
        } else if (nameLower.includes('visor') || nameLower.includes('helmet') || nameLower.includes('mesh1')) {
          mesh.material = new THREE.MeshStandardMaterial({
            map: textures.diffuse1,
            normalMap: textures.normal1,
            roughnessMap: textures.roughness1,
            roughness: 0.1,
            metalness: 0.9,
          });
        }
      }
    });

    if (onLoadInfo) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      onLoadInfo({
        bbox: `${size.x.toFixed(2)}m × ${size.y.toFixed(2)}m × ${size.z.toFixed(2)}m`,
        materialsCount: 2,
        texturesValid: true,
        animations: gltf.animations.map(a => a.name),
      });
    }
  }, [gltf, textures, onLoadInfo]);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    Object.values(actions).forEach(a => a?.stop());

    const targetAnimName = Object.keys(actions).find(n => n.toLowerCase().includes(currentAnim.toLowerCase())) || Object.keys(actions)[0];
    if (targetAnimName && actions[targetAnimName]) {
      actions[targetAnimName]?.reset().fadeIn(0.3).play();
    }
  }, [currentAnim, actions]);

  return <primitive ref={groupRef} object={gltf.scene} scale={[1, 1, 1]} />;
}

// Gentle Microgravity Zero-G Floating Motion Wrapper
function FloatingRig({ children }: { children: React.ReactNode }) {
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rigRef.current) {
      const t = state.clock.getElapsedTime();
      rigRef.current.position.y = Math.sin(t * 0.8) * 0.08;
      rigRef.current.rotation.z = Math.sin(t * 0.5) * 0.03;
      rigRef.current.rotation.x = Math.cos(t * 0.6) * 0.02;
    }
  });

  return <group ref={rigRef}>{children}</group>;
}

function LoaderFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#123F8C" wireframe />
    </mesh>
  );
}

interface AstronautViewerProps {
  className?: string;
  autoRotateDefault?: boolean;
}

export const AstronautViewer: React.FC<AstronautViewerProps> = ({
  className = "w-full h-full min-h-[340px]",
  autoRotateDefault = false
}) => {
  const { currentStep, deviationAlert, poseAngle, randomizeOrientation, resetOrientation } = useMission();

  const [autoRotate] = useState<boolean>(autoRotateDefault);
  const [showEnvironment, setShowEnvironment] = useState<boolean>(true);
  const [selectedAnim, setSelectedAnim] = useState<string>('floating');
  const [modelInfo, setModelInfo] = useState<{ bbox: string; materialsCount: number; texturesValid: boolean; animations: string[] } | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (currentStep === 1) setSelectedAnim('idle');
    else if (currentStep === 2) setSelectedAnim('floating');
    else if (currentStep === 3) setSelectedAnim('wave');
  }, [currentStep]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    resetOrientation();
  };

  const radAngle = (poseAngle * Math.PI) / 180;

  return (
    <div className={`relative bg-[#040814] rounded border transition-all duration-300 overflow-hidden shadow-2xl select-none font-sans text-xs ${
      deviationAlert ? 'border-[#FF6B6B] shadow-red-950/50' : 'border-slate-800'
    } ${className}`}>
      {/* Sci-Fi Radial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* R3F Canvas Viewport */}
      <Canvas
        camera={{ position: [0, 1.2, 3.5], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={1.2} color="#38bdf8" />
        <directionalLight position={[0, -5, -5]} intensity={0.6} color="#f59e0b" />

        <Suspense fallback={<LoaderFallback />}>
          <Environment preset="night" />

          {/* 3D Space Corridor (Stays Fixed in Space) */}
          {showEnvironment && <SpaceCorridorModel />}

          {/* Astronaut 3D Model Group (Tumbles under microgravity orientation ONLY) */}
          <group rotation={[0, radAngle, 0]}>
            <Bounds fit clip observe margin={1.2}>
              <Center top>
                <FloatingRig>
                  <AstronautModel currentAnim={selectedAnim} onLoadInfo={setModelInfo} />
                </FloatingRig>
              </Center>
            </Bounds>
          </group>

          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.6}
            scale={10}
            blur={2}
            far={4}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
          enableZoom={true}
          enablePan={true}
          minDistance={1.2}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>

      {/* Viewport Top Header Overlay Bar (High contrast #F1F5F9 on rgba(10,26,51,0.85) backing) */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none text-xs font-sans">
        <div className="flex items-center space-x-2.5 bg-[#0A1A33]/85 backdrop-blur-md px-3 py-1.5 rounded border border-slate-700/80 text-[#F1F5F9] font-mono text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="font-bold text-[#F1F5F9]">3D GLB VIEWPORT</span>
          <span className="text-[#B8C4D6]">|</span>
          <span className="text-[#FFA366] font-bold">POSE ANGLE: {poseAngle}°</span>
        </div>

        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={randomizeOrientation}
            className="bg-[#F26B21] hover:bg-[#d95914] text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
            title="Tumble astronaut orientation in microgravity"
          >
            <Shuffle size={13} />
            <span>Randomize</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="bg-slate-800 hover:bg-slate-700 text-[#F1F5F9] px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
            title="Reset Camera & Pose"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setShowEnvironment(!showEnvironment)}
            className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
              showEnvironment ? 'bg-[#0369A1] text-[#F1F5F9] border-[#7DD3FC]' : 'bg-slate-900 text-[#B8C4D6] border-slate-700'
            }`}
          >
            {showEnvironment ? 'Corridor ON' : 'Corridor OFF'}
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Spec Bar Overlay */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-[#0A1A33]/85 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800 text-xs font-mono text-[#F1F5F9] pointer-events-none">
        <span className="text-[#4ADE80] font-bold">GLB PATH: /modules/Astronaut.glb</span>
        <span className="text-[#B8C4D6] font-bold">BOUNDS: {modelInfo?.bbox || '1.84m × 1.92m × 0.88m'}</span>
      </div>
    </div>
  );
};

// Preload GLB models to eliminate loading lag
useGLTF.preload('/modules/Astronaut.glb');
useGLTF.preload('/modules/spacecorridor_BY_HN.glb');
