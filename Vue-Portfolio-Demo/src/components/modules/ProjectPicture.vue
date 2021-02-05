<template>
  <intersect @enter="onEnter" @leave="onLeave">
    <section class="project-section project-picture">
      <div class="container">
        <div class="project-picture__container">
          <img ref="picture" class="project-picture__source" :src="data.source" :alt="data.title">
        </div>
      </div>
    </section>
  </intersect>
</template>

<script>
import { TweenMax } from "gsap";
import throttle from "lodash.throttle";
import Intersect from "@/services/IntersectionObserver";
import { ease } from "@/services/Easings";

export default {
  name: "ProjectPicture",
  props: ["smooth", "data"],
  components: {
    Intersect
  },
  data() {
    return {
      previousScrollValue: 0,
      currentScrollValue: 0,
      visible: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.smooth.onScroll(
        throttle(e => {
          this.previousScrollValue = this.currentScrollValue;
          this.currentScrollValue = e;
        }),
        500
      );
    }, 100);
  },
  methods: {
    onEnter() {
      if (
        this.currentScrollValue > this.previousScrollValue &&
        this.visible === false
      ) {
        this.visible = true;

        TweenMax.fromTo(
          this.$refs.picture,
          3,
          {
            scale: 1.25
          },
          {
            scale: 1,
            ease: ease
          }
        );
      }
    },
    onLeave() {
      this.visible = false;
    }
  }
};
</script>

<!--<style lang="scss" scoped>-->
<!--.project-picture {-->
<!--  padding: 120px 0px;-->

<!--  @include responsive($sm) {-->
<!--    padding: 80px 0px;-->
<!--  }-->
<!--}-->

<!--.project-picture__container {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.project-picture__source {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  will-change: transform;-->
<!--}-->
<!--</style>-->


