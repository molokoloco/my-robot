import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Cloud, ContactShadows, Sky, useGLTF, OrbitControls, Stage, CameraShake, useAnimations, Html } from '@react-three/drei'
import Grass from "./Grass"

// Handling controls in Threejs is hard bc 3rd party components that change the camera need to know
// about controls, or else all changes are overwritten. That is the case for both <Stage and <CameraShake.
// In latest R3F controls can be set as the default so that other parts of the app may react to it.
// By setting <OrbitControls makeDefault <Stage and <CameraShake are aware of the controls being used.
// Should your own components rely on default controls, throughout the three they're available as:
//   const controls = useThree(state => state.controls)

//useGLTF.preload('/robot.gltf')
function Model(props) {
  const { scene, animations } = useGLTF('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb')
  const { actions } = useAnimations(animations, scene)
  useEffect(() => {
    actions.Idle.play()
    scene.traverse((obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true))
  }, [actions, scene])
  return <primitive object={scene} {...props} />
}

function WobbleCamera() {
  const shakeRef = useRef();
  const orbitRef = useRef();
  useEffect(() => {
    orbitRef.current.addEventListener("change", () => {
      const shake = shakeRef.current.getIntensity();
      shakeRef.current.setIntensity(shake + 0.015);
    });
  }, [orbitRef]);

  //  maxYaw={0.1} // Max amount camera can yaw in either direction
    // maxPitch={0.1} // Max amount camera can pitch in either direction
    // maxRoll={0.1} // Max amount camera can roll in either direction
    // yawFrequency={0.1} // Frequency of the the yaw rotation
    // pitchFrequency={0.1} // Frequency of the pitch rotation
    // rollFrequency={0.1} // Frequency of the roll rotation
    // intensity={1} // initial intensity of the shake
    // decayRate={0.65} // if decay = true this is the rate at which intensity will reduce at />

  return (
    <>
      <OrbitControls ref={orbitRef} makeDefault/>
      <CameraShake ref={shakeRef} additive decay />
    </>
  );
}

function Rig() {
//   const camera = useThree((state) => state.camera)
//   return useFrame((state) => {
//     //camera.position.z = Math.sin(state.clock.elapsedTime) * 20
//   })
}
function fallback() {
    return (
        <mesh scale="2">
            <boxGeometry />
            <meshStandardMaterial />
            <Html scale={100} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.51]}>
                <div className="annotation">
                    WebGL not working
                </div>
            </Html>
        </mesh>
    );
} // <fallback/>


export default function Viewer() {
  return (
    <Canvas shadows camera={{ position: [10, -20, -10], fov: 20 }}>
      <ambientLight intensity={0.8} />
      <pointLight intensity={2} position={[0, 0, -1000]} />
      <Sky azimuth={0.1} turbidity={10} rayleigh={0.5} inclination={0.6} distance={1000} />
      <Rig />
      <Suspense fallback={null}>
        <Stage contactShadow={{ opacity: 1, blur: 2 }}>
          <Cloud position={[-4, 12, -25]} speed={0.2} opacity={1} />
          <Cloud position={[4, 22, -15]} speed={0.2} opacity={0.5} />
          <Cloud position={[-4, 18, -10]} speed={0.2} opacity={1} />
          <Cloud position={[4, 26, -5]} speed={0.2} opacity={0.5} />
          <Cloud position={[4, 14, 0]} speed={0.2} opacity={0.75} />
          <Grass />
          <Model />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.75} scale={10} blur={2.5} far={4} />
          <mesh scale="2">
            <boxGeometry />
            <meshStandardMaterial />
            <Html scale={100} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.51]}>
                <h1>Hello World !</h1>
            </Html>
        </mesh>
        </Stage>
      </Suspense>
      {/* <OrbitControls makeDefault /> */}
      <WobbleCamera />
    </Canvas>
  )
}
