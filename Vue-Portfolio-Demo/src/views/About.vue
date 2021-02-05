<template>
  <div class="page vs-section about" ref="about">
    <div class="about__head">
      <div class="container">
        <div class="about__content-container">
          <p class="about__description" ref="description">{{ about.description }}</p>
        </div>
      </div>
      <div class="about__headline">
        <div class="about__headline-container">
          <h2 class="about__headline-title" ref="headline">
            <span
              v-for="(part, index) in headline"
              :key="index"
              :class="{ 'primary': index < 2 }"
            >{{ part }}</span>
          </h2>
        </div>
      </div>
    </div>

    <div class="about__content">
      <div class="container">
        <div class="about__content-section about__content-section--description">
          <div class="about__content-section-left">
            <h3 class="about__content-section-title">{{ about.sections.description.title }}</h3>
          </div>
          <div class="about__content-section-right">
            <p v-for="(text, index) in about.sections.description.texts" :key="index">{{ text }}</p>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="about__content-section about__content-section--experiences">
          <div class="about__content-section-left">
            <h3 class="about__content-section-title">{{ about.sections.experiences.title }}</h3>
          </div>
          <div class="about__content-section-right">
            <ul class="about__content-experiences">
              <li
                class="about__content-experience"
                v-for="(experience, index) in about.sections.experiences.items"
                :key="index"
              >
                <div class="about__content-experience-left">
                  <span class="about__content-experience-title">{{ experience.title }}</span>
                  <span class="about__content-experience-description">{{ experience.description }}</span>
                </div>
                <div class="about__content-experience-right">
                  <span class="about__content-experience-period">{{ experience.period }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="about__content-section about__content-section--motivation">
          <div class="about__content-section-left">
            <h3 class="about__content-section-title">{{ about.sections.motivation.title }}</h3>
          </div>
          <div class="about__content-section-right">
            <p v-for="(text, index) in about.sections.motivation.texts" :key="index">{{ text }}</p>
          </div>
        </div>
      </div>

      <about-slider :smooth="smooth" :data="about.sections.motivation"></about-slider>

      <div class="container">
        <div class="about__content-section about__content-section--focus">
          <div class="about__content-section-left">
            <h3 class="about__content-section-title">{{ about.sections.focus.title }}</h3>
          </div>
          <div class="about__content-section-right">
            <ul class="about__content-skills">
              <li
                class="about__content-skill"
                v-for="(skill, index) in about.sections.focus.items"
                :key="index"
              >
                <h4 class="about__content-skill-title">{{ skill.title }}</h4>

                <ul class="about__content-skill-details">
                  <li
                    class="about__content-skill-detail"
                    v-for="(element, index2) in skill.elements"
                    :key="index2"
                  >{{ element }}</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="about__content-section about__content-section--mentions">
          <div class="about__content-section-left">
            <h3 class="about__content-section-title">{{ about.sections.recognition.title }}</h3>
          </div>
          <div class="about__content-section-right">
            <ul class="about__content-mentions">
              <li
                class="about__content-mention"
                v-for="(item, index) in about.sections.recognition.items"
                :key="index"
              >
                <div class="about__content-mention-left">
                  <span class="about__content-mention-title">{{ item.title }}</span>
                  <span class="about__content-mention-description">{{ item.description }}</span>
                </div>
                <div class="about__content-mention-right">
                  <span class="about__content-mention-period">{{ item.organization }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="about__footer">
      <global-footer :light="true"></global-footer>
    </div>
  </div>
</template>

<script>
import SmoothScrolling from "@/services/SmoothScrolling";
import GlobalFooter from "@/components/GlobalFooter";
import AboutSlider from "@/components/modules/AboutSlider";
import { TweenMax, TimelineMax } from "gsap";
import { SWITCH_ABOUT_ACTIVE, SWITCH_CURRENT_SCROLL } from "@/store/types";
import { map, clamp } from "@/services/utils";
import { ease } from "@/services/Easings";

export default {
  name: "About",
  metaInfo: {
    title: "About Grégoire Mielle — Curious developer & HETIC student"
  },
  components: {
    GlobalFooter,
    AboutSlider
  },
  data() {
    return {
      smooth: null,
      headline: this.$store.state.content.about.headline.split(" ")
    };
  },
  computed: {
    websiteReady() {
      return this.$store.state.websiteReady;
    },
    about() {
      return this.$store.state.content.about;
    }
  },
  watch: {
    websiteReady(value) {
      if (value === true) {
        this.enterAnimation(0.8);
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

      timeline
        .fromTo(
          this.$refs.description,
          2,
          {
            opacity: 1,
            y: 0
          },
          {
            opacity: 0,
            y: 40,
            ease: ease
          }
        )
        .staggerFromTo(
          this.$refs.headline.querySelectorAll("span.primary"),
          2,
          {
            y: "0%"
          },
          {
            y: "100%",
            ease: ease
          },
          0.25,
          "-=1.9"
        );
    },
    enterAnimation(delay = 0) {
      const timeline = new TimelineMax();

      timeline
        .fromTo(
          this.$refs.description,
          2,
          {
            opacity: 0,
            y: 40
          },
          {
            opacity: 1,
            y: 0,
            ease: ease,
            delay: delay
          }
        )
        .staggerFromTo(
          this.$refs.headline.querySelectorAll("span"),
          2,
          {
            y: "100%"
          },
          {
            y: "0%",
            ease: ease
          },
          0.25,
          "-=1.9"
        );
    }
  },
  mounted() {
    this.smooth = new SmoothScrolling({
      native: false,
      preload: true,
      preventTouch: true,
      limitInertia: true,
      section: this.$refs.about,
      vs: {
        touchMultiplier: 4
      },
      ease: 0.08,
      callback: e => {
        TweenMax.set(this.$refs.headline, {
          x: -e
        });

        TweenMax.set(document.querySelector(".global-canvas"), {
          y: -e * 0.7
        });
      }
    });

    this.smooth.init();

    TweenMax.to(document.querySelector(".global-canvas"), 1.2, {
      y: 0,
      ease: ease
    });

    if (this.websiteReady === true) {
      this.enterAnimation(this.$route.params.delay);
    }
  },
  beforeRouteEnter(to, from, next) {
    if (
      from.name === "project1" ||
      from.name === "project2" ||
      from.name === "project3"
    ) {
      to.params.delay = 1.8;
    } else {
      to.params.delay = 0;
    }

    next();
  },
  beforeRouteLeave(to, from, next) {
    let scrollReady = false;
    let animationReady = false;

    this.smooth.onScrolledToTop(() => {
      scrollReady = true;

      if (animationReady === true) {
        this.$store.commit(SWITCH_ABOUT_ACTIVE, false);
        next();
      }
    });

    this.leaveAnimation(this.smooth.vars.current, () => {
      animationReady = true;

      if (scrollReady === true) {
        this.$store.commit(SWITCH_ABOUT_ACTIVE, false);
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
<!--.about {-->
<!--  position: fixed;-->
<!--  z-index: 20;-->
<!--}-->

<!--.about__head {-->
<!--  .container {-->
<!--    display: flex;-->
<!--    flex-direction: row;-->
<!--    justify-content: flex-end;-->
<!--  }-->

<!--  .about__content-container {-->
<!--    width: 50%;-->

<!--    @include responsive($sm) {-->
<!--      width: 100%;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.about__head {-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  height: 100vh;-->
<!--  display: flex;-->
<!--  align-items: center;-->

<!--  @include responsive($sm) {-->
<!--    align-items: flex-end;-->
<!--  }-->
<!--}-->

<!--.about__content-container {-->
<!--  position: relative;-->
<!--  z-index: 20;-->
<!--  @include responsive($sm) {-->
<!--    margin-bottom: 100px;-->
<!--  }-->
<!--}-->

<!--.about__description {-->
<!--  @include mainFont();-->
<!--  color: $white;-->
<!--  line-height: 1.5;-->
<!--  max-width: 440px;-->
<!--  font-size: 18px;-->
<!--}-->

<!--.about__headline {-->
<!--  position: absolute;-->
<!--  bottom: -50px;-->
<!--  left: 0px;-->
<!--  right: 0;-->
<!--  width: 100%;-->
<!--  overflow: hidden;-->
<!--  z-index: 90;-->

<!--  @include responsive($sm) {-->
<!--    z-index: 10;-->
<!--  }-->
<!--}-->

<!--.about__headline-container {-->
<!--  width: 100000px;-->
<!--  transform: translateX(-40px);-->
<!--}-->

<!--.about__headline-title,-->
<!--.about__headline-title span {-->
<!--  font-size: 280px;-->
<!--  @include headingFont();-->
<!--  text-transform: uppercase;-->
<!--  line-height: 1;-->
<!--  color: #141414;-->
<!--}-->

<!--.about__headline-title {-->
<!--  span {-->
<!--    display: inline-block;-->
<!--  }-->

<!--  span:not(:last-child) {-->
<!--    margin-right: 100px;-->
<!--  }-->
<!--}-->

<!--.about__content {-->
<!--  padding-top: 260px;-->
<!--  background-color: #1a1a1a;-->
<!--}-->

<!--.about__content-section {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  padding-bottom: 150px;-->

<!--  @include responsive($sm) {-->
<!--    flex-direction: column;-->
<!--    padding-bottom: 100px;-->
<!--  }-->

<!--  &&#45;&#45;description {-->
<!--    p {-->
<!--      color: $white;-->
<!--      @include mainFont();-->
<!--      line-height: 1.5;-->
<!--      font-size: 18px;-->
<!--      margin-bottom: 40px;-->
<!--    }-->
<!--  }-->

<!--  &&#45;&#45;motivation {-->
<!--    padding-bottom: 0px;-->

<!--    p {-->
<!--      color: $white;-->
<!--      @include mainFont();-->
<!--      line-height: 1.5;-->
<!--      font-size: 18px;-->
<!--      margin-bottom: 40px;-->
<!--    }-->
<!--  }-->

<!--  &&#45;&#45;mentions {-->
<!--    padding-bottom: 60px;-->
<!--  }-->
<!--}-->

<!--.about__content-section-left,-->
<!--.about__content-section-right {-->
<!--  width: 50%;-->

<!--  @include responsive($sm) {-->
<!--    width: 100%;-->
<!--  }-->
<!--}-->

<!--.about__content-section-right {-->
<!--  p:last-child {-->
<!--    margin-bottom: 0px;-->
<!--  }-->
<!--}-->

<!--.about__content-section-left {-->
<!--  @include responsive($sm) {-->
<!--    margin-bottom: 40px;-->
<!--  }-->
<!--}-->

<!--.about__content-section-title {-->
<!--  color: $white;-->
<!--  @include headingFont();-->
<!--  text-transform: uppercase;-->
<!--  font-size: 22px;-->
<!--}-->

<!--.about__content-experiences {-->
<!--  .about__content-experience:not(:last-child) {-->
<!--    margin-bottom: 40px;-->
<!--  }-->
<!--}-->

<!--.about__content-experience {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  align-items: flex-start;-->
<!--  justify-content: flex-start;-->

<!--  @include responsive($sm) {-->
<!--    flex-direction: column;-->
<!--  }-->
<!--}-->

<!--.about__content-experience-left {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  flex: 1;-->

<!--  @include responsive($sm) {-->
<!--    margin-bottom: 10px;-->
<!--  }-->
<!--}-->

<!--.about__content-experience-title {-->
<!--  color: $white;-->
<!--  font-size: 18px;-->
<!--  @include mainFontMedium();-->
<!--}-->

<!--.about__content-experience-description {-->
<!--  color: $white;-->
<!--  font-size: 17px;-->
<!--  margin-top: 10px;-->
<!--}-->

<!--.about__content-experience-period {-->
<!--  color: $white;-->
<!--  font-size: 17px;-->
<!--}-->

<!--.about__content-skills {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  flex-wrap: wrap;-->

<!--  .about__content-skill:last-child {-->
<!--    margin-bottom: 0px;-->
<!--  }-->
<!--}-->

<!--.about__content-skill {-->
<!--  width: 50%;-->
<!--  padding-right: 40px;-->
<!--  margin-bottom: 60px;-->

<!--  @include responsive($sm) {-->
<!--    width: 100%;-->
<!--  }-->
<!--}-->

<!--.about__content-skill-title {-->
<!--  color: $white;-->
<!--  font-size: 18px;-->
<!--  @include mainFontMedium();-->
<!--  margin-bottom: 20px;-->
<!--  line-height: 1.4;-->
<!--}-->

<!--.about__content-skill-detail {-->
<!--  color: $white;-->
<!--  font-size: 17px;-->
<!--  margin-top: 10px;-->
<!--  line-height: 1.3;-->
<!--}-->

<!--.about__content-mentions {-->
<!--  .about__content-mention:not(:last-child) {-->
<!--    margin-bottom: 40px;-->
<!--  }-->
<!--}-->

<!--.about__content-mention {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  align-items: flex-start;-->
<!--  justify-content: flex-start;-->

<!--  @include responsive($sm) {-->
<!--    flex-direction: column;-->
<!--  }-->
<!--}-->

<!--.about__content-mention-left {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  flex: 1;-->

<!--  @include responsive($sm) {-->
<!--    margin-bottom: 10px;-->
<!--  }-->
<!--}-->

<!--.about__content-mention-title {-->
<!--  color: $white;-->
<!--  font-size: 18px;-->
<!--  @include mainFontMedium();-->
<!--}-->

<!--.about__content-mention-description {-->
<!--  color: $white;-->
<!--  font-size: 17px;-->
<!--  margin-top: 10px;-->
<!--}-->

<!--.about__content-mention-period {-->
<!--  color: $white;-->
<!--  font-size: 17px;-->
<!--}-->

<!--.about__footer {-->
<!--  background-color: #1a1a1a;-->
<!--}-->
<!--</style>-->


