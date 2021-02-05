<template>
  <intersect @enter="onEnter" @leave="onLeave">
    <section class="project-section project-details">
      <div class="container">
        <div class="project-details__content">
          <h2 class="project-details__title" ref="title">{{ data.title }}</h2>

          <p class="project-details__description" ref="description">{{ data.description }}</p>
        </div>
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

        timeline
          .fromTo(
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
          )
          .fromTo(
            this.$refs.description,
            2,
            {
              y: 40,
              opacity: 0
            },
            {
              y: 0,
              opacity: 1,
              ease: ease
            },
            "-=1.8"
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
<!--.project-details {-->
<!--  padding: 120px 0px;-->
<!--  padding-bottom: 0px;-->

<!--  @include responsive($sm) {-->
<!--    padding: 80px 0px;-->
<!--  }-->

<!--  .container {-->
<!--    display: flex;-->
<!--    flex-direction: row;-->
<!--    align-items: flex-start;-->
<!--    justify-content: space-between;-->
<!--  }-->
<!--}-->

<!--.project-details__content {-->
<!--  width: 65%;-->

<!--  @include responsive($md) {-->
<!--    width: 100%;-->
<!--  }-->
<!--}-->

<!--.project-details__title {-->
<!--  @include headingFont();-->
<!--  text-transform: uppercase;-->
<!--  color: $black;-->
<!--  font-size: 40px;-->
<!--  max-width: 640px;-->
<!--  margin-bottom: 40px;-->
<!--  line-height: 1.1;-->

<!--  @include responsive($sm) {-->
<!--    font-size: 36px;-->
<!--  }-->
<!--}-->

<!--.project-details__description {-->
<!--  color: $grey;-->
<!--  font-size: 18px;-->
<!--  line-height: 1.5;-->
<!--  @include mainFont();-->
<!--  max-width: 620px;-->
<!--}-->
<!--</style>-->


