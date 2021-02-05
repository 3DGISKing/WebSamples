<template>
  <intersect @enter="onEnter" @leave="onLeave">
    <section class="project-section project-video">
      <div class="container">
        <div class="project-video__container">
          <video
            ref="video"
            class="project-video__source"
            :src="data.source"
            muted
            playsinline
            loop
          ></video>
        </div>
      </div>
    </section>
  </intersect>
</template>

<script>
import { TweenMax } from "gsap";
import Intersect from "@/services/IntersectionObserver";
import { ease } from "@/services/Easings";

export default {
  name: "ProjectPicture",
  props: ["data"],
  components: {
    Intersect
  },
  methods: {
    onEnter() {
      this.$refs.video.play();
    },
    onLeave() {
      this.$refs.video.pause();
    }
  }
};
</script>

<!--<style lang="scss" scoped>-->
<!--.project-video {-->
<!--  padding: 120px 0px;-->

<!--  @include responsive($sm) {-->
<!--    padding: 80px 0px;-->
<!--  }-->
<!--}-->

<!--.project-video__container {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.project-video__source {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  will-change: transform;-->
<!--}-->
<!--</style>-->


