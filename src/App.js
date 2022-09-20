import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from "three";
import './App.css';

import five from "./assets/five.png";

const Box = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state 
  const [active, setActive] = useState(false);
  const [hovered, hover] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame((state, delta) => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });
  
  const texture = useMemo(() => new THREE.TextureLoader().load(five), []);
  
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [2, 2, 2] : [1.5, 1.5, 1.5]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
        >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial attach="material" transparent side={THREE.DoubleSide}>
          <primitive attach="map" object={texture} />
        </meshBasicMaterial>
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

const App = () => {
  return (
    <div>
      <h1>Hello</h1>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[2.5, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default App;
