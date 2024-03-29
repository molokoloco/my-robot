import React from 'react'
import { useRef, useState } from 'react' //Suspense, 
import * as THREE from 'three'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { Cloud, PerspectiveCamera, Sparkles } from '@react-three/drei' //Sky, , OrbitControls, Environment
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
//import BarLoader from "react-spinners/ClipLoader"

import cloudDrei from './assets/cloud-drei.png'
// import venise from './assets/venice_sunset_1k.hdr'
// import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
// import { Panel, useControls } from './MultiLeva'
// import { HexColorPicker } from "react-colorful"
// import { proxy, useSnapshot } from "valtio"
// import ReactDOM from 'react-dom/client';

import Grass from './Grass'
import Words3d from './Words3d'
import MySky from './MySky'
import MyRobot from './MyRobot'
import Bengal from './Bengal'
//import MyPlane from './MyPlane'
//import Scroll from './Scroll'
//import MyHtml from './MyHtml'

import './index.css'

// TODO navigation 3D : https://codesandbox.io/s/image-gallery-forked-kvsrs4?file=/src/App.js
// + https://github.com/molefrog/wouter#uselocation-hook-working-with-the-history

// By setting <OrbitControls makeDefault <Stage and <CameraShake are aware of the controls being used.
// Should your own components rely on default controls, throughout the three they're available as:
// const controls = useThree(state => state.controls)

extend(THREE)

// const mobile = ( navigator.userAgent.match(/Android/i)
//   || navigator.userAgent.match(/webOS/i)
//   || navigator.userAgent.match(/iPhone/i)
//   || navigator.userAgent.match(/BlackBerry/i)
//   || navigator.userAgent.match(/Windows Phone/i)
// )

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
// const state = proxy({
//   current: null,
//   items: {
//     laces: "#ffffff",
//     mesh: "#ffffff"
//   },
// })

// const Picker = function() {
//   const snap = useSnapshot(state)
//   return (
//     <div style={{ display: snap.current ? "block" : "none" }}>
//       <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
//       <h1>{snap.current}</h1>
//     </div>
//   )
// }

////////////////////////////////////

//function MoveCam() {
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

  //return useFrame((state) => {
    //state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 1.5 + state.mouse.x / 4, 0.075)
    //state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.5 + state.mouse.y / 4, 0.075)
  //})
//}

////////////////////////////////////

// function Box({ text, color, ...props }) {
//   const [hovered, set] = useState(false)
//   return (
//     <mesh {...props} onPointerOver={(e) => set(true)} onPointerOut={(e) => set(false)}>
//       <boxGeometry args={[2, 2, 2]} />
//       <meshStandardMaterial color={hovered ? 'hotpink' : color} />
//       {/* <Text
//         position={[0, 0, 1]}
//         color={color} // default
//         anchorX="center" // default
//         anchorY="middle" // default
//       >{text}</Text> */}
//       {/* <Html position={[0, 0, 1]} className="label" center>
//         {text}
//       </Html> */}
//     </mesh>
//   )
// }

// function MyScroll(scroll) {
//   const viewport = useThree((state) => state.viewport)
//   const group = useRef()
//   useFrame((state, delta) => {
//     group.current.position.y = THREE.MathUtils.damp(group.current.position.y, viewport.height * scroll.current, 4, delta)
//     // Or: group.current.position.lerp(vec.set(0, viewport.height * scroll.current, 0), 0.1)
//   })
//   return (
//     <group ref={group}>
//       <Box text={<span>This is HTMLThis is HTML</span>} color="blue" />
//       <Box text={<h1>H1 captionThis is HTML</h1>} color="blue" position={[0, -viewport.height, 0]} />
//     </group>
//   )
// }

// function ScrollContainer({ scroll, children }) {
//   const { viewport } = useThree()
//   const group = useRef()
//   useFrame((state, delta) => {
//     group.current.position.y = THREE.MathUtils.damp(group.current.position.y, viewport.height * scroll.current, 4, delta)
//     // Or: group.current.position.lerp(vec.set(0, viewport.height * scroll.current, 0), 0.1)
//   })
//   return <group ref={group}>{children}</group>
// }

// function MyScroll() {
//   const viewport = useThree((state) => state.viewport)
//   return (
//     <>
//       <Box text={<span>This is HTMLThis is HTML</span>} color="aquamarine" />
//       <Box text={<h1>H1 captionThis is HTML</h1>} color="lightblue" position={[0, -viewport.height, 0]} />
//     </>
//   )
// }

////////////////////////////////////

// const Fallback = function() {
//   const override = { // https://www.npmjs.com/package/react-spinners
//     margin: "20px auto",
//     clear: "both"
//   }
//   return (
//     <div className="h-100 d-flex align-items-center justify-content-center">
//       <h4 className="text-center">Chargement...<br/>
//       <BarLoader cssOverride={override} color="yellow" /></h4>
//     </div>
//   )
// }

////////////////////////////////////

