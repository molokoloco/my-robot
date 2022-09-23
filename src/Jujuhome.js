import React from 'react'
import { Suspense, useEffect, useRef, useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Cloud, useGLTF, OrbitControls, PerspectiveCamera, Stage, CameraShake, useAnimations, Html, Text, TrackballControls, Environment, Lightformer, Select, useSelect, ContactShadows, Edges, useCursor, Sparkles } from '@react-three/drei' //Sky, 
import {OutlineEffect} from 'three/examples/jsm/effects/OutlineEffect.js'
import { Panel, useControls } from './MultiLeva'
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"

import Grass from "./Grass"
import Words3d from "./Words3d"
import MySky from './MySky'
import MyRobot from './MyRobot'

// https://codesandbox.io/s/fairly-realistic-grass-y4thxd?file=/src/App.jsx:196-273
import { Grass2 } from './Grass2'
import { BlobGeometry } from './BlobGeometry'

import { NodeMaterial, color, uv, mix, mul, checker } from 'three/examples/jsm/nodes/Nodes.js';
// { find: 'three-nodes', replacement: 'three/examples/jsm/nodes' }

// Handling controls in Threejs is hard bc 3rd party components that change the camera need to know
// about controls, or else all changes are overwritten. That is the case for both <Stage and <CameraShake.
// In latest R3F controls can be set as the default so that other parts of the app may react to it.
// By setting <OrbitControls makeDefault <Stage and <CameraShake are aware of the controls being used.
// Should your own components rely on default controls, throughout the three they're available as:
// const controls = useThree(state => state.controls)

const mobile = ( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
)

const scaleSparkles = Array.from({ length: 50 }, () => 2.5 + Math.random() * 10)

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const state = proxy({
  current: null,
  items: {
    laces: "#ffffff",
    mesh: "#ffffff"
  },
})

const Picker = function() {
  const snap = useSnapshot(state)
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <h1>{snap.current}</h1>
    </div>
  )
}

////////////////////////////////////

function ShakeCamera() {
  //console.log('ShakeCamera()');

  const shakeRef = useRef();
  const orbitRef = useRef();
  useEffect(() => {
    orbitRef.current.addEventListener("change", () => {
      const shake = shakeRef.current.getIntensity();
      shakeRef.current.setIntensity(shake + 0.015);
    });
  }, [orbitRef, shakeRef]);
  return (
    <>
      <OrbitControls ref={orbitRef} makeDefault/>
      <CameraShake ref={shakeRef} additive decay />
    </>
  );
}

////////////////////////////////////

function MoveCam() {
  // console.log('MoveCam()');
  //const camera = useThree((state) => state.camera)

  // const set = useThree((state) => state.set)

  // useEffect(() => {
  //   set({ camera: {position: {x: 20}}})
  // }, [])

  // useThree(({controls}) => {

  //   //controls.autoRotate.set(true);
  //   controls.autoRotateSpeed.set(1.0);
  //   controls.maxDistance.set(65.0);
  //   if (mobile) {
  //     controls.maxDistance.set(35.0);
  //   }
  //   controls.minDistance.set(5.0);
  //   controls.enableKeys.set(false);
  //   controls.enablePan.set(false);
  //   //controls.update();
  // });

  //useThree((state) => {

    // var controls = state.controls // new THREE.OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 1.0;
    // controls.maxDistance = 65.0;
    // if (mobile) {
    //   controls.maxDistance = 35.0;
    // }
    // controls.minDistance = 5.0;
    // controls.enableKeys = false;
    // controls.enablePan = false;
    // controls.update();

    // const camera = state.camera
    // camera.position.x = -10 + Math.sin(state.clock.elapsedTime) * 3
    // camera.position.y = 5 + Math.cos(state.clock.elapsedTime) * 2
    // camera.position.z = -10 + Math.sin(state.clock.elapsedTime) * 2
    // camera.fov = 55
    //camera.zoom = 3
  //})

  //return useFrame((state) => {

    // var controls = state.controls // new THREE.OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = 1.0;
    // controls.maxDistance = 65.0;
    // if (mobile) {
    //   controls.maxDistance = 35.0;
    // }
    // controls.minDistance = 5.0;
    // controls.enableKeys = false;
    // controls.enablePan = false;
    // controls.update();

    // const camera = state.camera
    // camera.position.x = -10 + Math.sin(state.clock.elapsedTime) * 3
    // camera.position.y = 5 + Math.cos(state.clock.elapsedTime) * 2
    // camera.position.z = -10 + Math.sin(state.clock.elapsedTime) * 2
    // camera.fov = 55
    //camera.zoom = 3
  //})

  //return useFrame((state) => {
    //state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 1.5 + state.mouse.x / 4, 0.075)
    //state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.5 + state.mouse.y / 4, 0.075)
  //})
}

