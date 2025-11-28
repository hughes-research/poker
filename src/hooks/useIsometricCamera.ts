import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

/**
 * Hook to set up an isometric camera view.
 * @param position - Camera position [x, y, z]
 * @param target - Look-at target [x, y, z]
 */
export function useIsometricCamera(position: [number, number, number] = [5, 8, 5], target: [number, number, number] = [0, 0, 0]) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    const lookAt = new THREE.Vector3(...target);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
  }, [camera, position, target]);

  return camera;
}

