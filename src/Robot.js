import React, {useState, useEffect, useRef} from "react";
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let previousAction, 
    mixer,
    gui,
    actions,
    activeAction,
    face;

let stats,
    clock,
    controls,
    camera,
    scene,
    model;

const api = {
    state: 'Walking'
};

function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 4));
}

const Robot = (props) => {

  const refContainer = useRef();
  const [loading, setLoading] = useState(true);
  let [renderer, setRenderer] = useState();

  useEffect(() => {
    const {current: container} = refContainer;

    if (container && !renderer) {

      const scW = container.clientWidth;
      const scH = container.clientHeight;

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
      scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
      camera.position.set(-5, 3, 10);
      camera.lookAt(new THREE.Vector3(0, 2, 0));
      
      //const scale = 3;
      //camera = new THREE.OrthographicCamera(-scale, scale, scale, -scale, 0.01, 50000);
      //  camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.01, 50000 );

      const target = new THREE.Vector3(-0.5, 1.2, 0);
      const initialCameraPosition = new THREE.Vector3(20 * Math.sin(0.2 * Math.PI), 10, 20 * Math.cos(0.2 * Math.PI));

      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
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
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({color: 0x999999, depthWrite: false}));
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);

      const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
      grid.material.opacity = 0.2;
      grid.material.transparent = true;
      scene.add(grid);

      /* function loadGLTFModel(scene, glbPath, options) {
        const { receiveShadow, castShadow } = options;
        return new Promise((resolve, reject) => {
          const loader = new GLTFLoader();
          loader.load(
            glbPath,
            (gltf) => {
              const obj = gltf.scene;
              obj.name = "dinosaur";
              obj.position.y = 0;
              obj.position.x = 0;
              obj.receiveShadow = receiveShadow;
              obj.castShadow = castShadow;
              scene.add(obj);

              obj.traverse(function (child) {
                if (child.isMesh) {
                  child.castShadow = castShadow;
                  child.receiveShadow = receiveShadow;
                }
              });

              resolve(obj);
            },
            undefined,
            function (error) {
              console.log(error);
              reject(error);
            }
          );
        });
      } */

      // model //https://threejs.org/models/gltf/RobotExpressive/RobotExpressive.glb
      // Viewver https://gltf-viewer.donmccurdy.com/
      const loader = new GLTFLoader();
      loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', function (gltf) { // ./assets/RobotExpressive.glb
        model = gltf.scene;
        scene.add(model);
        createGUI(model, gltf.animations);
        animate();
        setLoading(false);
      }, undefined, function (e) {
        console.error('GLTFLoader error:', __dirname, e);
      });

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
        req = requestAnimationFrame(animate);
        //frame = frame <= 100 ? frame + 1 : frame;

        //if (frame <= 100) {
            // const p = initialCameraPosition;
            // const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20;
            // camera.position.y = 10;
            // camera.position.x =
            //   p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed);
            // camera.position.z =
            //   p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
            // camera.lookAt(target);

            const dt = clock.getDelta();
            if (mixer) mixer.update(dt);
            stats.update();
            controls.update();

        //}// else {
          
        //}

        renderer.render(scene, camera);
      };

      return () => {
        cancelAnimationFrame(req);
        renderer.dispose();
      };

    }
  }, []);

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
    activeAction = actions['Walking'];
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
      style={{ height: "100px", width: "100%", minHeight:"100vh", position: "relative" }}
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