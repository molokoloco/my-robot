import React from 'react'
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { useGLTF, useAnimations, Edges, ContactShadows} from '@react-three/drei'
import { proxy, useSnapshot } from "valtio"

import pixTrans from './assets/pix.png'

// const state = proxy({
//   current: null,
//   items: {
//     laces: "#ffffff",
//     mesh: "#ffffff"
//   },
// })

let previousAction, mixer, actions, activeAction, face, rdmAction
const api = {
  state: 'Idle'
}

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
  //const { ref, actions, names, mixer } = useAnimations(animations, scene)
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
  // console.log('api', api, 'states', states, 'emotes', emotes, 'expressions', expressions);
  // console.log('face.morphTargetDictionary',face.morphTargetDictionary,'expressions',expressions);

  let interval, interMorph, timeOut = null

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
      rdmAction = states[Math.floor(Math.random() * states.length)]
      fadeToAction(rdmAction, 0.5)
      console.log('rdmAction', rdmAction)
      
      timeOut = setTimeout(() => {
        var rdmEmote = emotes[Math.floor(Math.random() * emotes.length)]
        api[rdmEmote]();
        console.log('rdmEmote', rdmEmote)
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

  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);

  const onHover = useCallback((e, value) => {
    // console.log('onHover', value);
    // e.stopPropagation();
    // setHovered(value);
    document.body.style.cursor = (value ? 'pointer' : 'auto')
  }, []); //setHovered

  const robotClick = useCallback((e) => {
    //setActive(!active);
    rdmAction = 'Dance' //states[Math.floor(Math.random() * states.length)]
    fadeToAction(rdmAction, 0.5)
    console.log('robotClick', rdmAction)
    
    // activeAction = actions[rdmAction]
    // activeAction.play()
    
    // var t = 'Jump'; //actionsList[Math.floor(Math.random() * actionsList.length)]
    // api[t]();
    // console.log('api', api);
    // setIndex((index + 1) % names.length)
  }, [fadeToAction, rdmAction]); //setActive

  const [textureTrans] = useLoader(THREE.TextureLoader, [pixTrans]) 

  // nodes  = 'FootL_1', 'LowerLegL_1', 'LegL', 'LowerLegR_1', 'LegR', 'Head_2', 'Head_3', 'Head_4', 'ArmL', 'ShoulderL_1', 'ArmR', 'ShoulderR_1', 'Torso_2', 'Torso_3', 'FootR_1', 'HandR_1', 'HandR_2', 'HandL_1', 'HandL_2'
  // materials = 'Black', 'Grey', 'Main'

  // let mi = 0;
  // const getMesh = function(name) {
  //   return <mesh
  //     key={mi++}
  //     castShadow
  //     receiveShadow
  //     geometry={nodes[name].geometry}
  //     material={materials.Main}
  //     material-color={(name == 'Head_4' ? 'Pink' : 'Yellow')}
  //     onPointerOver={(e) => onHover(e, true)}
  //     onPointerOut={(e) => onHover(e, false)}></mesh>
  // }

  // let MyMesh = [];

  scene.traverse((obj) => { // Recolor the ROBOT
    if (obj.isMesh) {
      //obj.receiveShadow = true
      //obj.castShadow = true
      // const material = NodeMaterial.fromMaterial( obj.material )
      // obj.material = new THREE.MeshBasicMaterial( { color: 0xd4d4d4 } )
      obj.material.color = new THREE.Color(obj.name == 'Head_4' ? 'pink' : 'yellow' ).convertSRGBToLinear()
      obj.material.needsUpdate = true
      //MyMesh.push(getMesh(obj.name));
    }
  })

  // onContextMenu

  return (
    <group ref={ref} dispose={null} {...props}>
      {/* {MyMesh} */}
      <mesh castShadow={false} >{/* raycast={useCamera(anotherCamera)} */}
        <primitive object={scene} onClick={console.log} />
      </mesh>
      <mesh position={[0, 2, 0]} visible={false} 
        onPointerOver={(e) => onHover(e, true)}
        onPointerOut={(e) => onHover(e, false)}
        onPointerDown={robotClick}
        >
        <boxGeometry args={[3*1.2, 5*1.2, 3*1.2]}/>
        <meshBasicMaterial alphaTest="0.5" wireframe />
        {/* <meshBasicMaterial opacity="0" transparent="true" thickness="0" transmission="0" depthTest={true}/> */}
        {/* wireframe map={textureTrans} alphaTest="true" needUpdate="true" transparent="false" opacity="0.5" depthWrite="false" side={THREE.DoubleSide} color   */}
      </mesh>
      {/* <ContactShadows position={[0, 0, 0]} opacity={0.75} scale={10} blur={2.5} far={4} /> */}
    </group>
  )
}