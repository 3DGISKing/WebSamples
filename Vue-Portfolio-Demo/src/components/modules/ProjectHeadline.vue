<template>
  <intersect @enter="onEnter" @leave="onLeave">
    <section class="project-section project-headline">
      <div class="container container--small">
        <h2 class="project-headline__title" ref="title">{{ data.title }}</h2>
      </div>
    </section>
  </intersect>
</template>

<script>
import { TimelineMax } from "gsap";
import throttle from "lodash.throttle";
import Intersect from "@/services/IntersectionObserver";
import { ease } from "@/services/Easings";

export default {
  name: "ProjectExplanation",
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

        const timeline = new TimelineMax();

        timeline.fromTo(
          this.$refs.title,
          2,
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            delay: 0.2,
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
<!--.project-headline {-->
<!--  padding: 120px 0px;-->

<!--  @include responsive($sm) {-->
<!--    padding: 80px 0px;-->
<!--  }-->

<!--  .container {-->
<!--    display: flex;-->
<!--    flex-direction: row;-->
<!--    align-items: flex-start;-->
<!--    justify-content: space-between;-->
<!--    text-align: center;-->

<!--    @include responsive($sm) {-->
<!--      text-align: left;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.project-headline__title {-->
<!--  @include headingFont();-->
<!--  text-transform: uppercase;-->
<!--  color: $black;-->
<!--  font-size: 48px;-->
<!--  line-height: 1.1;-->

<!--  @include responsive($sm) {-->
<!--    font-size: 36px;-->
<!--  }-->
<!--}-->
<!--</style>-->


