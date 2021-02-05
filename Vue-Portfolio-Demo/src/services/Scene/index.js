import * as THREE from 'three';
import { Power4, TimelineMax, TweenMax } from 'gsap';
import * as dat from 'dat.gui';
import { EffectComposer, RenderPass, ShaderPass } from 'postprocessing';
import './shader';
import './rgbShader';
import initStage1 from './stage1';
import initStage2 from './stage2';
import initStage3 from './stage3';
import { map, clamp, isMobile } from '@/services/utils';
import { ease, ease2, ease3 } from '@/services/Easings';

require('three-obj-loader')(THREE);
const OrbitControls = require('three-orbit-controls')(THREE);

class Scene {
  constructor({ container, window, object }) {
    this.container = container;
    this.window = window;
    this.object = object;
    this.width = this.window.innerWidth;
    this.height = this.window.innerHeight;

    this.moveEvents = [];
    this.downEvents = [];
    this.upEvents = [];
    this.stagechangeEvents = [];

    this.params = {
      listVisible: true,
      projectVisible: false,
      listActive: false,
      listTransitioning: false,
      updatingStage: false,
      previousStage: null,
      currentStage: 1,
      camera: {
        rotation: {
          x: 0
        },
        defaultRotation: {
          x: 0
        },
        listRotation: {
          x: Math.PI * 0.5
        },
        projectRotation: {
          x: Math.PI * 0.5
        },
        position: {
          y: 4,
          x: 0
        },
        defaultPosition: {
          y: 4,
          x: 0
        },
        listPosition: {
          y: 55,
          x: 0
        },
        projectPosition: {
          y: 62,
          x: 0
        },
        look: {
          y: 2,
          x: 0,
          z: 0
        },
        defaultLook: {
          y: 2,
          x: 0,
          z: 0
        },
        listLook: {
          y: 58,
          x: 0,
          z: -5
        },
        projectLook: {
          y: 64,
          x: 0,
          z: -5
        },
        aboutLook: {
          y: 2,
          x: 0,
          z: -10
        },
        distance: 38,
        defaultDistance: 38,
        listDistance: 50,
        projectDistance: 50
      }
    };

    // mouse position updated live
    this.mouse = {
      x: 0,
      y: 0
    };

    // Used to compute the list y translate
    this.mouseStartPoint = {
      x: 0,
      y: 0
    };

    // Gap from screen middle point
    this.centerGap = {
      x: 0,
      y: 0
    };

    // Gap used in render method
    this.centerGapTarget = {
      x: 0,
      y: 0
    };

    // Gap factor used to compute the camera position
    this.gapInfluence = 0.4;

    // Gap factor used in render method
    this.gapInfluenceTarget = 0.4;

    this.loadListeners();
    this.initScene();
    this.initMaterials();
    this.initLights();
    this.initEnvironment();
    this.initStages();
    this.initList();
    this.initProject();
    // this.initGUI();
    this.render();
  }

  on(event, callback) {
    switch (event) {
      case 'down':
        this.downEvents.push({ callback });
        break;

      case 'up':
        this.upEvents.push({ callback });
        break;

      case 'move':
        this.moveEvents.push({ callback });
        break;

      case 'stagechange':
        this.stagechangeEvents.push({ callback });
        break;

      default:
        break;
    }
  }

  initScene() {
    this.scene = new THREE.Scene();

    this.scene.background = new THREE.Color(0x00ffff );

    this.renderer = new THREE.WebGLRenderer({
     // alpha: true,
     // antialias: false
      antialias: true
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(this.window.devicePixelRatio, 2));

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      35,
      this.width / this.height,
      1,
      1000
    );
    this.camera.position.set(65, 12, -40);
    this.camera.lookAt(new THREE.Vector3());

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer, {
      stencilBuffer: true,
      depthTexture: true
    });

    let geometry = new THREE.BoxGeometry(200, 200, 200);
    let material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

