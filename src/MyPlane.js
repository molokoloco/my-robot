import { useRef } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

// Textures
import TEXTURE_PATH from "./assets/grid.png"
import DISPLACEMENT_PATH from "./assets/displacement.png"
import METALNESS_PATH from "./assets/metalness.png"
import GRASS_PATH from "./assets/grass2.jpg" 

export default function MyPlane(...props) {
    //console.log('MySky()')
    const mesh1 = useRef()
    //const mesh2 = useRef()

    const [
      gridTexture,
      terrainTexture,
      metalnessTexture,
      grass
    ] = useLoader(THREE.TextureLoader, [
      TEXTURE_PATH,
      DISPLACEMENT_PATH,
      METALNESS_PATH,
      GRASS_PATH
    ]) 

    // grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
    // grass.repeat.set(20,20)
    // grass.needsUpdate = true

    // useFrame(({ clock }) => {
    //   const elapsedTime = clock.getElapsedTime();
    //   //console.log('mesh1.current', mesh1.current ? mesh1.current : 'nop');
    //   mesh1.current.position.z = (elapsedTime) % 30;
    //   mesh2.current.position.z = ((elapsedTime) % 30) - 30;
    // })

    // const geometry = new THREE.BoxGeometry( 20, 20, 20 );

    // for ( let i = 0; i < 2000; i ++ ) {

    //   const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

    //   object.position.x = Math.random() * 800 - 400;
    //   object.position.y = Math.random() * 800 - 400;
    //   object.position.z = Math.random() * 800 - 400;

    //   object.rotation.x = Math.random() * 2 * Math.PI;
    //   object.rotation.y = Math.random() * 2 * Math.PI;
    //   object.rotation.z = Math.random() * 2 * Math.PI;

    //   object.scale.x = Math.random() + 0.5;
    //   object.scale.y = Math.random() + 0.5;
    //   object.scale.z = Math.random() + 0.5;

    //   scene.add( object );

    // }

    return (
      <>
        <mesh ref={mesh1} position={[0, 1, 0]} rotation={[-Math.PI * 0.5, 0, Math.PI * 0.5]} >
          <planeBufferGeometry args={[60, 60, 60, 60]} />
          <meshStandardMaterial
            map={gridTexture}
            displacementMap={terrainTexture}
            displacementScale={10}
            bumpMap={grass}
            bumpScale={0.4}
            roughness={0.5}
            metalnessMap={metalnessTexture}
            metalness={0.96}
            emissive="#102a03"
            color="#205806"/>
        </mesh>
        {/* <mesh ref={mesh2} position={[0, 1, 0]} rotation={[-Math.PI * 0.5, 0 , Math.PI * 0.5]} >
          <planeBufferGeometry args={[50,50,50,50]} />
          <meshStandardMaterial
            side={THREE.DoubleSide}  
            map={gridTexture}
            displacementMap={terrainTexture}
            displacementScale={15}
            metalnessMap={metalnessTexture}
            metalness={0.96}
            roughness={0.5} />
        </mesh> */}
      </>
    )
}