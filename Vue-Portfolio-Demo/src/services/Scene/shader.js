import * as THREE from 'three';

THREE.FOVShader = {
  uniforms: {
    tDiffuse: { value: null },
    iStrengh: { value: 0 },
    iResolution: {
      type: 'v2',
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }
  },

  vertexShader: [
    'varying vec2 vUv; ',
    'void main() {',
    'vUv = uv;',

    'vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );',
    'gl_Position = projectionMatrix * mvPosition;',
    '}'
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D tDiffuse;',
    'uniform float iStrengh;',
    'uniform vec2 iResolution;',
    'varying vec2 vUv;',
    'void main() {',
    'vec2 uv = -1.0 + 2.0 * vUv;',
    'float aspectRatio = iResolution.x / iResolution.y;',
    'float strength = iStrengh;',

    'vec2 intensity = vec2(strength * aspectRatio, strength * aspectRatio);',

    'vec2 coords = vUv;',
    'coords = (coords - 0.5) * 2.0;',

    'vec2 realCoordOffs;',
    'realCoordOffs.x = (1.0 - coords.y * coords.y) * intensity.y * (coords.x);',
    'realCoordOffs.y = (1.0 - coords.x * coords.x) * intensity.x * (coords.y);',

    'vec4 color = texture2D(tDiffuse, vUv - realCoordOffs);',

    'gl_FragColor = vec4(color);',
    '}'
  ].join('\n')
};