     this.passes = {};
     this.passes.list = [];
    // this.passes.updateRenderToScreen = () => {
    //   let enabledPassFound = false;
    //
    //   for (let i = this.passes.list.length - 1; i >= 0; i--) {
    //     const pass = this.passes.list[i];
    //
    //     if (pass.enabled && !enabledPassFound) {
    //       pass.renderToScreen = true;
    //       enabledPassFound = true;
    //     } else {
    //       pass.renderToScreen = false;
    //     }
    //   }
    // };
    //
    // this.passes.render = new RenderPass(this.scene, this.camera);
    // this.composer.addPass(this.passes.render);
    // this.passes.list.push(this.passes.render);
    //
     this.passes.fov = new ShaderPass(new THREE.ShaderMaterial(THREE.FOVShader));
    // this.passes.fov.enabled = true;
    // this.composer.addPass(this.passes.fov);
    // this.passes.list.push(this.passes.fov);
    //
    // this.passes.rgb = new ShaderPass(new THREE.ShaderMaterial(THREE.RGBShader));
    // this.passes.rgb.enabled = true;
    // this.composer.addPass(this.passes.rgb);
    // this.passes.list.push(this.passes.rgb);
    //
    // this.passes.updateRenderToScreen();
    //
     this.clock = new THREE.Clock();
  }

  initLights() {
    this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);

    this.scene.add(this.hemisphereLight);

    this.spotLight3 = new THREE.PointLight(0xffffff, 0.1);
    this.spotLight3.position.set(28, 14, 28);
    this.scene.add(this.spotLight3);

    this.spotLight4 = new THREE.PointLight(0xffffff, 0.07);
    this.spotLight4.position.set(0, 14, 28);
    this.scene.add(this.spotLight4);

    this.spotLight5 = new THREE.PointLight(0xffffff, 0.07);
    this.spotLight5.position.set(28, 14, 0);
    this.scene.add(this.spotLight5);

    this.spotLight6 = new THREE.PointLight(0xffffff, 0.07);
    this.spotLight6.position.set(-28, 14, 0);
    this.scene.add(this.spotLight6);

    this.spotLight7 = new THREE.PointLight(0xffffff, 0.07);
    this.spotLight7.position.set(0, 14, -28);
    this.scene.add(this.spotLight7);

    this.spotLight8 = new THREE.PointLight(0xffffff, 0.14);
    this.spotLight8.position.set(-28, 14, -28);
    this.scene.add(this.spotLight8);
  }

  initEnvironment() {
    this.env = new THREE.Group();

    this.object.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          dithering: true
        });
      }
    });

    this.object.scale.x = 3;
    this.object.scale.y = 3;
    this.object.scale.z = 3;
    this.object.position.y = -34;

    this.floor = this.object;
    this.floor.receiveShadow = true;
    this.floor.castShadow = true;
    this.env.add(this.floor);

    this.scene.add(this.env);
  }

  initMaterials() {
    this.primaryColor = new THREE.Color(0x424242);
    this.defaultColor = new THREE.Color(0xffffff);
    this.darkColor = new THREE.Color(0x1d1d1d);

    this.primaryMaterial = new THREE.MeshLambertMaterial({
      color: this.primaryColor,
      roughness: 0,
      reflectivity: 0.3,
      envMapIntensity: 0.8
    });

    this.defaultMaterial = new THREE.MeshLambertMaterial({
      color: this.defaultColor,
      emissive: 0xf8f8f8,
      emissiveIntensity: 0.05,
      roughness: 1,
      reflectivity: 0.7,
      envMapIntensity: 0.2
    });
  }

  switchColors(black = false) {
    if (black === true) {
      TweenMax.to(document.querySelector('body'), 1.2, {
        backgroundColor: '#171717',
        ease: ease
      });

      TweenMax.to(this.floor.children[0].material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });

      TweenMax.to(this.stages['1'].obj1.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['1'].obj2.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['1'].obj3.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });

      TweenMax.to(this.stages['2'].obj1.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['2'].obj2.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['2'].obj3.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });

      TweenMax.to(this.stages['3'].obj1.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['3'].obj2.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['3'].obj3.src.material.color, 1.2, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b,
        ease: ease
      });
    } else {
      TweenMax.to(document.querySelector('body'), 1.2, {
        backgroundColor: '#ffffff',
        ease: ease
      });

      const white = new THREE.Color(0xffffff);

      TweenMax.to(this.floor.children[0].material.color, 1.2, {
        r: white.r,
        g: white.g,
        b: white.b,
        ease: ease
      });

      TweenMax.to(this.stages['1'].obj1.src.material.color, 1.2, {
        r: this.primaryColor.r,
        g: this.primaryColor.g,
        b: this.primaryColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['1'].obj2.src.material.color, 1.2, {
        r: this.defaultColor.r,
        g: this.defaultColor.g,
        b: this.defaultColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['1'].obj3.src.material.color, 1.2, {
        r: this.defaultColor.r,
        g: this.defaultColor.g,
        b: this.defaultColor.b,
        ease: ease
      });

      TweenMax.to(this.stages['2'].obj1.src.material.color, 1.2, {
        r: this.primaryColor.r,
        g: this.primaryColor.g,
        b: this.primaryColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['2'].obj2.src.material.color, 1.2, {
        r: this.defaultColor.r,
        g: this.defaultColor.g,
        b: this.defaultColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['2'].obj3.src.material.color, 1.2, {
        r: this.defaultColor.r,
        g: this.defaultColor.g,
        b: this.defaultColor.b,
        ease: ease
      });

      TweenMax.to(this.stages['3'].obj1.src.material.color, 1.2, {
        r: this.primaryColor.r,
        g: this.primaryColor.g,
        b: this.primaryColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['3'].obj2.src.material.color, 1.2, {
        r: this.defaultColor.r,
        g: this.defaultColor.g,
        b: this.defaultColor.b,
        ease: ease
      });
      TweenMax.to(this.stages['3'].obj3.src.material.color, 1.2, {
        r: this.defaultColor.r,
        g: this.defaultColor.g,
        b: this.defaultColor.b,
        ease: ease
      });
    }
  }

  initStages() {
    this.stages = {};

    const stage1 = initStage1({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    this.scene.add(stage1.group);

    const stage2 = initStage2({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    this.scene.add(stage2.group);
    stage2.group.visible = false;

    const stage3 = initStage3({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    this.scene.add(stage3.group);
    stage3.group.visible = false;

    this.stages = {
      '1': stage1,
      '2': stage2,
      '3': stage3
    };
  }

  initProject() {
    this.projects = {};
    const projectsGroup = new THREE.Group();

    const stage1 = initStage1({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    projectsGroup.add(stage1.group);

    const stage2 = initStage2({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    projectsGroup.add(stage2.group);

    const stage3 = initStage3({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    projectsGroup.add(stage3.group);

    projectsGroup.position.set(0, 60, 0);

    this.scene.add(projectsGroup);

    this.projects = {
      '1': stage1,
      '2': stage2,
      '3': stage3,
      group: projectsGroup
    };
  }

  initList() {
    const list = new THREE.Group();

    const stage1 = initStage1({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    const stage2 = initStage2({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    const stage3 = initStage3({
      materials: {
        default: this.defaultMaterial,
        primary: this.primaryMaterial
      }
    });

    list.add(stage1.group);
    list.add(stage2.group);
    list.add(stage3.group);

    stage2.group.position.set(0, -11, 0);
    stage3.group.position.set(0, -22, 0);

    list.position.set(0, 64, 0);

    this.scene.add(list);

    this.list = {
      list: list,
      stages: {
        '1': stage1,
        '2': stage2,
        '3': stage3
      }
    };
  }

  initGUI() {
    this.data = {
      obj: {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0
      }
    };

    this.gui = new dat.GUI();
    const f1 = this.gui.addFolder('Object');
    f1.add(this.params.camera.rotation, 'x', -6, 6);
    f1.add(this.params.camera.position, 'y', 0, 90);
    f1.add(this.params.camera.look, 'y', 0, 90);
    f1.add(this.params.camera.look, 'x', -60, 90);
    f1.add(this.params.camera.look, 'z', -60, 90);
  }

  loadListeners() {
    this.resizeListener = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.passes.fov.getFullscreenMaterial().uniforms[
        'iResolution'
      ].value = new THREE.Vector2(this.width, this.height);
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    };

    this.window.addEventListener('resize', this.resizeListener);

    if (isMobile() === false) {
      this.onTouchDown = this.onTouchDown.bind(this);
      this.onTouchUp = this.onTouchUp.bind(this);
      this.onTouchMove = this.onTouchMove.bind(this);

      const $page = document.querySelector('.page.home');

      if ($page) {
        $page.addEventListener('mousedown', this.onTouchDown, {
          passive: true
        });
        $page.addEventListener('touchstart', this.onTouchDown, {
          passive: true
        });

        $page.addEventListener('mouseup', this.onTouchUp, { passive: true });
        $page.addEventListener('touchend', this.onTouchUp, { passive: true });
      }

      this.window.addEventListener('mousemove', this.onTouchMove, false);
    }
  }

  onAboutEnter() {
    this.params.previousStage = this.params.currentStage;
    this.params.currentStage = 1;
    this.switchColors(true);

    const timeline = new TimelineMax({
      onComplete: () => {
        this.params.listVisible = true;
        this.params.updatingStage = false;
        this.params.projectVisible = false;
      }
    });

    timeline
      .to(this.params.camera.look, 2.2, {
        x: this.params.camera.aboutLook.x,
        y: this.params.camera.aboutLook.y,
        z: this.params.camera.aboutLook.z,
        ease: Power4.easeInOut
      })
      .to(
        this.params.camera.position,
        2.2,
        {
          y: this.params.camera.defaultPosition.y,
          ease: Power4.easeInOut
        },
        '-=2.2'
      )
      .to(
        this.params.camera,
        2.2,
        {
          distance: this.params.camera.defaultDistance,
          ease: Power4.easeInOut
        },
        '-=2.2'
      )
      .to(
        this.params.camera.rotation,
        2.2,
        {
          x: Math.PI * 2,
          ease: Power4.easeInOut
        },
        '-=2.2'
      )
      .to(
        this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
        1.1,
        {
          value: -0.1,
          ease: Power4.easeIn
        },
        '-=2.2'
      )
      .to(
        this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
        1.1,
        {
          value: 0,
          ease: Power4.easeOut
        },
        '-=1.1'
      )
      .to(
        {},
        0,
        {
          onStart: () => {
            this.stages[this.params.previousStage].group.visible = false;
            this.stages[this.params.currentStage].group.visible = true;
          }
        },
        '-=1.2'
      )
      .to(
        this.passes.rgb.getFullscreenMaterial().uniforms['amount'],
        1,
        {
          value: 0.002,
          ease: Power4.easeOut
        },
        '-=1'
      );

    if (this.params.previousStage != 1) {
      timeline
        .to(
          this.stages[this.params.previousStage].obj1.src.rotation,
          1,
          {
            z:
              this.stages[this.params.previousStage].obj1.src.rotation.z -
              Math.PI * 0.5,
            x:
              this.stages[this.params.previousStage].obj1.src.rotation.x -
              Math.PI,
            ease: Power4.easeIn
          },
          '-=2'
        )
        .to(
          this.stages[this.params.previousStage].obj2.src.rotation,
          1,
          {
            y:
              this.stages[this.params.previousStage].obj2.src.rotation.y -
              Math.PI * 0.5,
            x:
              this.stages[this.params.previousStage].obj2.src.rotation.x -
              Math.PI,
            ease: Power4.easeIn
          },
          '-=2'
        )
        .to(
          this.stages[this.params.previousStage].obj3.src.rotation,
          1,
          {
            y:
              this.stages[this.params.previousStage].obj3.src.rotation.y -
              Math.PI * 0.5,
            z:
              this.stages[this.params.previousStage].obj3.src.rotation.z -
              Math.PI,
            ease: Power4.easeIn
          },
          '-=2'
        )
        .fromTo(
          this.stages[this.params.currentStage].obj1.src.rotation,
          1,
          {
            z:
              this.stages[this.params.currentStage].obj1.defaultRotation.z +
              Math.PI * 0.5,
            x:
              this.stages[this.params.currentStage].obj1.defaultRotation.x +
              Math.PI
          },
          {
            z: this.stages[this.params.currentStage].obj1.defaultRotation.z,
            x: this.stages[this.params.currentStage].obj1.defaultRotation.x,
            ease: Power4.easeOut
          },
          '-=1'
        )
        .fromTo(
          this.stages[this.params.currentStage].obj2.src.rotation,
          1,
          {
            y:
              this.stages[this.params.currentStage].obj2.defaultRotation.y +
              Math.PI * 0.5,
            x:
              this.stages[this.params.currentStage].obj2.defaultRotation.x +
              Math.PI
          },
          {
            y: this.stages[this.params.currentStage].obj2.defaultRotation.y,
            x: this.stages[this.params.currentStage].obj2.defaultRotation.x,
            ease: Power4.easeOut
          },
          '-=0.9'
        )
        .fromTo(
          this.stages[this.params.currentStage].obj3.src.rotation,
          1,
          {
            y:
              this.stages[this.params.currentStage].obj3.defaultRotation.y +
              Math.PI * 0.5,
            z:
              this.stages[this.params.currentStage].obj3.defaultRotation.z +
              Math.PI
          },
          {
            y: this.stages[this.params.currentStage].obj3.defaultRotation.y,
            z: this.stages[this.params.currentStage].obj3.defaultRotation.z,
            ease: Power4.easeOut
          },
          '-=0.9'
        );
    }
  }

  onProjectEnter() {
    this.params.projectVisible = true;
    this.params.listVisible = false;
    this.params.updatingStage = true;
    this.switchColors(false);

    this.projects['1'].group.visible = false;
    this.projects['2'].group.visible = false;
    this.projects['3'].group.visible = false;

    this.projects[this.params.currentStage].group.visible = true;

    const timeline = new TimelineMax();

    timeline
      .to(this.passes.rgb.getFullscreenMaterial().uniforms['amount'], 2, {
        value: 0,
        ease: Power4.easeOut
      })
      .to(
        this.params.camera.look,
        2,
        {
          y: this.params.camera.projectLook.y,
          z: this.params.camera.projectLook.z,
          ease: Power4.easeInOut
        },
        '-=2'
      )
      .to(
        this.params.camera.position,
        2,
        {
          y: this.params.camera.projectPosition.y,
          ease: Power4.easeInOut
        },
        '-=2'
      )
      .to(
        this.params.camera,
        2,
        {
          distance: this.params.camera.projectDistance,
          ease: Power4.easeInOut
        },
        '-=2'
      )
      .to(
        this.params.camera.rotation,
        2,
        {
          x: this.params.camera.projectRotation.x,
          ease: Power4.easeInOut
        },
        '-=2'
      )
      .to(
        this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
        2,
        {
          value: 0.06,
          ease: Power4.easeInOut
        },
        '-=2'
      );
  }

  onHomeEnter() {
    this.params.previousStage = this.params.currentStage;
    this.params.currentStage = 1;
    this.stages[this.params.previousStage].group.visible = false;
    this.stages[this.params.currentStage].group.visible = true;
    this.switchColors(false);

    const timeline = new TimelineMax({
      onComplete: () => {
        this.params.listVisible = true;
        this.params.updatingStage = false;
        this.params.projectVisible = false;
      }
    });

    timeline
      .to(this.passes.rgb.getFullscreenMaterial().uniforms['amount'], 2, {
        value: 0,
        ease: Power4.easeOut
      })
      .to(
        this.params.camera.look,
        2,
        {
          y: this.params.camera.defaultLook.y,
          z: this.params.camera.defaultLook.z,
          ease: Power4.easeInOut
        },
        '-=2'
      )
      .to(
        this.params.camera.position,
        2,
        {
          y: this.params.camera.defaultPosition.y,
          ease: Power4.easeInOut
        },
        '-=2'
      )
      .to(
        this.params.camera,
        2,
        {
          distance: this.params.camera.defaultDistance,
          ease: Power4.easeInOut
        },
        '-=2'
      )
      .to(
        this.params.camera.rotation,
        2,
        {
          x: this.params.camera.defaultRotation.x,
          ease: Power4.easeInOut
        },
        '-=2'
      )
      .to(
        this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
        1,
        {
          value: -0.1,
          ease: Power4.easeIn
        },
        '-=2'
      )
      .to(
        this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
        1,
        {
          value: 0,
          ease: Power4.easeOut
        },
        '-=1'
      );
  }

  onTouchDown(e) {
    const isAction = e.path.findIndex(el => {
      return el && el.classList && el.classList.contains('action-element');
    });

    if (this.params.updatingStage === false && isAction === -1) {
      this.downEvents.forEach(({ callback }) => {
        callback();
      });

      this.gapInfluence = 0;
      this.params.listActive = true;
      this.params.listTransitioning = true;

      const timeline = new TimelineMax({
        onComplete: () => {
          this.params.listTransitioning = false;
          this.mouseStartPoint = {
            x: 0,
            y: window.innerHeight / 2
          };
        }
      });

      timeline
        .to(this.params.camera.look, 2, {
          y: this.params.camera.listLook.y,
          z: this.params.camera.listLook.z,
          ease: Power4.easeInOut
        })
        .to(
          this.params.camera.position,
          2,
          {
            y: this.params.camera.listPosition.y,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .to(
          this.params.camera,
          2,
          {
            distance: this.params.camera.listDistance,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .to(
          this.params.camera.rotation,
          2,
          {
            x: this.params.camera.listRotation.x,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .to(
          this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
          2,
          {
            value: 0.06,
            ease: Power4.easeInOut
          },
          '-=2'
        );
    }
  }

  onTouchUp(e) {
    const isAction = e.path.findIndex(el => {
      return el && el.classList && el.classList.contains('action-element');
    });

    if (this.params.updatingStage === false && isAction === -1) {
      this.upEvents.forEach(({ callback }) => {
        callback();
      });

      this.params.listTransitioning = true;
      this.params.listActive = false;

      const timeline = new TimelineMax({
        onComplete: () => {
          this.params.listTransitioning = false;
          this.gapInfluence = 0.4;
        }
      });

      timeline
        .to(this.params.camera.look, 2, {
          y: this.params.camera.defaultLook.y,
          z: this.params.camera.defaultLook.z,
          ease: Power4.easeInOut
        })
        .to(
          this.params.camera.position,
          2,
          {
            y: this.params.camera.defaultPosition.y,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .to(
          this.params.camera,
          2,
          {
            distance: this.params.camera.defaultDistance,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .to(
          this.params.camera.rotation,
          2,
          {
            x: this.params.camera.defaultRotation.x,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .to(
          this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
          2,
          {
            value: 0,
            ease: Power4.easeInOut
          },
          '-=2'
        );
    }
  }

  onTouchMove(e) {
    this.mouse = {
      x: e.clientX,
      y: e.clientY
    };

    this.centerGap = {
      x: Math.floor((e.clientX / this.width - 0.5) * 10000) / 100,
      y: Math.floor((e.clientY / this.height - 0.5) * 10000) / 100
    };

    // List active and moving
    if (
      this.params.listTransitioning === false &&
      this.params.listActive === true
    ) {
      const difference = this.mouse.y - this.mouseStartPoint.y;
      const mappedDifference = -clamp(
        map(difference, -300, 300, -10, 10),
        -10,
        10
      );

      TweenMax.to(this.params.camera.position, 0.8, {
        y: this.params.camera.listPosition.y + mappedDifference
      });

      TweenMax.to(this.params.camera.look, 0.8, {
        y: this.params.camera.listLook.y + mappedDifference
      });

      TweenMax.to(this.list.stages['1'].obj3.src.position, 0.8, {
        y: this.list.stages['1'].obj3.defaultPosition.y + mappedDifference * 0.1
      });

      TweenMax.to(this.list.stages['1'].obj1.src.position, 0.8, {
        y:
          this.list.stages['1'].obj1.defaultPosition.y + mappedDifference * 0.15
      });

      TweenMax.to(this.list.stages['2'].obj3.src.position, 0.8, {
        y: this.list.stages['2'].obj3.defaultPosition.y + mappedDifference * 0.1
      });

      TweenMax.to(this.list.stages['2'].obj1.src.position, 0.8, {
        y:
          this.list.stages['2'].obj1.defaultPosition.y + mappedDifference * 0.15
      });

      TweenMax.to(this.list.stages['3'].obj3.src.position, 0.8, {
        y: this.list.stages['3'].obj3.defaultPosition.y + mappedDifference * 0.1
      });

      TweenMax.to(this.list.stages['3'].obj1.src.position, 0.8, {
        y:
          this.list.stages['3'].obj1.defaultPosition.y + mappedDifference * 0.15
      });

      if (
        this.params.updatingStage === false &&
        this.params.listTransitioning === false
      ) {
        this.moveEvents.forEach(({ callback }) => {
          callback(this.centerGap, difference);
        });
      }
    } else {
      if (
        this.params.updatingStage === false &&
        this.params.listTransitioning === false
      ) {
        this.moveEvents.forEach(({ callback }) => {
          callback(this.centerGap);
        });
      }
    }
  }

  enterAnimation(currentRoute) {
    this.params.listTransitioning = true;
    this.gapInfluence = 0.0;

    if (currentRoute === 'home') {
      const timeline = new TimelineMax({
        onComplete: () => {
          this.params.listTransitioning = false;
          this.gapInfluence = 0.4;
        }
      });

      TweenMax.set(document.querySelector('body'), {
        backgroundColor: '#ffffff'
      });

      timeline
        .fromTo(
          this.params.camera.look,
          2,
          {
            y: 25,
            z: this.params.camera.listLook.z
          },
          {
            y: this.params.camera.defaultLook.y,
            z: this.params.camera.defaultLook.z,
            delay: 0.4,
            ease: Power4.easeInOut
          }
        )
        .fromTo(
          this.params.camera.position,
          2,
          {
            y: 25
          },
          {
            y: this.params.camera.defaultPosition.y,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .fromTo(
          this.params.camera,
          2,
          {
            distance: 60
          },
          {
            distance: this.params.camera.defaultDistance,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .fromTo(
          this.params.camera.rotation,
          2,
          {
            x: -Math.PI * 0.5
          },
          {
            x: this.params.camera.defaultRotation.x,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .fromTo(
          this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
          2,
          {
            value: 0.05
          },
          {
            value: 0,
            ease: Power4.easeInOut
          },
          '-=2'
        );
    } else if (
      currentRoute === 'project1' ||
      currentRoute === 'project2' ||
      currentRoute === 'project3'
    ) {
      TweenMax.set(document.querySelector('body'), {
        backgroundColor: '#ffffff'
      });

      if (currentRoute === 'project1') {
        this.params.currentStage = 1;
      } else if (currentRoute === 'project2') {
        this.params.currentStage = 2;
      } else if (currentRoute === 'project3') {
        this.params.currentStage = 3;
      }

      this.params.projectVisible = true;
      this.params.listVisible = false;
      this.params.updatingStage = true;

      this.projects['1'].group.visible = false;
      this.projects['2'].group.visible = false;
      this.projects['3'].group.visible = false;

      this.projects[this.params.currentStage].group.visible = true;

      const timeline = new TimelineMax({
        onComplete: () => {
          this.params.listTransitioning = false;
          this.gapInfluence = 0.4;
        }
      });

      timeline
        .fromTo(
          this.params.camera.look,
          2,
          {
            y: 80,
            z: this.params.camera.listLook.z
          },
          {
            y: this.params.camera.projectLook.y,
            z: this.params.camera.projectLook.z,
            delay: 0.6,
            ease: Power4.easeInOut
          }
        )
        .fromTo(
          this.params.camera.position,
          2,
          {
            y: 80
          },
          {
            y: this.params.camera.projectPosition.y,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .fromTo(
          this.params.camera,
          2,
          {
            distance: 60
          },
          {
            distance: this.params.camera.projectDistance,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .fromTo(
          this.params.camera.rotation,
          2,
          {
            x: -Math.PI * 0.5
          },
          {
            x: this.params.camera.projectRotation.x,
            ease: Power4.easeInOut
          },
          '-=2'
        )
        .fromTo(
          this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
          2,
          {
            value: 0
          },
          {
            value: 0.06,
            ease: Power4.easeInOut
          },
          '-=2'
        );
    } else if (currentRoute === 'about') {
      this.params.listTransitioning = false;
      this.gapInfluence = 0.4;
      this.switchColors(true);

      TweenMax.set(document.querySelector('body'), {
        backgroundColor: '#171717'
      });

      TweenMax.set(this.floor.children[0].material.color, {
        r: this.darkColor.r,
        g: this.darkColor.g,
        b: this.darkColor.b
      });

      TweenMax.set(this.params.camera.rotation, {
        x: Math.PI * 2
      });

      TweenMax.set(this.passes.rgb.getFullscreenMaterial().uniforms['amount'], {
        value: 0.002
      });

      TweenMax.set(this.params.camera.look, {
        x: this.params.camera.aboutLook.x,
        y: this.params.camera.aboutLook.y,
        z: this.params.camera.aboutLook.z
      });
    }
  }

  updateListeners() {
    const $page = document.querySelector('.page.home');

    if ($page) {
      $page.addEventListener('mousedown', this.onTouchDown, { passive: true });
      $page.addEventListener('touchstart', this.onTouchDown, { passive: true });

      $page.addEventListener('mouseup', this.onTouchUp, { passive: true });
      $page.addEventListener('touchend', this.onTouchUp, { passive: true });
    }
  }

  unloadListeners() {
    this.window.removeEventListener('resize', this.resizeListener);
  }

  forceUpdateCurrentStage(stage) {
    this.params.previousStage = this.params.currentStage;
    this.params.currentStage = stage;
    this.stages[this.params.previousStage].group.visible = false;
    this.stages[this.params.currentStage].group.visible = true;

    this.stagechangeEvents.forEach(({ callback }) => {
      callback(stage);
    });
  }

  updateCurrentStage({ stage, direction = 1 }) {
    if (
      this.params.updatingStage === false &&
      this.params.listTransitioning === false
    ) {
      this.params.updatingStage = true;
      this.gapInfluence = 0;

      this.params.previousStage = this.params.currentStage;
      this.params.currentStage = stage;

      this.stagechangeEvents.forEach(({ callback }) => {
        callback(stage);
      });

      const timeline = new TimelineMax({
        onComplete: () => {
          this.params.updatingStage = false;
          this.gapInfluence = 0.4;

          this.params.camera.rotation.x = 0;
        }
      });

      timeline
        .to(this.params.camera.rotation, 2.2, {
          x: this.params.camera.rotation.x + Math.PI * 2 * direction,
          ease: Power4.easeInOut
        })
        .to(
          this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
          1.1,
          {
            value: -0.4,
            ease: Power4.easeIn
          },
          '-=2.2'
        )
        .to(
          this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'],
          1.1,
          {
            value: 0,
            ease: Power4.easeOut
          },
          '-=1.1'
        )
        .to(
          {},
          0,
          {
            onStart: () => {
              this.stages[this.params.previousStage].group.visible = false;
              this.stages[this.params.currentStage].group.visible = true;
            }
          },
          '-=1.2'
        )
        .to(
          this.stages[this.params.previousStage].obj1.src.rotation,
          1,
          {
            z:
              this.stages[this.params.previousStage].obj1.src.rotation.z -
              Math.PI * 0.5,
            x:
              this.stages[this.params.previousStage].obj1.src.rotation.x -
              Math.PI,
            ease: Power4.easeIn
          },
          '-=2'
        )
        .to(
          this.stages[this.params.previousStage].obj2.src.rotation,
          1,
          {
            y:
              this.stages[this.params.previousStage].obj2.src.rotation.y -
              Math.PI * 0.5,
            x:
              this.stages[this.params.previousStage].obj2.src.rotation.x -
              Math.PI,
            ease: Power4.easeIn
          },
          '-=2'
        )
        .to(
          this.stages[this.params.previousStage].obj3.src.rotation,
          1,
          {
            y:
              this.stages[this.params.previousStage].obj3.src.rotation.y -
              Math.PI * 0.5,
            z:
              this.stages[this.params.previousStage].obj3.src.rotation.z -
              Math.PI,
            ease: Power4.easeIn
          },
          '-=2'
        )
        .fromTo(
          this.stages[this.params.currentStage].obj1.src.rotation,
          1,
          {
            z:
              this.stages[this.params.currentStage].obj1.defaultRotation.z +
              Math.PI * 0.5,
            x:
              this.stages[this.params.currentStage].obj1.defaultRotation.x +
              Math.PI
          },
          {
            z: this.stages[this.params.currentStage].obj1.defaultRotation.z,
            x: this.stages[this.params.currentStage].obj1.defaultRotation.x,
            ease: Power4.easeOut
          },
          '-=1'
        )
        .fromTo(
          this.stages[this.params.currentStage].obj2.src.rotation,
          1,
          {
            y:
              this.stages[this.params.currentStage].obj2.defaultRotation.y +
              Math.PI * 0.5,
            x:
              this.stages[this.params.currentStage].obj2.defaultRotation.x +
              Math.PI
          },
          {
            y: this.stages[this.params.currentStage].obj2.defaultRotation.y,
            x: this.stages[this.params.currentStage].obj2.defaultRotation.x,
            ease: Power4.easeOut
          },
          '-=0.9'
        )
        .fromTo(
          this.stages[this.params.currentStage].obj3.src.rotation,
          1,
          {
            y:
              this.stages[this.params.currentStage].obj3.defaultRotation.y +
              Math.PI * 0.5,
            z:
              this.stages[this.params.currentStage].obj3.defaultRotation.z +
              Math.PI
          },
          {
            y: this.stages[this.params.currentStage].obj3.defaultRotation.y,
            z: this.stages[this.params.currentStage].obj3.defaultRotation.z,
            ease: Power4.easeOut
          },
          '-=0.9'
        );
    }
  }

  updateFOV(value) {
    this.passes.fov.getFullscreenMaterial().uniforms['iStrengh'].value = value;
  }

  render() {
    this.list.list.visible = this.params.listVisible;
    this.projects.group.visible = this.params.projectVisible;

    const newCenterGapTargetX =
      Math.floor(
        (this.centerGapTarget.x +
          (this.centerGap.x - this.centerGapTarget.x) * 0.04) *
          100
      ) / 100;
    const newCenterGapTarget =
      Math.floor(
        (this.centerGapTarget.y +
          (this.centerGap.y - this.centerGapTarget.y) * 0.04) *
          100
      ) / 100;
    const newGapInfluenceTarget =
      Math.floor(
        (this.gapInfluenceTarget +
          (this.gapInfluence - this.gapInfluenceTarget) * 0.05) *
          100
      ) / 100;

    this.centerGapTarget.x = newCenterGapTargetX;
    this.centerGapTarget.y = newCenterGapTarget;
    this.gapInfluenceTarget = newGapInfluenceTarget;

    this.camera.position.x =
      this.params.camera.distance * Math.cos(this.params.camera.rotation.x) + 0;

    this.camera.position.z =
      this.params.camera.distance * Math.sin(this.params.camera.rotation.x) +
      this.centerGapTarget.x * this.gapInfluenceTarget * 0.2;

    this.camera.position.y =
      this.params.camera.position.y +
      this.centerGapTarget.y * this.gapInfluenceTarget * 0.1;

    this.camera.lookAt(
      new THREE.Vector3(
        this.params.camera.look.x,
        this.params.camera.look.y -
          this.centerGapTarget.y * this.gapInfluenceTarget * 0.02,
        this.params.camera.look.z
      )
    );

    this.stages[this.params.currentStage].obj1.src.position.y =
      this.stages[this.params.currentStage].obj1.defaultPosition.y +
      Math.cos(this.clock.getElapsedTime()) * 0.5;

    this.stages[this.params.currentStage].obj2.src.position.y =
      this.stages[this.params.currentStage].obj2.defaultPosition.y +
      Math.cos(this.clock.getElapsedTime() + 2) * 0.3;

    this.stages[this.params.currentStage].obj3.src.position.y =
      this.stages[this.params.currentStage].obj3.defaultPosition.y +
      Math.cos(this.clock.getElapsedTime() + 3) * 0.4;

    this.projects[this.params.currentStage].obj1.src.position.y =
      this.stages[this.params.currentStage].obj1.defaultPosition.y +
      Math.cos(this.clock.getElapsedTime()) * 0.5;

    this.projects[this.params.currentStage].obj2.src.position.y =
      this.stages[this.params.currentStage].obj2.defaultPosition.y +
      Math.cos(this.clock.getElapsedTime() + 2) * 0.3;

    this.projects[this.params.currentStage].obj3.src.position.y =
      this.stages[this.params.currentStage].obj3.defaultPosition.y +
      Math.cos(this.clock.getElapsedTime() + 3) * 0.4;

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
   // this.composer.render(this.clock.getDelta());
  }
}

export default Scene;
