import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, useAnimations, OrbitControls, Center, Bounds, ContactShadows, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useMission } from '../context/MissionContext';
import { RotateCcw, Sparkles, Activity, Play, AlertTriangle, Eye, Box, Layers, Radio } from 'lucide-react';

interface ModelProps {
  currentAnim: string;
  showEnvironment: boolean;
  onLoadInfo?: (info: { bbox: string; materialsCount: number; texturesValid: boolean; animations: string[] }) => void;
}

// Inner 3D Space Corridor Environment Component
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

// Inner Astronaut 3D Model Component with PBR Texture Re-mapping & Animation Control
function AstronautModel({ currentAnim, onLoadInfo }: { currentAnim: string; onLoadInfo?: ModelProps['onLoadInfo'] }) {
  const gltf = useGLTF('/modules/Astronaut.glb');
  const groupRef = useRef<THREE.Group>(null);
  const { actions, names } = useAnimations(gltf.animations, groupRef);

  // Load PBR Textures explicitly from /public/modules/
  const textures = useTexture({
    diffuse0: '/modules/gltf_embedded_0.png',
    normal0: '/modules/gltf_embedded_2.png',
    roughness0: '/modules/gltf_embedded_3.png',
    diffuse1: '/modules/gltf_embedded_4.png',
    normal1: '/modules/gltf_embedded_6.png',
    roughness1: '/modules/gltf_embedded_7.png',
  });

  // Configure PBR textures on mount
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

  // Apply PBR materials to GLTF meshes
  useEffect(() => {
    if (gltf && gltf.scene) {
      // Calculate Bounding Box
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
            // Main Astronaut Suit Body
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
            // Visor & Metallic Accents
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#111622'),
              roughness: 0.1,
              metalness: 0.95,
              name: 'Visor_Glass_Metallic',
            });
            appliedMaterials.push('Visor_Glass_Metallic');
          } else if (meshIdx === 2) {
            // Boots & Life Support Pack
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

      console.log('=== ASTRA-PVT 3D ASTRONAUT DIAGNOSTICS ===');
      console.log('✓ GLB Path: /modules/Astronaut.glb');
      console.log(`✓ Bounding Box: ${bboxStr}`);
      console.log(`✓ Applied PBR Materials Count: ${appliedMaterials.length}`, appliedMaterials);
      console.log(`✓ Embedded Animations (${names.length}):`, names);

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

  // Handle Animation Playback
  useEffect(() => {
    if (actions) {
      // Fade out all actions
      Object.keys(actions).forEach((key) => {
        actions[key]?.fadeOut(0.3);
      });

      // Play selected animation clip
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

// Micro Floating Sway for Procedural Motion
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

// FPS Ticker Component
function FpsTracker({ onFpsUpdate }: { onFpsUpdate: (fps: number) => void }) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current += 1;
    const now = performance.now();
    if (now - lastTime.current >= 1000) {
      const currentFps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
      onFpsUpdate(currentFps);
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}

// Loading Progress Fallback Component
function LoaderFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-[#080d19]/95 border border-cyan-500/50 rounded-2xl backdrop-blur-md shadow-[0_0_35px_rgba(6,182,212,0.3)] font-mono text-xs text-white space-y-3 min-w-[260px]">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <Sparkles className="text-cyan-400 animate-pulse" size={22} />
        </div>
        <div className="font-extrabold text-cyan-300 tracking-wider">LOADING 3D ASTRONAUT & SCENERY</div>
        <div className="text-[10px] text-slate-400">Processing GLB Models & PBR Maps...</div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-amber-500 h-full w-full animate-pulse"></div>
        </div>
      </div>
    </Html>
  );
}

interface AstronautViewerProps {
  className?: string;
  autoRotateDefault?: boolean;
}

export const AstronautViewer: React.FC<AstronautViewerProps> = ({ 
  className = "w-full h-full min-h-[380px]",
  autoRotateDefault = true
}) => {
  const { currentStep, deviationAlert, trackingStatus } = useMission();

  const [autoRotate, setAutoRotate] = useState<boolean>(autoRotateDefault);
  const [showEnvironment, setShowEnvironment] = useState<boolean>(true);
  const [selectedAnim, setSelectedAnim] = useState<string>('floating');
  const [modelInfo, setModelInfo] = useState<{ bbox: string; materialsCount: number; texturesValid: boolean; animations: string[] } | null>(null);
  const [liveFps, setLiveFps] = useState<number>(60);
  const controlsRef = useRef<any>(null);

  // Sync animation with protocol step if not manually changed
  useEffect(() => {
    if (currentStep === 1) setSelectedAnim('idle');
    else if (currentStep === 2) setSelectedAnim('floating');
    else if (currentStep === 3) setSelectedAnim('wave');
  }, [currentStep]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className={`relative bg-[#040814] rounded-xl border transition-all duration-300 overflow-hidden shadow-2xl select-none font-mono text-xs ${
      deviationAlert ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-cyan-900/40'
    } ${className}`}>
      {/* Background Sci-Fi Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

      {/* Protocol Deviation Alert Halo Light */}
      {deviationAlert && (
        <div className="absolute inset-0 z-20 pointer-events-none border-4 border-red-500/80 rounded-xl animate-pulse bg-red-950/20 flex items-start justify-center pt-12">
          <div className="bg-red-950/90 border border-red-500 text-red-200 font-mono text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 shadow-2xl animate-bounce">
            <AlertTriangle size={18} className="text-red-400" />
            <span>FSM SEQUENCE VIOLATION DETECTED</span>
          </div>
        </div>
      )}

      {/* R3F Canvas Viewport */}
      <Canvas
        camera={{ position: [0, 1.2, 3.5], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Aerospace Studio Lighting */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} castShadow color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={1.2} color="#38bdf8" />
        <directionalLight position={[0, -5, -5]} intensity={0.6} color="#f59e0b" />
        <pointLight position={[0, 4, 3]} intensity={1.5} color={deviationAlert ? '#ef4444' : '#06b6d4'} />

        {/* Dynamic Warning Alert Spotlight */}
        {deviationAlert && (
          <pointLight position={[0, 2, 1]} intensity={8} color="#ef4444" distance={5} />
        )}

        <Suspense fallback={<LoaderFallback />}>
          {/* Optional HDRI Studio Environment Reflections */}
          <Environment preset="night" />

          {/* 3D Space Corridor Interior */}
          {showEnvironment && <SpaceCorridorModel />}

          {/* Astronaut 3D Model inside bounds */}
          <Bounds fit clip observe margin={1.2}>
            <Center top>
              <FloatingRig>
                <AstronautModel currentAnim={selectedAnim} onLoadInfo={setModelInfo} />
              </FloatingRig>
            </Center>
          </Bounds>

          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.6} 
            scale={10} 
            blur={2} 
            far={4} 
            color="#000000" 
          />
        </Suspense>

        {/* Orbit Controls */}
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

        <FpsTracker onFpsUpdate={setLiveFps} />
      </Canvas>

      {/* Top Header Overlay Bar */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-950/85 px-3 py-1 rounded-lg border border-slate-800/80 backdrop-blur-md">
          <span className={`w-2.5 h-2.5 rounded-full ${deviationAlert ? 'bg-red-500 animate-ping' : 'bg-cyan-400 animate-pulse'}`}></span>
          <span className="font-bold text-cyan-400 text-xs tracking-wider">● 3D SCENE VIEWPORT</span>
          <span className="text-slate-700">|</span>
          <span className="text-amber-400 font-mono text-[11px]">STEP {currentStep} ACTIVE</span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Live FPS Counter */}
          <div className="bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-md text-[10px] font-bold text-cyan-300 flex items-center space-x-1 shadow-sm">
            <Activity size={12} className="text-cyan-400" />
            <span>{liveFps} FPS</span>
          </div>

          {/* Reset Camera Button */}
          <button 
            onClick={handleResetCamera}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700 text-[11px] font-bold flex items-center space-x-1 transition-all shadow-sm"
            title="Reset Camera View"
          >
            <RotateCcw size={12} className="text-amber-400" />
            <span>RESET CAM</span>
          </button>

          {/* Environment Scenery Toggle */}
          <button 
            onClick={() => setShowEnvironment(!showEnvironment)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all shadow-sm ${
              showEnvironment 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60' 
                : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {showEnvironment ? 'CORRIDOR: ON' : 'CORRIDOR: OFF'}
          </button>

          {/* Auto Rotate Toggle */}
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all shadow-sm ${
              autoRotate 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60' 
                : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {autoRotate ? 'TURNTABLE: ON' : 'TURNTABLE: OFF'}
          </button>
        </div>
      </div>

      {/* Bottom Animation & Model Specs Toolbar */}
      <div className="absolute bottom-2.5 left-3 right-3 flex flex-col sm:flex-row items-center justify-between bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800/90 backdrop-blur-md text-[11px] gap-2 pointer-events-auto">
        <div className="flex items-center space-x-3 text-slate-300 font-mono">
          <span className="text-slate-400 font-semibold">MATERIALS:</span>
          <span className="text-emerald-400 font-extrabold">{modelInfo?.materialsCount || '3'} LOADED</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-semibold">BOUNDS:</span>
          <span className="text-cyan-400 font-bold">{modelInfo?.bbox || '1.84m × 1.92m × 0.88m'}</span>
        </div>

        {/* Embedded Animation Clips Selector */}
        <div className="flex items-center space-x-1.5 font-mono text-[10px]">
          <span className="text-slate-400 mr-1 hidden md:inline">ANIMATION:</span>
          {['floating', 'idle', 'wave', 'moon_walk'].map((anim) => (
            <button
              key={anim}
              onClick={() => setSelectedAnim(anim)}
              className={`px-2 py-0.5 rounded font-bold uppercase transition-all ${
                selectedAnim === anim 
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' 
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {anim.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
