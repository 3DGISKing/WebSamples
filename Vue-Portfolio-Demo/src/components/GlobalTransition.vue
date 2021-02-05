<template>
  <div class="global-transition" ref="transition">
    <div class="global-transition__background">
      <div
        class="global-transition__background-row"
        ref="rows"
        v-for="(e, index) in verticalArray"
        :key="index"
      >
        <div
          class="global-transition__background-cell-container"
          v-for="(e, index2) in horizontalArray"
          :key="index2"
        >
          <div class="global-transition__background-cell"></div>
        </div>
      </div>
    </div>

    <div class="global-transition__content">
      <div class="global-transition__title-container">
        <p class="global-transition__title" ref="title">{{ loader.title }}</p>
      </div>
      <div class="global-transition__description-container">
        <p class="global-transition__description" ref="description">{{ loader.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { TimelineMax, Power2 } from "gsap";
import { isMobile } from "@/services/utils";
import { ease2, ease } from "@/services/Easings";
import { SWITCH_WEBSITE_READY } from "@/store/types";
import { setTimeout } from "timers";

export default {
  name: "GlobalTransition",
  data() {
    return {
      horizontalCount: 0,
      vertiCalCount: 0,
      horizontalArray: [],
      verticalArray: [],
      timeoutEnded: false
    };
  },
  computed: {
    assetsLoaded() {
      return this.$store.state.assetsLoaded;
    },
    loader() {
      return this.$store.state.content.loader;
    }
  },
  watch: {
    assetsLoaded(value) {
      if (value === true) {
        if (this.timeoutEnded === true) {
          this.enterAnimation();
        }
      }
    }
  },
  methods: {
    enterAnimation() {
      this.$store.commit(SWITCH_WEBSITE_READY, true);

      const timeline = new TimelineMax();
      timeline.pause();

      timeline
        .fromTo(
          this.$refs.title,
          1.2,
          {
            y: "0%"
          },
          {
            y: "-100%",
            ease: ease
          }
        )
        .fromTo(
          this.$refs.description,
          1.2,
          {
            y: "0%"
          },
          {
            y: "-100%",
            ease: ease
          },
          "-=1.18"
        );

      this.$refs.rows.forEach((row, index) => {
        if (index === 0) {
          timeline.staggerTo(
            row.querySelectorAll(".global-transition__background-cell"),
            1.2,
            {
              x: "-102%",
              ease: ease
            },
            -0.05,
            "-=0.7"
          );
        } else {
          timeline.staggerTo(
            row.querySelectorAll(".global-transition__background-cell"),
            1.2,
            {
              x: "-102%",
              ease: ease
            },
            -0.05,
            `-=${1.16 + 0.05 * (this.horizontalCount - 1)}`
          );
        }
      });

      timeline.resume();
    }
  },
  created() {
    if (isMobile() === true) {
      this.horizontalCount = 4;
      this.vertiCalCount = 7;
    } else {
      this.horizontalCount = 9;
      this.vertiCalCount = 6;
    }

    this.horizontalArray = new Array(this.horizontalCount);
    this.verticalArray = new Array(this.vertiCalCount);
  },
  mounted() {
    setTimeout(() => {
      this.timeoutEnded = true;

      if (this.assetsLoaded === true) {
        this.enterAnimation();
      }
    }, 3000);
  }
};
</script>

<!--<style lang="scss" scoped>-->
<!--.global-transition {-->
<!--  position: fixed;-->
<!--  top: 0;-->
<!--  right: 0;-->
<!--  bottom: 0;-->
<!--  left: 0;-->
<!--  width: 100vw;-->
<!--  height: 100vh;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: space-around;-->
<!--  align-items: center;-->
<!--  z-index: 100;-->
<!--  pointer-events: none;-->
<!--  user-select: none;-->
<!--}-->

<!--.global-transition__background {-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  right: 0;-->
<!--  bottom: 0;-->
<!--  left: 0;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--}-->

<!--.global-transition__background-row {-->
<!--  flex: 1;-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--}-->

<!--.global-transition__background-cell-container {-->
<!--  flex: 1;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.global-transition__background-cell {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  background-color: $black;-->
<!--}-->

<!--.global-transition__content {-->
<!--  position: relative;-->
<!--  z-index: 2;-->
<!--}-->

<!--.global-transition__title-container,-->
<!--.global-transition__description-container {-->
<!--  overflow: hidden;-->
<!--}-->

<!--.global-transition__title-container {-->
<!--  margin-bottom: 4px;-->
<!--}-->

<!--.global-transition__title {-->
<!--  @include headingFont();-->
<!--  color: $white;-->
<!--  font-size: 30px;-->
<!--  text-transform: uppercase;-->
<!--}-->

<!--.global-transition__description {-->
<!--  @include mainFont();-->
<!--  color: $white;-->
<!--  font-size: 15px;-->
<!--  opacity: 0.75;-->
<!--}-->
<!--</style>-->


