import * as THREE from 'three';

const initStage1 = ({ materials }) => {
  const geometry1 = new THREE.TetrahedronBufferGeometry(3);
  const mesh1 = new THREE.Mesh(geometry1, materials.primary);
  mesh1.position.set(3, 2, -1);
  mesh1.rotation.x = 2;
  mesh1.rotation.y = Math.PI * 0.3;
  mesh1.rotation.z = 3;
  mesh1.receiveShadow = true;
  mesh1.castShadow = true;

  const geometry2 = new THREE.TetrahedronBufferGeometry(6);
  const mesh2 = new THREE.Mesh(geometry2, materials.default);
  mesh2.position.set(-4, 4, -4);
  mesh2.rotation.x = -Math.PI * 0.1;
  mesh2.rotation.y = -Math.PI * 0.3;
  mesh2.receiveShadow = true;
  mesh2.castShadow = true;

  const geometry3 = new THREE.TetrahedronBufferGeometry(4);
  const mesh3 = new THREE.Mesh(geometry3, materials.default);
  mesh3.position.set(-2, 3, 3);
  mesh3.rotation.x = Math.PI * 0.1;
  mesh3.rotation.y = -Math.PI * 0.4;
  mesh3.receiveShadow = true;
  mesh3.castShadow = true;

  const group = new THREE.Group();
  group.add(mesh1);
  group.add(mesh2);
  group.add(mesh3);

  return {
    group: group,
    obj1: {
      src: mesh1,
      defaultPosition: {
        x: 3,
        y: 2,
        z: -1
      },
      defaultRotation: {
        x: 2,
        y: Math.PI * 0.3,
        z: 3
      }
    },
    obj2: {
      src: mesh2,
      defaultPosition: {
        x: -4,
        y: 4,
        z: -4
      },
      defaultRotation: {
        x: -Math.PI * 0.1,
        y: -Math.PI * 0.3,
        z: 0
      }
    },
    obj3: {
      src: mesh3,
      defaultPosition: {
        x: -2,
        y: 3,
        z: 3
      },
      defaultRotation: {
        x: Math.PI * 0.1,
        y: -Math.PI * 0.4,
        z: 0
      }
    }
  };
};

export default initStage1;
