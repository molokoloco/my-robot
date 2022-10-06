import React from 'react'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { useGLTF, useAnimations, Edges} from '@react-three/drei'
import { proxy, useSnapshot } from "valtio"

import pixTrans from './assets/pix.png'

// const state = proxy({
//   current: null,
//   items: {
//     laces: "#ffffff",
//     mesh: "#ffffff"
//   },
// })

let previousAction, mixer, actions, activeAction, face
const api = { state: 'Idle' }

function fadeToAction(name, duration) {
  previousAction = activeAction;
  activeAction = actions[name];
  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration);
  }
  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

export default function Robot({ ...props }) {
  console.log('Robot()')

  const ref = useRef()

  const { nodes, scene, materials, animations } = useGLTF('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb')
  //const { ref, actions, names, mixer } = useAnimations(animations, scene) //

  const [hovered, setHovered] = useState(false)
  const [index, setIndex] = useState(0)


  //actions['Idle'].play()

  const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death'] //, 'Standing', 'Sitting'
  const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp']
  //const faceExpressions = ['Angry', 'Surprised', 'Sad']

  mixer = new THREE.AnimationMixer(scene)
  actions = {}

  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i]
    const action = mixer.clipAction(clip)
    actions[clip.name] = action

    if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
      action.clampWhenFinished = true
      action.loop = THREE.LoopOnce
    }
  }

  function createEmoteCallback(name) {
    api[name] = function () {
      fadeToAction(name, 0.2)
      mixer.addEventListener('finished', restoreState)
    }
    //emoteFolder.add(api, name);
  }

  function restoreState() {
    mixer.removeEventListener('finished', restoreState)
    fadeToAction(api.state, 0.2)
  }

  for (let i = 0; i < emotes.length; i++) {
    createEmoteCallback(emotes[i])
  }

  // expressions
  face = scene.getObjectByName('Head_4')

  const expressions = Object.keys(face.morphTargetDictionary)
  //const expressionFolder = gui.addFolder('Expressions');
  //for (let i = 0; i < expressions.length; i++) {
  //   expressionFolder
  //     .add(face.morphTargetInfluences, i, 0, 1, 0.01)
  //     .name(expressions[i]);
  //}

  //console.log('api', api, 'states', states, 'emotes', emotes, 'expressions', expressions);
  //console.log('face.morphTargetDictionary',face.morphTargetDictionary,'expressions',expressions);
  let interval,
    interMorph,
    timeOut = null;

  useEffect(() => {
    activeAction = actions[api.state]
    activeAction.play()
    
    interMorph = setInterval(() => {
      let customMorph = Math.random() > 0.5 ? 1 : 0; // 0 Angry 1 Surprised
      if (customMorph == 1) {
        face.morphTargetInfluences[0] = 0
        face.morphTargetInfluences[1] = Math.random()
      }
      else {
        face.morphTargetInfluences[0] = Math.random()
        face.morphTargetInfluences[1] = 0
      }
    }, 3333);

    interval = setInterval(() => {
      var rdmAction = states[Math.floor(Math.random() * states.length)]
      fadeToAction(rdmAction, 0.5)
      //console.log('rdmAction', rdmAction)
      
      timeOut = setTimeout(() => {
        var rdmEmote = emotes[Math.floor(Math.random() * emotes.length)]
        api[rdmEmote]();
        //console.log('rdmEmote', rdmEmote)
      }, 6000)

    }, 10000)

    return () => {
      clearTimeout(timeOut)
      clearInterval(interMorph)
      clearInterval(interval)
    }
  }, [actions, api]);


  // let mixer = new THREE.AnimationMixer(scene);
  // animations.forEach((clip) => {
  //     const action = mixer.clipAction(clip);
  //     action.play();
  // });
  useFrame((state, delta) => {
      mixer.update(delta);
  }, [mixer]);

  // const mesh = useRef()
  // const [isHovered, setHovered] = useState(false);
  // const color = isHovered ? 0xe5d54d : 0xf95b3c;

  // const onHover = useCallback((e, value) => {
  //   //e.stopPropagation(); // stop it at the first intersection
  //   console.log('onHover', e);
  //   setHovered(value);
  // }, [setHovered]);

  // <mesh 
  //   ref={mesh}
  //   position={position}
  //   onPointerOver={e => onHover(e, true)}
  //   onPointerOut={e => onHover(e, false)}
  // >
  //   <boxBufferGeometry attach="geometry" args={[0.047, 0.5, 0.29]} />
  //   <meshStandardMaterial color={color} attach="material" />
  // </mesh>
  
  // useEffect(() => void (document.body.style.cursor = hovered ? "pointer" : "auto"), [hovered])
  
  // const [isHovered, setHovered] = useState(false);
  // const color = isHovered ? 0xe5d54d : 0xf95b3c;

  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);

  const onHover = useCallback((e, value) => {
    //console.log('onHover', value);
    //e.stopPropagation();
    setHovered(value);
    document.body.style.cursor = (value ? 'pointer' : 'auto')
  }, [setHovered]);

  // https://codesandbox.io/s/shoe-configurator-qxjoj?file=/src/App.js:1403-3292
  // Cursor showing current color
  // const [hovered, set] = useState(null)
  // useEffect(() => {
  //   document.body.style.cursor = (hovered ? 'pointer' : 'auto')
  //   return () => (
  //     document.body.style.cursor = 'auto'
  //   )
  // }, [hovered])

  const robotClick = function(e) {
    setActive(!active);
    // var rdmAction = states[Math.floor(Math.random() * states.length)]
    // fadeToAction(rdmAction, 0.5)
    // console.log('robotClick', e.type, rdmAction)
    
    var t = 'Jump'; //actionsList[Math.floor(Math.random() * actionsList.length)]
    api[t]();
    console.log('api', api);
    //setIndex((index + 1) % names.length)
  }

  const [textureTrans] = useLoader(THREE.TextureLoader, [pixTrans]) 

  // nodes  = 'FootL_1 ', 'LowerLegL_1 ', 'LegL ', 'LowerLegR_1 ', 'LegR ', 'Head_2 ', 'Head_3 ', 'Head_4 ', 'ArmL ', 'ShoulderL_1 ', 'ArmR ', 'ShoulderR_1 ', 'Torso_2 ', 'Torso_3 ', 'FootR_1 ', 'HandR_1 ', 'HandR_2 ', 'HandL_1 ', 'HandL_2'
  // materials = 
  // Black MeshStandardMaterial {uuid: '07a4d4ed-f3bc-4b6f-a8e3-4436536db5f3', name: 'Black', type: 'MeshStandardMaterial', blending: 1, side: 0, …}
  // Grey MeshStandardMaterial {uuid: '0c708605-0ab2-4135-8cd6-c7561f55d4f3', name: 'Grey', type: 'MeshStandardMaterial', blending: 1, side: 0, …}
  // Main MeshStandardMaterial {uuid: 'a0e1bb68-112b-424b-bcb8-c21dadd06500', name: 'Main', type: 'MeshStandardMaterial', blending: 1, side: 0, …}
  //console.log('nodes', nodes);

  let mi = 0;
  const getMesh = function(name) {

    // nodes[name].geometry.name = name
    console.log('geometry', nodes[name].geometry);

    return <mesh
      key={mi++}
      castShadow
      receiveShadow
      //geometry={nodes[name].geometry}
      material={materials.Main}
      //material-color={(name == 'Head_4' ? 'Pink' : 'Yellow')}
      onPointerOver={(e) => onHover(e, true)}
      onPointerOut={(e) => onHover(e, false)}></mesh>
  }

  let MyMesh = [];

  scene.traverse((obj) => { // Recolor the ROBOT
    if (obj.isMesh) {
      // obj.receiveShadow = true
      // obj.castShadow = true
      // // const material = NodeMaterial.fromMaterial( obj.material )
      // // obj.material = new THREE.MeshBasicMaterial( { color: 0xd4d4d4 } )
      // if (obj.name == 'Head_4') {
      //   obj.material.color = new THREE.Color( 'pink' ).convertSRGBToLinear()
      // }
      // else obj.material.color = new THREE.Color( 'yellow' ).convertSRGBToLinear()
      // obj.material.needsUpdate = true

      if (obj.name == 'Head_4') MyMesh.push(getMesh(obj.name));
    }
  })

  console.log('MyMesh', MyMesh);
  
  // onContextMenu

  return (
    <group ref={ref} dispose={null} {...props}>
      {/* {MyMesh} */}
      <mesh>
        <primitive object={scene} onClick={console.log} />
      </mesh>
      {/* <mesh raycast={useCamera(anotherCamera)}>
        <primitive object={scene}/>
      </mesh> */}
      <mesh position={[0, 2, 0]}
        onPointerOver={(e) => onHover(e, true)}
        onPointerOut={(e) => onHover(e, false)}
        onPointerDown={robotClick}
        >
        <boxGeometry args={[3*1.2, 5*1.2, 3*1.2]}/>
        <meshBasicMaterial map={textureTrans} alphaTest="0.5" />
        {/* <meshBasicMaterial opacity="0" transparent="true" thickness="0" transmission="0" depthTest={true}/> */}
        {/* wireframe map={textureTrans} alphaTest="true" needUpdate="true" transparent="false" opacity="0.5" depthWrite="false" side={THREE.DoubleSide} color   */}
      </mesh>
    </group>
  )
}


  //console.log('obj', obj.name)
  // obj.onPointerOver = (e) => {
  // //e.stopPropagation()
  // //set(e.object.material.name)
  // }
  // obj.onPointerOut = (e) => {
  // //e.intersections.length === 0 && set(null)
  // }
  // obj.onPointerMissed = () => (state.current = null)
  // obj.onClick = (e) => {
  // e.stopPropagation();
  // //state.current = e.object.material.name
  // }

  // return (
  //   <group
  //     ref={ref}
  //     dispose={null}>
  //     {/* <mesh receiveShadow castShadow geometry={nodes.shoe.geometry} material={materials.laces} material-color={snap.items.laces} /> */}
  //     {/* {meshs} */}
  //     <primitive object={scene} {...props} 
  //       onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
  //       onPointerOut={(e) => e.intersections.length === 0 && set(null)}
  //       onPointerMissed={() => (state.current = null)}
  //       onClick={(e) => (e.stopPropagation(), (state.current = e.object.material.name), console.log('e.object.material.name', e.object.material.name) )}/>
  //   </group>
  // )





  // https://codesandbox.io/s/ny3p4?file=/src/App.js:1024-1029
  // const [hovered, setHover] = useState(false)
  // const selected = useSelect().map((sel) => sel.userData.store)
  // const [store, materialProps] = useControls(selected, {
  //   //color: { value: color }
  // })
  // const isSelected = !!selected.find((sel) => sel === store)
  // useCursor(hovered)


  // const [start] = useState(() => Math.random() * 5000)
  // const [mixer] = useState(() => new THREE.AnimationMixer())
  // useEffect(() => void mixer.clipAction(animations[0], ref.current).play(), [])
  // useFrame((state, delta) => {
  //   mesh.current.position.y = Math.sin(start + state.clock.elapsedTime) * 5
  //   mesh.current.rotation.x = Math.PI / 2 + (Math.sin(start + state.clock.elapsedTime) * Math.PI) / 10
  //   mesh.current.rotation.y = (Math.sin(start + state.clock.elapsedTime) * Math.PI) / 2
  //   ref.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
  //   mixer.update(delta * speed)
  // })

  // useEffect(() => {
  //   actions.Idle.play()
  //   //mixer.clipAction(animations[0], ref.current).play(), [])

  //   /*
  //   // https://threejs.org/docs/scenes/material-browser.html#MeshToonMaterial
  //   map: textureLoader.load( '../../examples/textures/brick_diffuse.jpg' ), // bricks
  //   gradientMap: textureLoader.load( '../../examples/textures/gradientMaps/fiveTone.jpg' ), // fiveTone
  //   alphaMap: alphaMapKeys[ 0 ]
  //   */
  //   // const bricksL = new THREE.TextureLoader()
  //   // const bricks = bricksL.load( 'three/examples/jsm/textures/brick_diffuse.jpg' );
  //   // bricks.wrapS = THREE.RepeatWrapping;
  //   // bricks.wrapT = THREE.RepeatWrapping;
  //   // bricks.repeat.set( 9, 1 ); 

  //   // const fiveToneL = new THREE.TextureLoader()
  //   // const fiveTone = fiveToneL.load( 'three/examples/jsm/textures/gradientMaps/fiveTone.jpg' );
  //   // fiveTone.minFilter = THREE.NearestFilter;
  //   // fiveTone.magFilter = THREE.NearestFilter;

  //   // const transparent = true;
  //   // const opacity = 1;
  //   // const gradientMap = fiveTone;
  //   // const color = 0x0000ff;

  //   // var newMaterial = new THREE.MeshToonMaterial( { gradientMap, color, transparent, opacity, thickness: 0.05} );
  //   // newMaterial.userData.outlineParameters = {
  //   //   thickness: 0.05,
  //   //   color: [ 0, 0, 0 ],
  //   //   alpha: 0.1,
  //   //   visible: true,
  //   //   keepAlive: true,
  //   // };
 
  //   // const newMaterial = new THREE.MeshToonMaterial( {
  //   //   color: 'yellow', //bricksL,
  //   //   //gradientMap: fiveToneL,
  //   //   transparent:0.5,
  //   //   opacity:0.8
  //   // });

  //   // newMaterial.userData.outlineParameters = {
  //   //   thickness: 0.05,
  //   //   color: [ 0, 0, 0 ],
  //   //   alpha: 0.1,
  //   //   visible: true,
  //   //   keepAlive: true,
  //   // };

  //   //const newMaterial = new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize: 0.5 } )

  //   // const diffuseColor = new THREE.Color().setHSL( 0.5, 0.5, 0.25 );

  //   // const material = new THREE.MeshPhysicalMaterial( {
  //   //   color: diffuseColor,
  //   //   metalness: 1,
  //   //   roughness: 0,
  //   //   clearcoat: 0,
  //   //   clearcoatRoughness: 0,
  //   //   reflectivity: 1,
  //   //   //envMap: ( index % 2 ) == 1 ? texture : null
	// 	// } );
    
  //   //new THREE.MeshBasicMaterial( { color: 0xd4d4d4 } )
  //   //new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize: 0.5 } )

  //   // scene.traverse((obj) =>{
  //   //   //console.log('obj', obj.name)
  //   //   if (obj.isMesh) {
  //   //     //console.log('obj', obj.name)
  //   //     obj.receiveShadow = true
  //   //     obj.castShadow = true

  //   //     if (obj.name == 'Head_2') {
  //   //       console.log('material', obj.material)
  //   //     }

  //   //     const material = NodeMaterial.fromMaterial( obj.material )
  //   //     // const checkerNode = checker( mul( uv(), 5 ) )
  //   //     // material.sheenNode = mix( color( 0x00ffff ), color( 0xffff00 ), checkerNode )
  //   //     // material.sheenRoughnessNode = checkerNode
  //   //     //material.color = '0x00ffff'
  //   //     //material.opacity = 0.3
  //   //     obj.material = material; 

  //   //   }
  //   // })

  // }, [actions, scene])
 


