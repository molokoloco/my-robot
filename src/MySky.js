import { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';

import { debounce } from "lodash";

import * as THREE from 'three';

import { Sky } from 'three/examples/jsm/objects/Sky.js';

// camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 2000000 );
// camera.position.set( 0, 100, 2000 );

export default function MySky() {
    //console.log('MySky()');
    const mesh = useRef()

    let mySky = new Sky()
    mySky.scale.setScalar( 450000 )
    //mySky.material.opacity = 0.2;
    //mySky.material.color = new THREE.Color( 'red' ).convertSRGBToLinear()

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 0.3,
        azimuth: 160,
        exposure: 0.4
    }
    
    const uniforms = mySky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity
    uniforms[ 'rayleigh' ].value = effectController.rayleigh
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG
    uniforms[ 'diffuse' ] = { type: "c", value: { r:1, g:0, b:0 } }

    var elevation = effectController.elevation
    let sun = new Vector3()
    var int = null

    useFrame((state, delta) => {
      if (!int) int = setTimeout(() => {
        //console.log('debounceAnim')
        elevation += 0.003
        if (elevation > 50) elevation = 0.2;
        const phi = MathUtils.degToRad( 90 - elevation )
        const theta = MathUtils.degToRad( effectController.azimuth )
        sun.setFromSphericalCoords( 1, phi, theta )
        mesh.current.material.uniforms[ 'sunPosition' ].value.copy( sun )
        int = null
      }, 1000);
    })

    // const debounceAnim = function(elevation, mesh) {
    ////   debounce(async () => {
    //     console.log('debounceAnim')
    //     elevation += 0.003
    //     if (elevation > 50) elevation = 0.2;
    //     let sun = new Vector3()
    //     const phi = MathUtils.degToRad( 90 - elevation )
    //     const theta = MathUtils.degToRad( effectController.azimuth )
    //     sun.setFromSphericalCoords( 1, phi, theta )
    //     mesh.current.material.uniforms[ 'sunPosition' ].value.copy( sun )

    // //  }, 500)
    // }
    // const debouncedChangeHandler = useCallback( () => {
    //   console.log('debounceAnim')
    //   debounce(debounceAnim, elevation, mesh, 300)
    // }, [elevation, mesh]);
    // useFrame(() => debouncedChangeHandler());

    // useEffect(() => {
    //   return () => {
    //     debounceAnim.cancel();
    //   }
    // }, []);

    return (
      <primitive ref={mesh} object={mySky} />
    )
}