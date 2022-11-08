import React from 'react';
import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

import stop from './assets/stop.mp3' // https://pixabay.com/sound-effects/search/beeps/

const stopSound =   new Audio(stop)

const randomWords_fr = [
    'Internet', 'Multimédia', 'Développement', 'JavaScript', 'HTML5', 'CSS3', 'SVG', 'JSON', 'RSS', 'WebAPI', 'WebGL', 'Canvas', 'jQuery', 'REACT', 'LESS', 'SASS', 'Three.JS', 'Bootstrap', 'NPM/Yarn', 'WebPack', 'Grunt', 'Visual Studio Code', 'CodeSandbox', 'NotePad', 'Photoshop', 'Illustrator', 'Media encoders', 'VLC', 'Wordpress', 'Google Cloud', 'Facebook App', 'Amazon AWS', 'CloudFlare', 'Intégration', 'Accessibilité', 'Internationalisation', 'Design/UX', 'Charte graphiques', 'Animation', 'Interactivité', 'Multimédia', 'Pixel/2D/3D', 'Audio', 'Typographie', 'SEO', 'Wording', 'Sécurité', 'Mailing', 'Dataviz', 'IA', 'Analytics', 'Veille', 'Community', 'Management', 'Formation', 'Démonstration', 'Présentation', 'Back-end', 'Serveurs', 'Linux', 'Windows', 'SAAS', 'PHP', 'Templates', 'YAML', 'XML', 'JSON', 'RSS', 'WebSocket', 'Express.js', 'OpenAPI', 'Wordpress', 'Socket.io', 'Custom', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'NodeJS', 'Git/GitHub', 'GitLab', 'Cmd/Shell/Bash', 'OpenSSH', 'Apache', 'Nginx', 'Docker', 'VirtualBox', 'VLC', 'CDN', 'Sécurité', 'CRON', 'Mnitoring', 'Dashboard', 'Streaming', 'Cache', 'Gestion DNS', 'Load-balancing', 'Reporting', 'SSL', 'OVH', 'Gandi', 'GitHub', 'Serverless', 'Documentation', 'Art'
]

const randomWords_en = [
    'Internet', 'Multimedia', 'Development', 'JavaScript', 'HTML5', 'CSS3', 'SVG', 'JSON', 'RSS', 'WebAPI', 'WebGL', 'Canvas', 'jQuery ', 'REACT', 'LESS', 'SASS', 'Three.JS', 'Bootstrap', 'NPM/Yarn', 'WebPack', 'Grunt', 'Visual Studio Code', 'CodeSandbox', 'NotePad ', 'Photoshop', 'Illustrator', 'Media encoders', 'VLC', 'Wordpress', 'Google Cloud', 'Facebook App', 'Amazon AWS', 'CloudFlare', 'Integration', 'Accessibility', 'internationalization', 'Design/UX', 'Graphic charter', 'Animation', 'Interactivity', 'Multimedia', 'Pixel/2D/3D', 'Audio', 'Typography', 'SEO', 'Wording' , 'Security', 'Mailing', 'Dataviz', 'IA', 'Analytics', 'Watch', 'Community', 'Management', 'Training', 'Demonstration', 'Presentation', 'Back-end' , 'Servers', 'Linux', 'Windows', 'SAAS', 'PHP', 'templates', 'YAML', 'XML', 'JSON', 'RSS', 'WebSocket', 'Express.js' , 'OpenAPI', 'Wordpress', 'Socket.io', 'Custom', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'NodeJS', 'Git/GitHub', 'GitLab', ' Cmd/Shell/Bash', 'OpenSSH', 'Apa che', 'Nginx', 'Docker', 'VirtualBox', 'VLC', 'CDN', 'Security', 'CRON', 'Monitoring', 'dashboard', 'Streaming', 'Cache', 'DNS management ', 'Load-balancing', 'Reporting', 'SSL', 'OVH', 'Gandi', 'GitHub', 'Serverless', 'Documentation', 'Art'
]

var randomWords = null
var msg = null
var female = null
var voices = null
var searchString = null

const setupLang = function () {
  randomWords = (window.visitorLan && window.visitorLang === 'en' ? randomWords_en : randomWords_fr)
  searchString = (window.visitorLang && window.visitorLang === 'en' ? new RegExp(/English Female/, 'ig') : new RegExp(/julie/, 'ig')) // Only on reload for now :-/
  if ('speechSynthesis' in window) {
    voices = window.speechSynthesis.getVoices()
    msg = new SpeechSynthesisUtterance()
    msg.lang = (window.visitorLang && window.visitorLang === 'en' ? 'en-GB' : 'fr-FR')
    //msg.text = 'Bonjour la compagnie'
    //window.speechSynthesis.speak(msg);
    for (var i = 0; i < voices.length; i++) {
      if (searchString.test(voices[i].name)) {
        female = voices[i];
        break;
      }
    }
  }
}
setupLang()

// TOdo redraw words after lang change ! ///////////////

function Word({ children, ...props }) {

  const color = new THREE.Color()
  const fontProps = { font: 'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.11.0/font/roboto/Roboto-Regular.woff', fontSize: 0.26, letterSpacing: 0, lineHeight: 1 }
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
  
  return <Text ref={ref} onPointerOver={over} onPointerOut={out} onClick={(e) => {
    stopSound.play()
    setupLang();
    if (msg) setTimeout(() => {
      window.speechSynthesis.cancel()
      msg.text = children
      if (female) msg.voice = female;
      window.speechSynthesis.speak(msg);
    }, 300);
  }} {...props} {...fontProps} children={children} />
}

export default function Words3d({ maxCount = 10, radius = 20, ...props }) {
  //console.log('Words3d()');

  var ref = useRef()

  var words = useMemo(() => {
    const temp = []
    const spherical = new THREE.Spherical()
    var wordsLength = randomWords.length
    var tmpWords = [...randomWords].sort(() => Math.random() - 0.5)
    let count = wordsLength > maxCount ? maxCount : wordsLength;
    count = Math.floor(Math.sqrt(count))
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++)
        temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), tmpWords.shift()]) // randomWords[i+j]
    return temp
  }, [maxCount, radius])

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