// new GLTFLoader()
//   .setPath( 'models/gltf/' )
//   .load( 'SheenChair.glb', function ( gltf ) {
//     scene.add( gltf.scene );
//     const object = gltf.scene.getObjectByName( 'SheenChair_fabric' );

//     // Convert to NodeMaterial
//     const material = NodeMaterial.fromMaterial( object.material );
//     const checkerNode = checker( mul( uv(), 5 ) );
//     material.sheenNode = mix( color( 0x00ffff ), color( 0xffff00 ), checkerNode );
//     material.sheenRoughnessNode = checkerNode;
//     object.material = material;

//   } );



  // useFrame(({ camera, scene, gl }) => {

  //   //gl.autoClear = true
  //   const effect = new OutlineEffect( gl, {
  //     defaultThickness: 0.05,
  //     defaultColor: [ 0, 0, 0 ],
  //     defaultAlpha: 0.8,
  //     defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
  //   } );
  //   //effect.autoClear = true
  //   //effect.clearDepth();
  //   effect.render( scene, camera );
  // })
  
  // return <primitive object={scene} {...props} />

  // return <mesh ref={ref} dispose={null} {...props}>
  //     <primitive object={scene} userData={{ store }} onPointerOver={(e) => (e.stopPropagation(), setHover(true))} onPointerOut={(e) => setHover(false)} {...materialProps}/>
  //     <Edges visible="true" scale={1.01} renderOrder={0}> {/* {isSelected} */}
  //       <meshBasicMaterial transparent color="#333" depthTest={true} />
  // <meshBasicMaterial wireframe />
  //     </Edges>
  //   </mesh>


  //console.log('nodes', nodes);

  // FootL : Bone {uuid: '45e3cb31-fe2f-4601-936f-1ab2456b6e1a', name: 'FootL', type: 'Bone', parent: Bone, children: Array(2), …}
  // FootL_1 : Mesh {uuid: 'def30381-c434-430c-a85c-ceb96372aa87', name: 'FootL_1', type: 'Mesh', parent: Bone, children: Array(0), …}
  // FootL_end : Object3D {uuid: '1e5ab1d1-6855-4e05-b7c0-b3c8188fd441', name: 'FootL_end', type: 'Object3D', parent: Bone, children: Array(0), …}

  // var meshs = nodes.forEach((m) => {
  //   return <mesh receiveShadow castShadow geometry={m.geometry} material={m.material} material-color="red"/>
  // })

  // var meshs = ''
  // for (let key in nodes) {
  //   meshs += <mesh receiveShadow castShadow geometry={nodes[key].geometry} material={nodes[key].material} material-color="red"/>
  // }

  //const [set, state] = useState(false);