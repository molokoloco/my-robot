import React from 'react';
import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

import stop from './assets/stop.mp3' // https://pixabay.com/sound-effects/search/beeps/

const stopSound =   new Audio(stop);

const randomWords = [
    '', 'Internet', 'Multimédia', 'développement', 'Photoshop', 'News', 'Réseaux sociaux', '2D/3D', 'Vidéo', 'Animations', 'Audio', 'Dataviz', 'IA',
    '<HTML5/>', 'JavaScript()', 'CSS3{}', 'WebGL', 'SVG/PSD/AI', 'NodeJS()', 'Linux', 'PHP/Apache', 'MySQL', 'MangoDB', 'XML/JSON/RSS',
    'Amazon AWS', 'Google Cloud', 'Facebook App', 'Docker', 'GIT', 'API', 'WordPress', 'SEO', 'Security', 'Social Networks'
];

function Word({ children, ...props }) {
  const color = new THREE.Color()
  const fontProps = { font: 'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.11.0/font/roboto/Roboto-Regular.woff', fontSize: 0.4, letterSpacing: 0, lineHeight: 1 }
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const over = (e) => {
    e.stopPropagation()
    setHovered(true)
  }
  const out = () => setHovered(false)
  
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => (document.body.style.cursor = 'auto')
  }, [hovered])

  useFrame(({ camera }) => {
    ref.current.quaternion.copy(camera.quaternion) // Make text face the camera
    ref.current.material.color.lerp(color.set(hovered ? 'yellow' : 'hotpink'), 0.1)
  })
  
  return <Text ref={ref} onPointerOver={over} onPointerOut={out} onClick={() => stopSound.play()} {...props} {...fontProps} children={children} />
}

export default function Words3d({ maxCount = 10, radius = 20, ...props }) {
  //console.log('Words3d()');

  var ref = useRef()
  var wordsLength = randomWords.length

  var tmpWords = [...randomWords].sort(() => Math.random() - 0.5)

  var words = useMemo(() => {
    const temp = []
    const spherical = new THREE.Spherical()
    let count = Math.floor(Math.sqrt(wordsLength))
    count = count > maxCount ? maxCount : count;
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++) temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), tmpWords.shift()]) // randomWords[i+j]
    return temp
  }, [wordsLength, maxCount, radius, tmpWords])

  // useFrame(({ clock }) => {
  //   ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3
  // })
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.z = Math.sin(t / 1.5) / 8
    ref.current.rotation.x = Math.cos(t / 4) / 8
    ref.current.rotation.y = Math.sin(t / 4) / 8
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  words = words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />)

  return (
    <group ref={ref}>
      {words}
    </group>
  )
}