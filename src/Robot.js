import React, {useState, useEffect, useRef} from "react";
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import WebGL from 'three/examples/jsm/capabilities/WebGL.js';

if ( WebGL.isWebGL2Available() === false ) {

  document.body.appendChild( WebGL.getWebGL2ErrorMessage() );

}

const Robot = (props) => {

  const refContainer = useRef();
  let [loading, setLoading] = useState(true);
  let [renderer, setRenderer] = useState();

  let previousAction, 
    mixer,
    gui,
    actions,
    activeAction,
    face,
    stats,
    clock,
    controls,
    camera,
    scene,
    model,
    mesh;

  const api = {
    state: 'Idle'
  };

  function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 4));
  }

  useEffect(() => {
    const {current: container} = refContainer;

    if (renderer) return;

    const scW = container.clientWidth;
    const scH = container.clientHeight;

    // eslint-disable-next-line
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(scW, scH);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    setRenderer(renderer);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    scene.fog = new THREE.Fog(0xe0e0e0, 10, 100);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 1000);
    camera.position.set(-10, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 5, 0));
    
    //const scale = 3;
    //camera = new THREE.OrthographicCamera(-scale, scale, scale, -scale, 0.01, 50000);
    //camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.01, 50000 );

    const target = new THREE.Vector3(0, 2, 0);
    const initialCameraPosition = new THREE.Vector3(20 * Math.sin(0.2 * Math.PI), 10, 20 * Math.cos(0.2 * Math.PI));

    controls = new OrbitControls(camera, renderer.domElement);
    //controls.autoRotate = true;
    controls.target = target;

    clock = new THREE.Clock();

    // lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 20, 10);
    scene.add(dirLight);

    // ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({color: 0x444444, depthWrite: false}));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const grid = new THREE.GridHelper(200, 100, 0x000000, 0x000000);
    grid.material.opacity = 0.1;
    grid.material.transparent = true;
    scene.add(grid);

    // model //https://threejs.org/models/gltf/RobotExpressive/RobotExpressive.glb
    // Viewver https://gltf-viewer.donmccurdy.com/
    const loader = new GLTFLoader();
    loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function (gltf) { // ./assets/RobotExpressive.glb
      model = gltf.scene;
      model.name = "Robot";
      model.position.y = 0.1;

      // model.receiveShadow = true;
      // model.castShadow = true;
      // model.traverse(function (child) {
      //   if (child.isMesh) {
      //     child.castShadow = true;
      //     child.receiveShadow = true;
      //   }
      // });
      scene.add(model);
      createGUI(model, gltf.animations);
      animate();
      setLoading(false);

    }, undefined, function (e) {
      console.error('GLTFLoader error:', e);
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Sky

    // const canvas = document.createElement( 'canvas' );
    // canvas.width = 1;
    // canvas.height = 32;

    // const context = canvas.getContext( '2d' );
    // const gradient = context.createLinearGradient( 0, 0, 0, 32 );
    // gradient.addColorStop( 0.0, '#014a84' );
    // gradient.addColorStop( 0.5, '#0561a0' );
    // gradient.addColorStop( 1.0, '#437ab6' );
    // context.fillStyle = gradient;
    // context.fillRect( 0, 0, 1, 32 );

    // const sky = new THREE.Mesh(
    // 	new THREE.SphereGeometry( 60 ),
    // 	new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( canvas ), side: THREE.BackSide } )
    // );
    // scene.add( sky );

    // Cloud Texture

    const size = 128;
    const data = new Uint8Array( size * size * size );

    let i = 0;
    const scale = 0.05;
    const perlin = new ImprovedNoise();
    const vector = new THREE.Vector3();

    for ( let z = 0; z < size; z ++ ) {
      for ( let y = 0; y < size; y ++ ) {
        for ( let x = 0; x < size; x ++ ) {
          const d = 1.0 - vector.set( x, y, z ).subScalar( size / 2 ).divideScalar( size ).length();
          data[ i ] = ( 128 + 128 * perlin.noise( x * scale / 1.5, y * scale, z * scale / 1.5 ) ) * d * d;
          i ++;
        }
      }
    }

    const texture = new THREE.Data3DTexture( data, size, size, size );
    texture.format = THREE.RedFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    // Material

    const vertexShader = /* glsl */`
      in vec3 position;

      uniform mat4 modelMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform vec3 cameraPos;

      out vec3 vOrigin;
      out vec3 vDirection;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
        vDirection = position - vOrigin;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = /* glsl */`
      precision highp float;
      precision highp sampler3D;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      in vec3 vOrigin;
      in vec3 vDirection;

      out vec4 color;

      uniform vec3 base;
      uniform sampler3D map;

      uniform float threshold;
      uniform float range;
      uniform float opacity;
      uniform float steps;
      uniform float frame;

      uint wang_hash(uint seed)
      {
          seed = (seed ^ 61u) ^ (seed >> 16u);
          seed *= 9u;
          seed = seed ^ (seed >> 4u);
          seed *= 0x27d4eb2du;
          seed = seed ^ (seed >> 15u);
          return seed;
      }

      float randomFloat(inout uint seed)
      {
          return float(wang_hash(seed)) / 4294967296.;
      }

      vec2 hitBox( vec3 orig, vec3 dir ) {
        const vec3 box_min = vec3( - 0.5 );
        const vec3 box_max = vec3( 0.5 );
        vec3 inv_dir = 1.0 / dir;
        vec3 tmin_tmp = ( box_min - orig ) * inv_dir;
        vec3 tmax_tmp = ( box_max - orig ) * inv_dir;
        vec3 tmin = min( tmin_tmp, tmax_tmp );
        vec3 tmax = max( tmin_tmp, tmax_tmp );
        float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
        float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
        return vec2( t0, t1 );
      }

      float sample1( vec3 p ) {
        return texture( map, p ).r;
      }

      float shading( vec3 coord ) {
        float step = 0.01;
        return sample1( coord + vec3( - step ) ) - sample1( coord + vec3( step ) );
      }

      void main(){
        vec3 rayDir = normalize( vDirection );
        vec2 bounds = hitBox( vOrigin, rayDir );

        if ( bounds.x > bounds.y ) discard;
        bounds.x = max( bounds.x, 0.0 );
        vec3 p = vOrigin + bounds.x * rayDir;
        vec3 inc = 1.0 / abs( rayDir );
        float delta = min( inc.x, min( inc.y, inc.z ) );
        delta /= steps;

        // Jitter
        // Nice little seed from
        // https://blog.demofox.org/2020/05/25/casual-shadertoy-path-tracing-1-basic-camera-diffuse-emissive/
        uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );
        vec3 size = vec3( textureSize( map, 0 ) );
        float randNum = randomFloat( seed ) * 2.0 - 1.0;
        p += rayDir * randNum * ( 1.0 / size );

        //
        vec4 ac = vec4( base, 0.0 );
        for ( float t = bounds.x; t < bounds.y; t += delta ) {
          float d = sample1( p + 0.5 );
          d = smoothstep( threshold - range, threshold + range, d ) * opacity;
          float col = shading( p + 0.5 ) * 3.0 + ( ( p.x + p.y ) * 0.25 ) + 0.2;
          ac.rgb += ( 1.0 - ac.a ) * d * col;
          ac.a += ( 1.0 - ac.a ) * d;
          if ( ac.a >= 0.95 ) break;
          p += rayDir * delta;
        }
        color = ac;
        if ( color.a == 0.0 ) discard;

      }
    `;

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.RawShaderMaterial( {
      glslVersion: THREE.GLSL3,
      uniforms: {
        base: { value: new THREE.Color( 0x798aa0 ) },
        map: { value: texture },
        cameraPos: { value: new THREE.Vector3() },
        threshold: { value: 0.25 },
        opacity: { value: 0.25 },
        range: { value: 0.1 },
        steps: { value: 100 },
        frame: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      transparent: true
    } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.scale.set(10, 10, 10);
    mesh.position.set(0, 10, 0);
    scene.add( mesh );

    //

    // const parameters = {
    // 	threshold: 0.25,
    // 	opacity: 0.25,
    // 	range: 0.1,
    // 	steps: 100
    // };

    // function update() {

    // 	material.uniforms.threshold.value = parameters.threshold;
    // 	material.uniforms.opacity.value = parameters.opacity;
    // 	material.uniforms.range.value = parameters.range;
    // 	material.uniforms.steps.value = parameters.steps;

    // }

    // const gui = new GUI();
    // gui.add( parameters, 'threshold', 0, 1, 0.01 ).onChange( update );
    // gui.add( parameters, 'opacity', 0, 1, 0.01 ).onChange( update );
    // gui.add( parameters, 'range', 0, 1, 0.01 ).onChange( update );
    // gui.add( parameters, 'steps', 0, 200, 1 ).onChange( update );


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);

    let req = null;
    let frame = 0;

    const animate = () => {
      frame = frame <= 100 ? frame + 1 : frame;
      if (frame <= 100) {
          const p = initialCameraPosition;
          const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20;
          camera.position.y = 10;
          camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed);
          camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
          camera.lookAt(target);
      }
      
      mesh.material.uniforms.cameraPos.value.copy( camera.position );
      mesh.rotation.y = - performance.now() / 7500;

      mesh.material.uniforms.frame.value ++;

      const dt = clock.getDelta();
      if (mixer) mixer.update(dt);
      stats.update();
      controls.update();

      renderer.render(scene, camera);
      req = requestAnimationFrame(animate);
    };

    return () => {
      cancelAnimationFrame(req);
      renderer.dispose();
    };

  }, [renderer]);

  function createGUI(model, animations) {

    const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

    gui = new GUI();
    mixer = new THREE.AnimationMixer(model);
    actions = {};

    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      const action = mixer.clipAction(clip);
      actions[clip.name] = action;

      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
      }
    }

    // states
    const statesFolder = gui.addFolder('States');
    const clipCtrl = statesFolder.add(api, 'state').options(states);
    clipCtrl.onChange(function () {
      fadeToAction(api.state, 0.5);
    });
    statesFolder.open();

    // emotes
    const emoteFolder = gui.addFolder('Emotes');
    function createEmoteCallback(name) {
      api[name] = function () {
        fadeToAction(name, 0.2);
        mixer.addEventListener('finished', restoreState);
      };
      emoteFolder.add(api, name);
    }

    function restoreState() {
      mixer.removeEventListener('finished', restoreState);
      fadeToAction(api.state, 0.2);
    }

    for (let i = 0; i < emotes.length; i++) {
      createEmoteCallback(emotes[i]);
    }

    emoteFolder.open();

    // expressions
    face = model.getObjectByName('Head_4');

    const expressions = Object.keys(face.morphTargetDictionary);
    const expressionFolder = gui.addFolder('Expressions');
    for (let i = 0; i < expressions.length; i++) {
      expressionFolder
        .add(face.morphTargetInfluences, i, 0, 1, 0.01)
        .name(expressions[i]);
    }
    activeAction = actions[api.state];
    activeAction.play();
    expressionFolder.open();
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

  return (
    <div
      style={{ minHeight:"100vh", position: "relative" }}
      ref={refContainer}
    >
      {loading && (
        <span style={{ position: "absolute", left: "50%", top: "50%" }}>
          Loading...
        </span>
      )}
    </div>
  );

};

const myRobot = () => {
  return (
    <Robot />
  );
}

export default myRobot;