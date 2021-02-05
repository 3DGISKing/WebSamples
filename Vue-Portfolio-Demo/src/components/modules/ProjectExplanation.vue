<template>
  <intersect @enter="onEnter" @leave="onLeave">
    <section class="project-section project-explanation">
      <div class="container">
        <div class="project-explanation__head">
          <h2 class="project-explanation__title" ref="title">{{ data.title }}</h2>
        </div>

        <div class="project-explanation__content" ref="content">
          <p
            class="project-explanation__description"
            v-for="(text, index) in data.texts"
            :key="index"
          >{{ text }}</p>
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
          .staggerFromTo(
            this.$refs.content.querySelectorAll(
              ".project-explanation__description"
            ),
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
            0.2,
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
<!--.project-explanation {-->
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

<!--    @include responsive($md) {-->
<!--      flex-direction: column;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.project-explanation__head {-->
<!--  width: 35%;-->

<!--  @include responsive($md) {-->
<!--    width: 100%;-->
<!--  }-->
<!--}-->

<!--.project-explanation__content {-->
<!--  width: 65%;-->
<!--  padding-left: 100px;-->

<!--  @include responsive($md) {-->
<!--    width: 100%;-->
<!--    padding-left: 0px;-->
<!--  }-->

<!--  .project-explanation__description:not(:last-child) {-->
<!--    margin-bottom: 40px;-->
<!--  }-->
<!--}-->

<!--.project-explanation__title {-->
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

<!--.project-explanation__description {-->
<!--  color: $grey;-->
<!--  font-size: 18px;-->
<!--  line-height: 1.5;-->
<!--  @include mainFont();-->
<!--  max-width: 620px;-->
<!--}-->
<!--</style>-->