const MyOrbitControls = () => {
  const { camera, gl } = useThree();
  camera.position.set( 0, 6, 8 );
  const controls = new OrbitControls(camera, gl.domElement); // main gl.domElement document.querySelector('#root')
  controls.target.y = controls.target.y + 5
  controls.makeDefault = true
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.25
  controls.enableRotate = true
  controls.rotateSpeed = 1
  controls.enableZoom = true
  controls.minZoom = 1
  //controls.maxZoom = 10
  //controls.noZoom = true // enableZoom = false
  controls.zoom = 0
  controls.enablePan = true
  controls.panSpeed = 1
  controls.enableDamping = true
  controls.minPolarAngle = 0.5
  controls.maxPolarAngle = Math.PI / 1.7
  //controls.minAzimuthAngle = -Math.PI / 2
  //controls.maxAzimuthAngle = Math.PI / 2
  controls.maxDistance = 24
  controls.minDistance = 3.6
  controls.mouseButtons = {LEFT:THREE.MOUSE.ROTATE, MIDDLE:THREE.MOUSE.PAN, RIGHT:THREE.MOUSE.DOLLY}
  //controls.screenSpacePanning = true
  //controls.update()
  useFrame(() => {
    controls.update();
  }) 
}

export default function App() {

  const cam = useRef()
  const [bonus, setBonus] = useState(false)
  const scaleSparkles = Array.from({ length: 18 }, () => 1 + Math.random() * 6)

  // K0nam1 -------------------------------------------------- //
  var kKeys = [], konami = '38,38,40,40,37,39,37,39,66,65' // ↑ ↑ ↓ ↓ ← → ← → B A
  const handleKeyDown = (event => {
    kKeys.push(event.keyCode)
    if ((' '+kKeys+' ').indexOf(konami) >= 0) {
        kKeys = []
        setBonus(true)
    }
  })

  // function onMouseWheel( e ) {
  //   //console.log('onMouseWheel',  e.target.scrollTop);
  //   e.target.scrollTop = (e.target.scrollTop - e.wheelDeltaY) // scrollRef
  //   scroll.current = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight)
  //   //console.log('scroll.current',scroll.current);
  // }

  // useEffect(() => {
  //     window.addEventListener( 'wheel', onMouseWheel, true );
  //     return () => { window.removeEventListener( 'wheel', onMouseWheel, true ); };
  // }, []);

  // hotpink #ff69b4 // color:#ff6fff; /* Ultra pink */

  return (
    <Canvas
      tabIndex={0}
      onKeyDown={handleKeyDown}
      shadows
      pixelratio={[1, 1]}
      alpha="true"
      //dpr={[1, 2]}
      gl={{
        antialias: true,
        //outputEncoding: THREE.sRGBEncoding,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.4
      }}
      //onCreated={(state) => state.events.connect(scrollRef.current)}
      raycaster={{ computeOffsets: ({ clientX, clientY }) => ({ offsetX: clientX, offsetY: clientY }) }}
      >{/* <Suspense fallback={Fallback()}> */}
        {/*<Environment files={venise}/> preset="sunset" */}
        <fogExp2 density={0.016} attach="fog" color="#ff69b4" near={30} far={120} />
        {/* <ScrollContainer><MyScroll scroll={scroll}/></ScrollContainer> */}
        <ambientLight intensity={0.3} />
        <pointLight intensity={0.2} position={[-10, 15, 15]} />
        <spotLight castShadow intensity={2.2} angle={0.5} penumbra={1} position={[10, 20, -15]} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
        {/* <Sky distance={450000} sunPosition={[0, 1, 0]} azimuth={0.25} turbidity={10} rayleigh={0.5} inclination={0.6} /> */}
        <MySky/>
        <Grass position={[0, 2.5, 0]}  opacity={0.6}/>
        {/* <MyPlane/> */}
        <Cloud position={[-4, 18, -5]} scale="1.4" speed={0.2} opacity={0.6} color="#ffffff" depth={2.5} texture={cloudDrei} />
        <Cloud position={[4, 14, -5]} speed={0.4} opacity={0.25} color="#ffffff" depth={1.5} texture={cloudDrei} />
        <mesh position={[0, 12, 0]}>
          <Words3d maxCount={50} radius={4} />
        </mesh>
        <Sparkles color="white" count={scaleSparkles.length} size={scaleSparkles} speed={scaleSparkles} opacity="0.9" scale="4" noise="10" position={[0, 5.5, 0]} />
        <MyRobot/>
        {bonus && <Bengal/>}
        {/* <MyHtml/> */}
        <PerspectiveCamera ref={cam} makeDefault fov={40} near={0.1} far={50} zoom="0.5" />
        <MyOrbitControls makeDefault/>
        {/* <Picker /> */}
        {/* <Panel selected={selected} /> */}
        {/* <div ref={scrollRef} className="scroll">
          <div style={{ height: `300vh`, pointerEvents: 'none'}}></div>
        </div> */}
      </Canvas>
  )
}

// function Capture() {
//   const gl = useThree((state) => state.gl)
//   useControls({
//     screenshot: button(() => {
//       const link = document.createElement('a')
//       link.setAttribute('download', 'canvas.png')
//       link.setAttribute(
//         'href',
//         gl.domElement.toDataURL('image/png').replace('image/png', 'image/octet-stream')
//       )
//       link.click()
//     })
//   })

//   return null
// }