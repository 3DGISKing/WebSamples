<template>
  <div ref="canvas" class="global-canvas"></div>
</template>

<script>
import Scene from "@/services/Scene";
import { TweenMax } from "gsap";
import { ease } from "@/services/Easings";
import {
  SWITCH_CURSOR_STATE,
  SWITCH_CURRENT_STAGE,
  SWITCH_CENTER_GAP,
  SWITCH_CENTER_GAP_DOWN
} from "@/store/types";
import { clamp, map, isMobile } from "@/services/utils";

export default {
  name: "GlobalCanvas",
  data() {
    return {
      scene: null
    };
  },
  computed: {
    object() {
      return this.$store.state.object;
    },
    previousStageClick() {
      return this.$store.state.previousStageClick;
    },
    nextStageClick() {
      return this.$store.state.nextStageClick;
    },
    currentStage() {
      return this.$store.state.currentStage;
    },
    sceneCursor() {
      return this.$store.state.sceneCursor;
    },
    cursorState() {
      return this.$store.state.cursorState;
    },
    centerGapDown() {
      return this.$store.state.centerGapDown;
    },
    projectActive() {
      return this.$store.state.projectActive;
    },
    aboutActive() {
      return this.$store.state.aboutActive;
    },
    currentScroll() {
      return this.$store.state.currentScroll;
    },
    websiteReady() {
      return this.$store.state.websiteReady;
    },
    listActive() {
      return this.$store.state.listActive;
    }
  },
  watch: {
    currentScroll(value) {
      if (this.projectActive === true) {
        const mappedValue = clamp(
          map(value, 0, window.innerWidth * 0.3, 0, 0.12),
          0,
          0.12
        );
        this.scene.updateFOV(0.06 + mappedValue);
      }
    },
    projectActive(value) {
      if (value === true && this.scene !== null) {
        this.scene.onProjectEnter();
      }
    },
    aboutActive(value) {
      if (value === true) {
        this.scene.onAboutEnter();
      }
    },
    cursorState(value, oldValue) {
      if (value === "normal" && oldValue === "pressed") {
        if (this.centerGapDown <= -150) {
          this.scene.forceUpdateCurrentStage(1);
        } else if (this.centerGapDown <= 150) {
          this.scene.forceUpdateCurrentStage(2);
        } else {
          this.scene.forceUpdateCurrentStage(3);
        }
      }
    },
    object(object) {
      this.initScene();
    },
    previousStageClick() {
      if (this.currentStage === 1) {
        if (this.listActive === false) {
          this.scene.updateCurrentStage({
            stage: 3,
            direction: 1
          });
        }
      } else {
        if (this.listActive === false) {
          this.scene.updateCurrentStage({
            stage: this.currentStage - 1,
            direction: 1
          });
        }
      }
    },
    nextStageClick() {
      if (this.currentStage === 3) {
        if (this.listActive === false) {
          this.scene.updateCurrentStage({
            stage: 1,
            direction: -1
          });
        }
      } else {
        if (this.listActive === false) {
          this.scene.updateCurrentStage({
            stage: this.currentStage + 1,
            direction: -1
          });
        }
      }
    },
    $route() {
      this.scene.updateListeners();

      if (this.$route.name === "home") {
        this.scene.onHomeEnter();
      }
    },
    websiteReady(value) {
      if (value === true) {
        this.scene.enterAnimation(this.$route.name);
      }
    }
  },
  methods: {
    initScene() {
      this.scene = new Scene({
        container: this.$refs.canvas,
        window: window,
        object: this.object
      });

      if (this.websiteReady === true) {
        this.scene.enterAnimation(this.$route.name);
      }

      if (isMobile() === false) {
        this.scene.on("down", () => {
          if (this.websiteReady === true) {
            this.$store.commit(SWITCH_CURSOR_STATE, "pressed");
          }
        });

        this.scene.on("up", () => {
          if (this.websiteReady === true) {
            this.$store.commit(SWITCH_CURSOR_STATE, "normal");
          }
        });

        this.scene.on("move", (e, difference) => {
          this.$store.commit(SWITCH_CENTER_GAP, e);

          if (difference) {
            this.$store.commit(SWITCH_CENTER_GAP_DOWN, difference);
          }
        });
      }

      this.scene.on("stagechange", stage => {
        this.$store.commit(SWITCH_CURRENT_STAGE, stage);
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.global-canvas {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
}
</style>


