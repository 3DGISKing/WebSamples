<template>
  <div class="page vs-section project" ref="project">
    <div class="project__content">
      <div v-for="(section, index) in project.sections" :key="index">
        <project-introduction v-if="section.type === 'intro'" :data="section.data"></project-introduction>
        <project-picture
          v-else-if="section.type === 'picture'"
          :data="section.data"
          :smooth="smooth"
        ></project-picture>
        <project-explanation
          v-else-if="section.type === 'explanation'"
          :data="section.data"
          :smooth="smooth"
        ></project-explanation>
        <project-parallax
          v-else-if="section.type === 'parallax'"
          :data="section.data"
          :smooth="smooth"
        ></project-parallax>
        <project-details
          v-else-if="section.type === 'details'"
          :data="section.data"
          :smooth="smooth"
        ></project-details>
        <project-fullwidth-picture v-else-if="section.type === 'fullwidth'" :data="section.data"></project-fullwidth-picture>
        <project-headline
          v-else-if="section.type === 'headline'"
          :data="section.data"
          :smooth="smooth"
        ></project-headline>
        <project-slider v-else-if="section.type === 'slider'" :data="section.data" :smooth="smooth"></project-slider>
        <project-video v-else-if="section.type === 'video'" :data="section.data" :smooth="smooth"></project-video>
      </div>

      <global-footer></global-footer>
    </div>
  </div>
</template>

<script>
import SmoothScrolling from "@/services/SmoothScrolling";
import ProjectIntroduction from "@/components/modules/ProjectIntroduction";
import ProjectPicture from "@/components/modules/ProjectPicture";
import ProjectVideo from "@/components/modules/ProjectVideo";
import ProjectExplanation from "@/components/modules/ProjectExplanation";
import ProjectParallax from "@/components/modules/ProjectParallax";
import ProjectDetails from "@/components/modules/ProjectDetails";
import ProjectHeadline from "@/components/modules/ProjectHeadline";
import ProjectFullwidthPicture from "@/components/modules/ProjectFullwidthPicture";
import ProjectSlider from "@/components/modules/ProjectSlider";
import GlobalFooter from "@/components/GlobalFooter";
import { TweenMax, TimelineMax } from "gsap";
import {
  SWITCH_PROJECT_ACTIVE,
  SWITCH_CURRENT_SCROLL,
  SWITCH_ABOUT_ACTIVE
} from "@/store/types";
import { map, clamp } from "@/services/utils";
import { ease, ease2, ease3 } from "@/services/Easings";

export default {
  name: "Project1",
  components: {
    ProjectIntroduction,
    ProjectPicture,
    ProjectVideo,
    ProjectExplanation,
    ProjectFullwidthPicture,
    ProjectParallax,
    ProjectDetails,
    ProjectHeadline,
    ProjectSlider,
    GlobalFooter
  },
  data() {
    return {
      smooth: null
    };
  },
  computed: {
    websiteReady() {
      return this.$store.state.websiteReady;
    },
    project() {
      return this.$store.state.content.projects[1];
    }
  },
  watch: {
    websiteReady(value) {
      if (value === true) {
        this.enterAnimation(1.6);
      }
    }
  },
  methods: {
    leaveAnimation(currentScroll, callback) {
      const timeline = new TimelineMax({
        onComplete: () => {
          callback();
        }
      });

      if (currentScroll > window.innerHeight) {
        timeline.staggerFromTo(
          document.querySelectorAll(".project-section"),
          1.6,
          {
            opacity: 1
          },
          {
            opacity: 0,
            ease: ease
          },
          -0.08
        );
      } else {
        timeline
          .fromTo(
            document.querySelector(".project-intro__title"),
            1.6,
            {
              y: 0,
              opacity: 1
            },
            {
              y: 40,
              opacity: 0,
              ease: ease
            }
          )
          .fromTo(
            document.querySelector(".project-intro__meta"),
            1.6,
            {
              y: 0,
              opacity: 1
            },
            {
              y: 40,
              opacity: 0,
              ease: ease
            },
            "-=1.5"
          )
          .fromTo(
            document.querySelector(".project-intro__description"),
            1.6,
            {
              y: 0,
              opacity: 1
            },
            {
              y: 40,
              opacity: 0,
              ease: ease
            },
            "-=1.5"
          )
          .fromTo(
            document.querySelector(".project-intro__action"),
            1.6,
            {
              y: 0,
              opacity: 1
            },
            {
              y: 40,
              opacity: 0,
              ease: ease
            },
            "-=1.5"
          );
      }
    },
    enterAnimation(delay = 0) {
      const timeline = new TimelineMax();

      timeline
        .fromTo(
          document.querySelector(".project-intro__title"),
          1.6,
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            ease: ease,
            delay: delay
          }
        )
        .fromTo(
          document.querySelector(".project-intro__meta"),
          1.6,
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            ease: ease
          },
          "-=1.5"
        )
        .fromTo(
          document.querySelector(".project-intro__description"),
          1.6,
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            ease: ease
          },
          "-=1.5"
        )
        .fromTo(
          document.querySelector(".project-intro__action"),
          1.6,
          {
            y: 40,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            ease: ease
          },
          "-=1.5"
        );
    }
  },
  mounted() {
    this.$store.commit(SWITCH_PROJECT_ACTIVE, true);

    this.smooth = new SmoothScrolling({
      native: false,
      preload: true,
      preventTouch: true,
      limitInertia: true,
      section: this.$refs.project,
      vs: {
        touchMultiplier: 4
      },
      ease: 0.08,
      callback: e => {
        this.$store.commit(SWITCH_CURRENT_SCROLL, e);

        const mappedValue = clamp(
          map(e, 0, window.innerWidth, 0, window.innerWidth * 1.4),
          0,
          window.innerWidth * 1.2
        );

        TweenMax.set(document.querySelector(".global-canvas"), {
          y: -mappedValue
        });
      }
    });

    this.smooth.init();

    if (this.websiteReady === true) {
      this.enterAnimation();
    }
  },
  beforeRouteLeave(to, from, next) {
    let scrollReady = false;
    let animationReady = false;

    this.smooth.onScrolledToTop(() => {
      scrollReady = true;

      if (animationReady === true) {
        this.$store.commit(SWITCH_PROJECT_ACTIVE, false);

        if (to.name === "about") {
          this.$store.commit(SWITCH_ABOUT_ACTIVE, true);
        }

        next();
      }
    });

    this.leaveAnimation(this.smooth.vars.current, () => {
      animationReady = true;

      if (scrollReady === true) {
        this.$store.commit(SWITCH_PROJECT_ACTIVE, false);

        if (to.name === "about") {
          this.$store.commit(SWITCH_ABOUT_ACTIVE, true);
        }

        next();
      }
    });

    this.smooth.scrollToTop();
  },
  beforeDestroy() {
    this.smooth.destroy();
  }
};
</script>

<!--<style lang="scss">-->
<!--.project {-->
<!--  position: fixed;-->
<!--  z-index: 20;-->
<!--}-->

<!--.project__content {-->
<!--  background-color: $white;-->
<!--  margin-top: 80vh;-->
<!--}-->
<!--</style>-->


