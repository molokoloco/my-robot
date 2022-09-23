import { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

// camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
// camera.position.set( 0, 100, 2000 );

export default function MySky() {
    //console.log('MySky()');
    const mesh = useRef()

    let mySky = new Sky()
    mySky.scale.setScalar( 450000 )
    let sun = new Vector3()

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 0.8,
        azimuth: 180,
        exposure: 0.4
    }
    
    const uniforms = mySky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity
    uniforms[ 'rayleigh' ].value = effectController.rayleigh
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG
    const phi = MathUtils.degToRad( 90 - effectController.elevation )
    const theta = MathUtils.degToRad( effectController.azimuth )
    sun.setFromSphericalCoords( 1, phi, theta )
    uniforms[ 'sunPosition' ].value.copy( sun )

    var elevation = effectController.elevation;

    useFrame((state, delta) => {
      //console.log(mesh.current)

      elevation += 0.02

      let sun = new Vector3()
      const phi = MathUtils.degToRad( 90 - elevation )
      const theta = MathUtils.degToRad( effectController.azimuth )
      sun.setFromSphericalCoords( 1, phi, theta )
      mesh.current.material.uniforms[ 'sunPosition' ].value.copy( sun )

      //mesh.current.material.uniforms[ 'elevation' ].value = mesh.current.uniforms[ 'elevation' ].value + 0.1
    })

    return (
      <primitive ref={mesh} object={mySky} />
    )
}

/*

export default function MySky() {
    console.log('MySky()');
    const mesh = useRef()

    let mySky = new Sky()
    mySky.scale.setScalar( 450000 )
    let sun = new Vector3()

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 0.8,
        azimuth: 180,
        exposure: 0.4
    }
    
    const uniforms = mySky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity
    uniforms[ 'rayleigh' ].value = effectController.rayleigh
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG
    const phi = MathUtils.degToRad( 90 - effectController.elevation )
    const theta = MathUtils.degToRad( effectController.azimuth )
    sun.setFromSphericalCoords( 1, phi, theta )
    uniforms[ 'sunPosition' ].value.copy( sun )

    useFrame((state, delta) => {
      console.log(mesh.current)
      //mesh.current.uniforms[ 'elevation' ].value = mesh.current.uniforms[ 'elevation' ].value + 0.1
    })

    return (
      <primitive ref={mesh} object={mySky} />
    )
}

*/