// function fallback() {
//     return (
//         <mesh scale="2">
//           <Html scale={100} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.51]}>
//               <div className="annotation">
//                   WebGL not working
//               </div>
//           </Html>
//         </mesh>
//     );
// } // <fallback/>

// export default function Viewer() {
//   return (
//   )
// }

export default function App() {

  const [selected, setSelected] = useState([])

  return (
    <>
      <Canvas shadows  dpr={[1, 2]} gl={{antialias: true, outputEncoding: THREE.sRGBEncoding, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure:0.4}}>
        <Suspense fallback={null}>
          {/* <ambientLight intensity={0.5} /> */}
          {/* <spotLight intensity={0.5} penumbra={1} position={[10, 10, 10]} castShadow /> */}
          {/* <Sky azimuth={0.1} turbidity={10} rayleigh={0.5} inclination={0.6} distance={200} /> */}
          {/* <Environment preset="city">
            <Lightformer
              form="circle" // circle | ring | rect (optional, default = rect)
              intensity={0.5} // power level (optional = 1)
              color="yellow" // (optional = white)
              scale={[100, 100]} // Scale it any way you prefer (optional = [1, 1])
              target={[0, 0, 0]} // Target position (optional = undefined)
            />
          </Environment> */}
          <MySky/>
          <Cloud position={[-4, 12, -5]} speed={0.2} opacity={0.8} color="#ffffff"/>
          <Cloud position={[4, 22, -5]} speed={0.2} opacity={0.5} color="#ffffff"/>
          <Cloud position={[-4, 18, -10]} speed={0.2} opacity={1} color="#ffffff"/>
          <Cloud position={[4, 26, 5]} speed={0.2} opacity={0.6} color="#ffffff"/>
          <Cloud position={[4, 14, 8]} speed={0.2} opacity={0.75} color="#ffffff"/>
          <mesh position={[0, 14, 0]}>
            <Words3d maxCount={10} radius={7} />{/* <TrackballControls /> */}
          </mesh>
          <Stage intensity={0} contactShadow={{ opacity: 1, blur: 2 }}>
            {/* <Environment preset="sunset" /> */}
            {/* <Sparkles count={scaleSparkles.length} size={scaleSparkles} position={[0, 3.8, 0]} scale={[4, 4, 4]} speed={0.3} /> */}
            <Select multiple box onChange={setSelected}>
              <MyRobot/>
            </Select>
            <ContactShadows position={[0, 0, 0]} opacity={0.75} scale={10} blur={2.5} far={4} />
            {/* <ShakeCamera /> */}
            <PerspectiveCamera makeDefault position={[10, 10, 5]}/>
            <OrbitControls makeDefault autoRotate={true} autoRotateSpeed={0.5} enableZoom={true} enablePan={true} rotateSpeed={1} maxPolarAngle={Math.PI / 2} enableDamping={true} maxDistance={25} minDistance={4}/>
            {/* <OrbitControls makeDefault autoRotate="true" enableZoom={true} enablePan={true} rotateSpeed={1} minPolarAngle={0} maxPolarAngle={Math.PI / 2.5}/> */}
            {/* <MoveCam /> */}
          </Stage>
          
          {/* <Grass2>
            <BlobGeometry/>
          </Grass2> */}

          <Grass/>
          {/* <mesh>
            <Html scale={100} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.51]}>
                <h1>Hello World !</h1>
            </Html>
          </mesh> */}
        </Suspense>
      </Canvas>
      <Picker />
      <Panel selected={selected} />
    </>
  )
}