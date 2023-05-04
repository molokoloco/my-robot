// Created by Anderson Mancini 2023
// React Three Fiber AutoFocus Component to be used
// as an extension for default Depth Of Field from react-three/postprocessing

// HOW TO USE?
// import AutoFocusDOF from './AutoFocusDOF'
//
// And add this component inside the EffectsComposer...
//...
// <EffectComposer>
//  <AutoFocusDOF 
//    bokehScale={10} //blur scale
//    resolution={1024} //resolution (decrease for performance)
//    mouseFocus //if false, the center of the screen will be the focus
//    focusSpeed={0.05} //miliseconds to focus a new detected mesh
//    focalLength={0.01} //how far the focus should go
//  />
// </EffectComposer>
//...

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { DepthOfField } from '@react-three/postprocessing'
import { Raycaster, Vector2, Vector3 } from 'three'

export default function AutoFocusDOF({ bokehScale = 10, focalLength = 0.001, focusSpeed = 0.05, mouseFocus = false, resolution = 512 }) {
    const { camera, mouse, scene } = useThree()

    const ref = useRef()
    const raycaster = new Raycaster()
    const finalVector = new Vector3()

    raycaster.firstHitOnly = true


    useFrame((state) => {
        if (mouseFocus) {
            raycaster.setFromCamera(mouse, camera)
        } else {
            raycaster.setFromCamera(new Vector2(0, 0), camera)
        }

        const intersects = raycaster.intersectObjects(scene.children)

        if (intersects.length > 0) {
            finalVector.lerp(intersects[0].point, focusSpeed)
            ref.current.target = finalVector
        }
    });

    return (
        <DepthOfField
            focalLength={focalLength}
            bokehScale={bokehScale}
            height={resolution}
            ref={ref}
        />
    );

};

// VERY IMPORTANT!!!
// This component is always searching for points on meshes and
// can have an impact on the performance if you are not using <Bvh>.
// Using <Bvh> is a must to use this component. Be sure to import <Bvh>
// and to embrace all your scene with it
// 
// Example
// 
// <Canvas>
//  <Bvh firstHitOnly>
//      <----Your Model />
//  </Bvh>
// </Canvas>
//
// KNOWN ISSUES
// If you add components that covers the entire screen, like the Sparkles, 
// the AutoFocus will see them and will not be able to focus in the objects
// behind them.