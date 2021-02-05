import loadAssets from 'load-asset';
import * as THREE from 'three';
import { SWITCH_OBJECT } from '@/store/types';
require('three-obj-loader')(THREE);

class ProgressLoader {
  constructor(elements, modelUrl, commit) {
    this.elements = elements;
    this.modelUrl = modelUrl;
    this.commit = commit;
    this.object = null;
    this.progressEvents = [];
    this.completeEvents = [];
    this.elementsProgress = 0;
    this.modelProgress = 0;
    this.totalProgress = 0;
    this.loaded = false;

    this.init();
  }

  init() {
    loadAssets.any(this.elements, e => {
      if (e.progress === 1) {
        this.elementsProgress = 100;
        this.updateProgress();
      } else {
        this.elementsProgress = Math.floor(e.progress * 100);
        this.updateProgress();
      }
    });

    const objLoader = new THREE.OBJLoader();

    objLoader.load(
      this.modelUrl,
      object => {
        this.commit(SWITCH_OBJECT, object);
        this.modelProgress = 100;
        this.updateProgress();
      },
      xhr => {
        this.modelProgress = Math.floor((xhr.loaded / xhr.total) * 100);
        this.updateProgress();
      },
      () => {
        console.log('An error happened');
      }
    );
  }

  updateProgress() {
    this.totalProgress = Math.floor(
      (this.modelProgress + this.elementsProgress) / 2
    );

    if (this.totalProgress === 100 && this.loaded === false) {
      this.loaded = true;
      this.completeEventsCall();
    } else {
      this.progressEventsCall();
    }
  }

  progressEventsCall() {
    this.progressEvents.forEach(({ callback }) => {
      callback(this.totalProgress);
    });
  }

  completeEventsCall() {
    this.completeEvents.forEach(({ callback }) => {
      callback();
    });
  }

  on(event, callback) {
    switch (event) {
      case 'progress':
        this.progressEvents.push({ callback });
        break;

      case 'complete':
        this.completeEvents.push({ callback });
        break;

      default:
        break;
    }
  }
}

export default ProgressLoader;
