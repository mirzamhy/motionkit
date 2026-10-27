// CameraController: memastikan Three.js camera selalu update position dan lookAt pada setiap frame
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export const CameraController: React.FC<{
  pos: [number, number, number];
  target: [number, number, number];
}> = ({ pos, target }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
  }, [camera, pos, target]);

  // Update langsung setiap render frame
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.lookAt(target[0], target[1], target[2]);

  return null;
};
