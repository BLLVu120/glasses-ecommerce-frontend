import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface GlassesModelViewerProps {
  modelUrl: string;
}

function GlassesModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    // Auto-center and auto-scale the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / (maxDim || 1);
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}  useEffect(() => {
    if (!groupRef.current) return;
    // Auto-center and auto-scale the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / (maxDim || 1);
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function GlassesModelViewer({ modelUrl }: GlassesModelViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.4} />

        <Suspense fallback={null}>
          <GlassesModel url={modelUrl} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.4} blur={2} />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
