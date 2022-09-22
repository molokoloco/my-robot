import React from 'react';
import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'


/*
class Words3d extends React.Component { // React.PureComponent ?
  state = {
		words: []
	};

	constructor(props) {
		super(props);
    this.randomWords = [
        'Internet', 'Multimédia', 'développement', 'Photoshop', 'news', 'réseaux sociaux', '2D/3D', 'vidéo', 'animations', 'audio', 'dataviz', 'interactivité', 'IA ...',
        '<HTML5/> (Jade/Emmet)', 'JavaScript() (React/jQuery/Tree/Boostrap)', 'CSS3{} (SASS/LESS)', 'SVG/PSD/AI', 'NodeJS{} (NPM/Yarn)', 'Linux (Shell/Cmd)', 'PHP/Apache', 'MySQL', 'MangoDB', 'XML/JSON/RSS',
        'Amazon AWS (CloudFormation/EC2/S3/...)', 'Google Cloud (Dialog Flow/Translate/Analytics/etc)', 'Docker', 'GIT (GitHub/Gitlab)', 'API (OpenAPI)', 'WordPress (Custom)', 'SEO', 'Security', 'Social Networks'
    ];
	}

  shouldComponentUpdate() {
    console.log('Words3d - shouldComponentUpdate');
    return false;
  }


  word({ children, ...props }) {
    const color = new THREE.Color()
    const fontProps = { font: 'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.11.0/font/roboto/Roboto-Regular.woff', fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
    const ref = useRef()
    const [hovered, setHovered] = useState(false)
    const over = (e) => (e.stopPropagation(), setHovered(true))
    const out = () => setHovered(false)
    // Change the mouse cursor on hover
    useEffect(() => {
      if (hovered) document.body.style.cursor = 'pointer'
      return () => (document.body.style.cursor = 'auto')
    }, [hovered])
    // Tie component to the render-loop
    useFrame(({ camera }) => {
      // Make text face the camera
      ref.current.quaternion.copy(camera.quaternion)
      // Animate font color
      ref.current.material.color.lerp(color.set(hovered ? 'yellow' : '#0971f1'), 0.1)
    })
    return <Text ref={ref} onPointerOver={over} onPointerOut={out} onClick={() => console.log('clicked')} {...props} {...fontProps} children={children} />
  }

  buildWords() {
    const myWords = [];
    const spherical = new THREE.Spherical()
    const count = this.randomWords.length > this.props.maxCount ? this.props.maxCount : this.randomWords.length;
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count
    for (let i = 1; i < count + 1; i++) {
        for (let j = 0; j < count; j++) {
          myWords.push([new THREE.Vector3().setFromSpherical(spherical.set(this.props.radius, phiSpan * i, thetaSpan * j)), this.randomWords[i]])
        }
    }
    return myWords
  }

  componentDidMount() {
    console.log('Words3d - componentDidMount lifecycle');
    this.setState({words: this.buildWords.map(([pos, word], index) => <Word key={index} position={pos} children={word} />)});
  }

  render() {
    console.log('Words3d - Render');
    return this.state.words;
  }
}
*/

const randomWords = [
    '', 'Internet', 'Multimédia', 'développement', 'Photoshop', 'News', 'Réseaux sociaux', '2D/3D', 'Vidéo', 'Animations', 'Audio', 'Dataviz', 'IA ...',
    '<HTML5/>', 'JavaScript()', 'CSS3{}', 'SVG/PSD/AI', 'NodeJS()', 'Linux', 'PHP/Apache', 'MySQL', 'MangoDB', 'XML/JSON/RSS',
    'Amazon AWS', 'Google Cloud', 'Docker', 'GIT', 'API', 'WordPress', 'SEO', 'Security', 'Social Networks'
];
/*
const randomWords = [
    '', 'Internet', 'Multimédia', 'développement', 'Photoshop', 'News', 'Réseaux sociaux', '2D/3D', 'Vidéo', 'Animations', 'Audio', 'Dataviz', 'IA ...',
    '<HTML5/> (Jade/Emmet)', 'JavaScript() (React/jQuery/Tree/Boostrap)', 'CSS3{} (SASS/LESS)', 'SVG/PSD/AI', 'NodeJS{} (NPM/Yarn)', 'Linux (Shell/Cmd)', 'PHP/Apache', 'MySQL', 'MangoDB', 'XML/JSON/RSS',
    'Amazon AWS (CloudFormation/EC2/S3/...)', 'Google Cloud (Dialog Flow/Translate/Analytics/etc)', 'Docker', 'GIT (GitHub/Gitlab)', 'API (OpenAPI)', 'WordPress (Custom)', 'SEO', 'Security', 'Social Networks'
];
*/


function Word({ children, ...props }) {
  const color = new THREE.Color()
  const fontProps = { font: 'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.11.0/font/roboto/Roboto-Regular.woff', fontSize: 0.6, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
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
    ref.current.material.color.lerp(color.set(hovered ? 'yellow' : '#0971f1'), 0.1)
  })
  return <Text ref={ref} onPointerOver={over} onPointerOut={out} onClick={() => console.log('clicked')} {...props} {...fontProps} children={children} />
}

export default function Words3d({ maxCount = 10, radius = 20, ...props }) {
  console.log('Words3d()');

  var ref = useRef()

  var words = useMemo(() => {
    const temp = []
    const spherical = new THREE.Spherical()
    const count = randomWords.length > maxCount ? maxCount : randomWords.length;
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++) temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), randomWords[i+j]])
    return temp
  }, [maxCount, radius])

  // useFrame(({ clock }) => (
  //   ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3)
  // })
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.z = Math.sin(t / 1.5) / 8
    ref.current.rotation.x = Math.cos(t / 4) / 8
    ref.current.rotation.y = Math.sin(t / 4) / 8
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })

  //return words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />)

  words = words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />)

  return (
    <group ref={ref}>
      {words}
    </group>
  )
}