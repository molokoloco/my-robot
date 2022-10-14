import React from 'react'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { Cloud, PerspectiveCamera, Stage, Environment, Sparkles } from '@react-three/drei' //Sky, , OrbitControls
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import BarLoader from "react-spinners/ClipLoader"

// import {OutlineEffect} from 'three/examples/jsm/effects/OutlineEffect.js'
// import { Panel, useControls } from './MultiLeva'
// import { HexColorPicker } from "react-colorful"
// import { proxy, useSnapshot } from "valtio"
// import ReactDOM from 'react-dom/client';

import Grass from "./Grass"
import Words3d from "./Words3d"
import MySky from './MySky'
import MyRobot from './MyRobot'
//import Scroll from './Scroll'
//import MyHtml from './MyHtml'

import './index.css'

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

const fallback = function() {

  const override = { // https://www.npmjs.com/package/react-spinners
    margin: "20px auto",
    clear: "both"
  }

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <h4 className="text-center">Chargement...<br/>
      <BarLoader cssOverride={override} color="yellow" /></h4>
    </div>
  )
}

////////////////////////////////////

const MyOrbitControls = () => {
  const { camera, gl } = useThree();

  const controls = new OrbitControls(camera, gl.domElement); // main gl.domElement document.querySelector('#root')

  // const controls = useMemo(({ camera, gl }) => {
  //   return new OrbitControls(camera, gl.domElement);
  // }, [])

  useFrame(({ camera }) => {
    controls.update();
  })

  useEffect(
    () => {
      camera.position.y = 5
      camera.position.z = 15

      controls.target.y = controls.target.y + 5
      controls.makeDefault = true
      controls.enableDamping = true
      controls.dampingFactor = 0.1
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.2
      controls.enableRotate = true
      controls.rotateSpeed = 1
      controls.enableZoom = true
      controls.minZoom = 1
      //controls.maxZoom = 10
      //controls.noZoom = true // enableZoom = false
      controls.zoom = 10
      controls.enablePan = true
      controls.panSpeed = 1
      controls.enableDamping = true
      controls.minPolarAngle = 0.5
      controls.maxPolarAngle = Math.PI / 2.2
      //controls.minAzimuthAngle = -Math.PI / 2
      //controls.maxAzimuthAngle = Math.PI / 2
      controls.maxDistance = 24
      controls.minDistance = 3.6
      //controls.mouseButtons = {LEFT:THREE.MOUSE.ROTATE, MIDDLE:THREE.MOUSE.PAN, RIGHT:THREE.MOUSE.DOLLY}
      //controls.screenSpacePanning = true
      //controls.update()
      return () => {
        controls.dispose();
      };
    }, [camera, gl, controls] );
    return null;
  };

export default function App() {
  //const [selected, setSelected] = useState([])
  const cam = useRef();

  // const scrollRef = useRef()
  // const scroll = useRef(0)

  const scaleSparkles = Array.from({ length: 10 }, () => Math.random() * 6)

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

  // function onWindowResize() {
	// 		var SCREEN_WIDTH = $(window).width() - 300;
	// 		var SCREEN_HEIGHT = $(window).height() -150;
  //     $("#container").attr("width",SCREEN_WIDTH);
  //     $("#container").attr("height",SCREEN_HEIGHT);            
  //                           camera.position.set(0, 0, 10)
	// 		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	// 	camera.updateProjectionMatrix();
	// 		renderer.setSize( SCREEN_WIDTH,SCREEN_HEIGHT );
	// 	}

  return (
    <>
      <Suspense fallback={fallback()}>
        <Canvas
          pixelratio={[1, 1]}
          shadows
          dpr={[1, 2]}
          gl={{antialias:true, outputEncoding:THREE.sRGBEncoding, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure:0.4}}
          //onCreated={(state) => state.events.connect(scrollRef.current)}
          //camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }}
          raycaster={{ computeOffsets: ({ clientX, clientY }) => ({ offsetX: clientX, offsetY: clientY }) }}
          >
          {/* <ScrollContainer> */}
          {/* <MyScroll  scroll={scroll}/> */}
          {/* </ScrollContainer> */}
          <ambientLight intensity={0.3} />
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
          <Grass/>
          <Cloud position={[-4, 12, -5]} speed={0.2} opacity={0.8} color="#ffffff" depthTest={true}/>
          <Cloud position={[4, 15, -5]} speed={0.2} opacity={0.5} color="#ffffff" depthTest={true}/>
          <fog attach="fog" color="#205806" near={25} far={100} />
          <Stage intensity={0} contactShadow={{ opacity: 1, blur: 2 }}>
            <Environment preset="sunset" />
            <mesh position={[0, 10, 0]}>
              <Words3d maxCount={100} radius={4} />
            </mesh>
            <Sparkles color="white" count={scaleSparkles.length} size={scaleSparkles} speed={scaleSparkles} opacity="0.8" scale="5" noise="4" position={[0, 3.8, 0]} />
            {/* <Select multiple box onChange={setSelected}> */}
            <MyRobot/>
            {/* <MyHtml/> */}
            {/* </Select> */}
            <PerspectiveCamera ref={cam} makeDefault fov={40} near={0.1} far={50} zoom="0.5" />
            <MyOrbitControls/>
            {/* <MoveCam /> */}
          </Stage>
        </Canvas>
      </Suspense>
      {/* <Picker /> */}
      {/* <Panel selected={selected} /> */}
      {/* <div ref={scrollRef} className="scroll">
        <div style={{ height: `300vh`, pointerEvents: 'none'}}></div>
      </div> */}
    </>
  )
}

// // Create a react root
// const root = createRoot(document.querySelector('canvas'))
// root.configure({ events }) // , camera: { position: [0, 0, 50] }
// window.addEventListener('resize', () => {
//   console.log('resize');
//   root.configure({ size: { width: window.innerWidth, height: window.innerHeight } })
// })
// window.dispatchEvent(new Event('resize'))
// //root.render(<App />)
// ReactDOM.render(<App />, root);
// // root.unmount()