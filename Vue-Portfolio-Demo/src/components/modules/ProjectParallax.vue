<template>
  <intersect @enter="onEnter" @leave="onLeave">
    <section class="project-section project-parallax" ref="section">
      <div class="project-parallax__container">
        <img class="project-parallax__source" :src="data.source" :alt="data.title" ref="picture">
      </div>
    </section>
  </intersect>
</template>

<script>
import Intersect from "@/services/IntersectionObserver";
import { map, clamp } from "@/services/utils";
import throttle from "lodash.throttle";
import { TweenMax, Power2 } from "gsap";

export default {
  name: "ProjectParallax",
  props: ["smooth", "data"],
  components: {
    Intersect
  },
  data() {
    return {
      visible: false,
      top: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this.smooth.onScroll(e => {
        if (this.visible === true) {
          const data = this.$refs.section.getBoundingClientRect();
          const top = -data.top;
          const value = top / data.height;
          const mappedValue = map(value, 0, 1, 0, 100);

          TweenMax.set(this.$refs.picture, {
            scale: 1.2,
            y: mappedValue
          });
        }
      });
    }, 100);
  },
  methods: {
    onEnter() {
      if (this.visible === false) {
        this.visible = true;
      }
    },
    onLeave() {
      this.visible = false;
    }
  }
};
</script>

<!--<style lang="scss" scoped>-->
<!--.project-parallax {-->
<!--  width: 100%;-->
<!--  margin: 120px 0px;-->

<!--  @include responsive($sm) {-->
<!--    margin: 80px 0px;-->
<!--  }-->
<!--}-->

<!--.project-parallax__container {-->
<!--  width: 100%;-->
<!--  height: 90vh;-->
<!--  max-height: 90vh;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.project-parallax__source {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  object-fit: cover;-->
<!--  transform: scale(1.2);-->
<!--}-->
<!--</style>-->


