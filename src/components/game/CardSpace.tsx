'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import { ReactNode } from 'react';

interface CardSpaceProps {
  children: ReactNode;
}

export default function CardSpace({ children }: CardSpaceProps) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: '#0a3d24' }}
      gl={{ antialias: true }}
    >
      {/* Isometric camera setup */}
      <PerspectiveCamera
        makeDefault
        position={[5, 8, 5]}
        fov={50}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
      />
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.4}
      />
      
      {/* Grid helper for alignment */}
      <Grid
        args={[20, 20]}
        cellColor="#0a3d24"
        sectionColor="#0d4d2e"
        fadeDistance={25}
        fadeStrength={1}
      />
      
      {/* Environment for better lighting */}
      <Environment preset="sunset" />
      
      {/* Optional: OrbitControls for debugging (can be disabled) */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={false}
        minDistance={8}
        maxDistance={12}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />
      
      {/* Card content */}
      {children}
    </Canvas>
  );
}

