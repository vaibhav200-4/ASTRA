import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, useAnimations, OrbitControls, Center, Bounds, ContactShadows, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useMission } from '../context/MissionContext';
import { RotateCcw, Sparkles, Activity, AlertTriangle, Shuffle, RotateCw } from 'lucide-react';

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
  const { actions, names } = useAnimations(gltf.animations, groupRef);

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
        tex.needsUpdate = true;
      }
    });
    if (textures.diffuse0) textures.diffuse0.colorSpace = THREE.SRGBColorSpace;
    if (textures.diffuse1) textures.diffuse1.colorSpace = THREE.SRGBColorSpace;
  }, [textures]);

  useEffect(() => {
    if (gltf && gltf.scene) {
      const bbox = new THREE.Box3().setFromObject(gltf.scene);
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const bboxStr = `${size.x.toFixed(2)}m × ${size.y.toFixed(2)}m × ${size.z.toFixed(2)}m`;

      let meshIdx = 0;
      const appliedMaterials: string[] = [];

      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (meshIdx === 0) {
            mesh.material = new THREE.MeshStandardMaterial({
              map: textures.diffuse0,
              normalMap: textures.normal0,
              roughnessMap: textures.roughness0,
              roughness: 0.6,
              metalness: 0.2,
              name: 'Astronaut_Suit_Body',
            });
            appliedMaterials.push('Astronaut_Suit_Body');
          } else if (meshIdx === 1) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#111622'),
              roughness: 0.1,
              metalness: 0.95,
              name: 'Visor_Glass_Metallic',
            });
            appliedMaterials.push('Visor_Glass_Metallic');
          } else if (meshIdx === 2) {
            mesh.material = new THREE.MeshStandardMaterial({
              map: textures.diffuse1,
              normalMap: textures.normal1,
              roughnessMap: textures.roughness1,
              roughness: 0.5,
              metalness: 0.3,
              name: 'Boots_LifeSupport_Pack',
            });
            appliedMaterials.push('Boots_LifeSupport_Pack');
          }
          meshIdx++;
        }
      });

      if (onLoadInfo) {
        onLoadInfo({
          bbox: bboxStr,
          materialsCount: appliedMaterials.length,
          texturesValid: true,
          animations: names,
        });
      }
    }
  }, [gltf, textures, names, onLoadInfo]);

  useEffect(() => {
    if (actions) {
      Object.keys(actions).forEach((key) => {
        actions[key]?.fadeOut(0.3);
      });

      const targetAction = actions[currentAnim] || actions['floating'] || actions[names[0]];
      if (targetAction) {
        targetAction.reset().fadeIn(0.3).play();
      }
    }
  }, [actions, currentAnim, names]);

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Micro Floating Sway for Zero-G Animation
function FloatingRig({ children }: { children: React.ReactNode }) {
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rigRef.current) {
      const t = state.clock.getElapsedTime();
      rigRef.current.position.y = Math.sin(t * 1.5) * 0.05;
      rigRef.current.rotation.z = Math.sin(t * 0.8) * 0.02;
    }
  });

  return <group ref={rigRef}>{children}</group>;
}

// Loading Fallback Spinner
function LoaderFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-[#080d19]/95 border border-cyan-500/50 rounded-xl backdrop-blur-md shadow-2xl font-sans text-xs text-white space-y-2 min-w-[220px]">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <Sparkles className="text-cyan-400 animate-pulse" size={16} />
        </div>
        <div className="font-bold text-cyan-300 tracking-wider text-xs">LOADING 3D ASTRONAUT & CORRIDOR</div>
        <div className="text-[11px] text-slate-400 font-mono">Loading GLB & PBR Models...</div>
      </div>
    </Html>
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

  const [autoRotate, setAutoRotate] = useState<boolean>(autoRotateDefault);
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
      deviationAlert ? 'border-red-500 shadow-red-950/50' : 'border-slate-800'
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

      {/* Viewport Top Header Overlay Bar */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none text-xs">
        <div className="flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-700/80 text-white font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-300">3D GLB VIEWPORT</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400">POSE ANGLE: {poseAngle}°</span>
        </div>

        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={randomizeOrientation}
            className="bg-[#F26B21] hover:bg-[#d95914] text-white px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
            title="Tumble astronaut orientation in microgravity"
          >
            <Shuffle size={12} />
            <span>Randomize</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors"
            title="Reset Camera & Pose"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setShowEnvironment(!showEnvironment)}
            className={`px-2 py-1 rounded text-xs font-semibold border transition-all ${
              showEnvironment ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60' : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            {showEnvironment ? 'Corridor ON' : 'Corridor OFF'}
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Spec Bar */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/90 px-3 py-1 rounded border border-slate-800 text-[11px] font-mono text-slate-300 pointer-events-none">
        <span className="text-emerald-400 font-bold">GLB PATH: /modules/Astronaut.glb</span>
        <span className="text-slate-400">BOUNDS: {modelInfo?.bbox || '1.84m × 1.92m × 0.88m'}</span>
      </div>
    </div>
  );
};

// Preload GLB models to eliminate loading lag
useGLTF.preload('/modules/Astronaut.glb');
useGLTF.preload('/modules/spacecorridor_BY_HN.glb');
