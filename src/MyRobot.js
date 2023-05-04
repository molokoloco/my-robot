import React from 'react'
import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
//import { proxy, useSnapshot } from "valtio"

import RobotExpressive from './assets/RobotExpressive.glb'
//import pixTrans from './assets/pix.png'
import start from './assets/start.mp3'

const startSound =   new Audio(start);

// const state = proxy({
//   current: null,
//   items: {
//     laces: "#ffffff",
//     mesh: "#ffffff"
//   },
// })

let previousAction, mixer, actions, activeAction, face, rdmAction

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

////////////////////////////////////

export default function Robot({ ...props }) {
  //console.log('Robot()')

  const ref = useRef()

  const { scene, animations } = useGLTF(RobotExpressive) // https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb
  // const { ref, actions, names, mixer } = useAnimations(animations, scene)
  // const [hovered, setHovered] = useState(false)
  // const [index, setIndex] = useState(0)
  // actions['Idle'].play()

  ////////////////////////////////////

  const myPres_fr = `Bonjour, je suis Julien Guézennec, j'ai créé mes premiers sites en 1998 et je suis devenu passionné d'Internet, du code et du multimédia. Depuis 24 ans, je n'ai cessé d'apprendre. Entre autres, Je suis spécialisé dans le développement front et back-end de sites desktop et mobiles et expert dans de nombreux domaines. J'aime concevoir et développer des interfaces utilisateur. Je me soucie de l'UX, de la réactivité, de l'accessibilité et de la maintenabilité.`
  const myPres_en = `Hello, I am Julien Guézennec, I created my first sites in 1998 and I became passionate about the Internet, code and multimedia. For 24 years, I haven't stopped learning. I am specialized in the front and back-end development of desktop and mobile sites and an expert in many fields. I enjoy designing and developing user interfaces. I care about UX, responsiveness, accessibility and maintainability.`

  var msg, voices, myPres, male, speaking, searchString = null

  if (('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window)) {
    voices = window.speechSynthesis.getVoices()
    msg = new SpeechSynthesisUtterance()
  }

  const setupLang = function () {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return false;
    if (window.visitorLang && window.visitorLang === 'en') {
      myPres = myPres_en
      msg.lang = 'en-GB'
      searchString = new RegExp(/English Male/, 'ig')
    }
    else {
      myPres = myPres_fr
      msg.lang = 'fr-FR'
      searchString = new RegExp(/Paul/, 'ig')
    }
    male = null
    for (var i = 0; i < voices.length; i++) {
      if (searchString.test(voices[i].name)) {
        male = voices[i]
        break
      }
    }
    if (male) msg.voice = male
    return true;
  }      

  const states = ['Idle', 'Walking', 'Running', 'Dance'] //, 'Death', 'Standing', 'Sitting'
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

  // const expressions = Object.keys(face.morphTargetDictionary)
  // console.log('api', api, 'states', states, 'emotes', emotes, 'expressions', expressions);
  // console.log('face.morphTargetDictionary',face.morphTargetDictionary,'expressions',expressions);

  let interval, interMorph, timeOut, sayHello = null

  useEffect(() => {

    activeAction = actions[api.state]
    activeAction.play()

    sayHello  = setTimeout(() => {
      if (setupLang()) {
        msg.text = 'Bonjour !'
        window.speechSynthesis.speak(msg)
      }
    }, 5000);
    
    interMorph = setInterval(() => {
      let customMorph = Math.random() > 0.5 ? 1 : 0; // 0 Angry 1 Surprised
      if (customMorph === 1) {
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
      //console.log('rdmAction', rdmAction)
      timeOut = setTimeout(() => {
        var rdmEmote = emotes[Math.floor(Math.random() * emotes.length)]
        api[rdmEmote]();
      }, 6000)
    }, 10000)

    return () => {
      clearTimeout(timeOut)
      clearInterval(interMorph)
      clearInterval(interval)
      clearTimeout(sayHello)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [actions, api]);

  // let mixer = new THREE.AnimationMixer(scene);
  // animations.forEach((clip) => {
  //     const action = mixer.clipAction(clip);
  //     action.play();
  // });

  let frame = 0
  
  useFrame((state, delta) => {
    frame = frame <= 100 ? frame + 1 : frame
    if (frame <= 100) ref.current.rotation.y += 6 / frame // Turn at start
    mixer.update(delta)
  }, [mixer]);

  //const [active, setActive] = useState(false);
  //const [hover, setHover] = useState(false);

  const onHover = useCallback((e, value) => {
    document.body.style.cursor = (value ? 'pointer' : 'auto')
  }, []);      

  ////////////////////////////////////

  const robotClick = (e) => {
    rdmAction = states[Math.floor(Math.random() * states.length)] // 'Dance'
    fadeToAction(rdmAction, 0.5)
    // console.log('robotClick', rdmAction)
    
    if (!speaking && 'speechSynthesis' in window) {
      speaking = true
      if (setupLang()) {
        msg.text = myPres
        window.speechSynthesis.speak(msg)
      }
    }
    else if (speaking) {
      speaking = false
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      startSound.play()
    }
    return false;
  }

  // nodes  = 'FootL_1', 'LowerLegL_1', 'LegL', 'LowerLegR_1', 'LegR', 'Head_2', 'Head_3', 'Head_4', 'ArmL', 'ShoulderL_1', 'ArmR', 'ShoulderR_1', 'Torso_2', 'Torso_3', 'FootR_1', 'HandR_1', 'HandR_2', 'HandL_1', 'HandL_2'
  // materials = 'Black', 'Grey', 'Main'
  // let MyMesh = [];

  scene.traverse((obj) => { // Recolor the ROBOT
    if (obj.isMesh) {
      obj.receiveShadow = true
      obj.castShadow = true
      // const material = NodeMaterial.fromMaterial( obj.material )
      // obj.material = new THREE.MeshBasicMaterial( { color: 0xd4d4d4 } )
      obj.material.color = new THREE.Color(obj.name === 'Head_4' ? 'pink' : 'yellow' ).convertSRGBToLinear()
      obj.material.flatShading =  false
      obj.material.needsUpdate = true
      //MyMesh.push(getMesh(obj.name));
    }
  })

  ////////////////////////////////////

  return (
    <group ref={ref} dispose={null} {...props} position={[0, 2.5, 0]} >
      <mesh>
        <primitive object={scene} onClick={console.log} />
      </mesh>
      <mesh
        position={[0, 2, 0]}
        visible={false} 
        onPointerOver={(e) => onHover(e, true)}
        onPointerOut={(e) => onHover(e, false)}
        onPointerDown={robotClick} >
        <boxGeometry args={[3*1.2, 5*1.2, 3*1.2]}/>
        <meshBasicMaterial alphaTest="0.5" />
      </mesh>
    </group>
  )
}