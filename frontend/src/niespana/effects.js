import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial, Vector3 } from 'three';

const LightColumn = ({ position }) => {
  const columnRef = useRef();

  // Animation state
  const speed = 0.003;
  let scale = 0;

  // Animation function
  useFrame(() => {
    scale = (Math.sin(Date.now() * speed) * 0.2 + 1) + 0.3; // Adjust the amplitude and frequency as needed
    columnRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh position={position} ref={columnRef}>
      <cylinderGeometry attach="geometry" args={[0.1, 0.1, 0.4, 32]} />
      <meshBasicMaterial attach="material" color="yellow" transparent opacity={0.5} />
    </mesh>
  );
};

export default LightColumn;