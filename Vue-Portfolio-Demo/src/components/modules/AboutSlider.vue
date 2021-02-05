<template>
  <intersect @enter="onEnter" @leave="onLeave">
    <section class="about-slider">
      <div class="about-slider__container" ref="container">
        <div class="about-slider__slider" ref="slider">
          <div
            class="about-slider__element"
            v-for="(element, index) in data.elements"
            :key="index"
            ref="elements"
          >
            <img :src="element.source" :alt="element.title" class="about-slider__element-source">
          </div>
        </div>
      </div>

      <div class="container about-slider__nav-container">
        <nav class="about-slider__nav">
          <button
            ref="previous"
            role="button"
            aria-label="Previous"
            @click.prevent="onElementsLeft"
            class="action-button about-slider__nav-previous action-element"
            data-x="164"
            data-y="52"
            data-visible="0"
          >
            <span class="action-button__text">Previous</span>

            <div class="action-button__shapes">
              <div class="action-button__rectangle"></div>

              <div class="action-button__arrow">
                <svg height="16" width="16">
                  <polygon points="2,2 8,5.5 2,10"></polygon>
                </svg>
              </div>

              <div class="action-button__circles">
                <svg
                  class="action-button__circle action-button__circle--base"
                  height="64"
                  width="64"
                >
                  <circle cx="32" cy="32" r="28"></circle>
                </svg>
                
                <svg
                  class="action-button__circle action-button__circle--fill"
                  height="64"
                  width="64"
                >
                  <circle cx="32" cy="32" r="28"></circle>
                </svg>
              </div>
            </div>
          </button>
          
          <button
            ref="next"
            role="button"
            aria-label="Next"
            @click.prevent="onElementsRight"
            class="action-button about-slider__nav-next action-element"
            data-x="164"
            data-y="52"
            data-visible="0"
          >
            <span class="action-button__text">Next</span>

            <div class="action-button__shapes">
              <div class="action-button__rectangle"></div>

              <div class="action-button__arrow">
                <svg height="16" width="16">
                  <polygon points="2,2 8,5.5 2,10"></polygon>
                </svg>
              </div>

              <div class="action-button__circles">
                <svg
                  class="action-button__circle action-button__circle--base"
                  height="64"
                  width="64"
                >
                  <circle cx="32" cy="32" r="28"></circle>
                </svg>
                
                <svg
                  class="action-button__circle action-button__circle--fill"
                  height="64"
                  width="64"
                >
                  <circle cx="32" cy="32" r="28"></circle>
                </svg>
              </div>
            </div>
          </button>
        </nav>
      </div>
    </section>
  </intersect>
</template>

<script>
import { TimelineMax, TweenMax, Power2 } from "gsap";
import throttle from "lodash.throttle";
import Intersect from "@/services/IntersectionObserver";
import { ease, ease3 } from "@/services/Easings";

export default {
  name: "ProjectSlider",
  props: ["smooth", "data"],
  components: {
    Intersect
  },
  data() {
    return {
      previousScrollValue: 0,
      currentScrollValue: 0,
      visible: false,
      elementsOffset: 0,
      elementsCurrentTranslation: 0,
      elementsMinTranslation: 0,
      elementsMaxTranslation: 0
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

    this.elementsOffset =
      window.innerWidth > 960
        ? window.innerWidth * 0.4
        : this.$refs.elements[0].getBoundingClientRect().width;
    const totalContainerWidth =
      (this.$refs.elements[0].getBoundingClientRect().width + 30) *
      this.$refs.elements.length;
    const containerPaddingLeft = parseInt(
      window
        .getComputedStyle(this.$refs.container, null)
        .getPropertyValue("padding-left")
    );
    this.elementsMaxTranslation =
      totalContainerWidth - (window.innerWidth - containerPaddingLeft - 20);
  },
  methods: {
    onEnter() {
      if (
        this.currentScrollValue > this.previousScrollValue &&
        this.visible === false
      ) {
        this.visible = true;
        this.elementsCurrentTranslation = 0;

        const timeline = new TimelineMax();

        timeline
          .set(this.$refs.slider, {
            x: this.elementsCurrentTranslation
          })
          .staggerFromTo(
            this.$refs.slider.querySelectorAll(".about-slider__element-source"),
            3,
            {
              scale: 1.25
            },
            {
              scale: 1,
              ease: ease
            },
            0.2
          )
          .fromTo(
            this.$refs.previous,
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
            "-=3"
          )
          .fromTo(
            this.$refs.next,
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
            "-=2.7"
          );
      }
    },
    onLeave() {
      this.visible = false;
    },
    onElementsLeft() {
      const potentialTranslation =
        this.elementsCurrentTranslation + this.elementsOffset;
      if (potentialTranslation < 0) {
        this.elementsCurrentTranslation += this.elementsOffset;
        TweenMax.to(this.$refs.slider, 2, {
          x: this.elementsCurrentTranslation,
          ease: ease
        });
      } else {
        this.elementsCurrentTranslation = 0;
        TweenMax.to(this.$refs.slider, 2, {
          x: this.elementsCurrentTranslation,
          ease: ease
        });
      }
    },
    onElementsRight() {
      const potentialTranslation =
        this.elementsCurrentTranslation - this.elementsOffset;
      if (Math.abs(potentialTranslation) <= this.elementsMaxTranslation) {
        this.elementsCurrentTranslation -= this.elementsOffset;
        TweenMax.to(this.$refs.slider, 2, {
          x: this.elementsCurrentTranslation,
          ease: ease
        });
      } else {
        this.elementsCurrentTranslation = -this.elementsMaxTranslation;
        TweenMax.to(this.$refs.slider, 2, {
          x: this.elementsCurrentTranslation,
          ease: ease
        });
      }
    }
  }
};
</script>

<!--<style lang="scss" scoped>-->
<!--.about-slider {-->
<!--  padding-top: 100px;-->
<!--  padding-bottom: 150px;-->

<!--  @include responsive($md) {-->
<!--    padding-top: 40px;-->
<!--    padding-bottom: 100px;-->
<!--  }-->
<!--}-->

<!--.about-slider__container {-->
<!--  width: 100%;-->
<!--  overflow: hidden;-->
<!--  padding-left: 30px;-->

<!--  @include responsive2($sm) {-->
<!--    padding-left: 50px;-->
<!--  }-->

<!--  @include responsive($sm) {-->
<!--    padding-top: 60px;-->
<!--    padding-bottom: 0px;-->
<!--  }-->

<!--  @include responsive2($lg) {-->
<!--    padding-left: 70px;-->
<!--  }-->

<!--  @media screen and (min-width: 1300px) {-->
<!--    padding-left: calc((100vw - 1300px) / 2 + 70px);-->
<!--  }-->
<!--}-->

<!--.about-slider__slider {-->
<!--  width: 10000px;-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--}-->

<!--.about-slider__element {-->
<!--  margin-right: 30px;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.about-slider__element-source {-->
<!--  width: 50vw;-->
<!--  height: auto;-->

<!--  @include responsive($md) {-->
<!--    width: 80vw;-->
<!--  }-->
<!--}-->

<!--.about-slider__nav-container {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  justify-content: flex-end;-->
<!--}-->

<!--.about-slider__nav {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  align-items: center;-->
<!--  margin-top: 50px;-->
<!--}-->

<!--.about-slider__nav-previous,-->
<!--.about-slider__nav-next {-->
<!--  display: inline-block;-->
<!--  padding: 20px 0px;-->
<!--  -webkit-appearance: none;-->
<!--  background: none;-->
<!--  border: none;-->
<!--  cursor: pointer;-->
<!--  outline: none;-->

<!--  path {-->
<!--    transition: all 0.2s $easing;-->
<!--  }-->
<!--}-->

<!--.about-slider__nav-previous {-->
<!--  margin-right: 32px;-->
<!--}-->

<!--.action-button {-->
<!--  -webkit-appearance: none;-->
<!--  border: none;-->
<!--  background: none;-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  align-items: center;-->
<!--  cursor: pointer;-->
<!--  outline: none;-->
<!--  color: $white;-->
<!--  text-decoration: none;-->

<!--  &.about-slider__nav-previous {-->
<!--    flex-direction: row-reverse;-->

<!--    .action-button__shapes {-->
<!--      transform: rotate(180deg) scale(0.7);-->
<!--    }-->

<!--    .action-button__text {-->
<!--      margin-right: 0px;-->
<!--      margin-left: 24px;-->
<!--    }-->

<!--    &:hover {-->
<!--      .action-button__text {-->
<!--        transform: translateX(-22px);-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  &:hover {-->
<!--    .action-button__circle&#45;&#45;base {-->
<!--      transform: rotate(-180deg);-->

<!--      circle {-->
<!--        stroke-dashoffset: 10;-->
<!--      }-->
<!--    }-->

<!--    .action-button__circle&#45;&#45;fill {-->
<!--      transform: rotate(-200deg);-->

<!--      circle {-->
<!--        stroke-dashoffset: 10;-->
<!--      }-->
<!--    }-->

<!--    .action-button__rectangle {-->
<!--      transform: translateY(-50%) scaleX(0);-->
<!--    }-->

<!--    .action-button__arrow {-->
<!--      polygon {-->
<!--        fill: $main-color;-->
<!--      }-->
<!--    }-->

<!--    .action-button__text {-->
<!--      transform: translateX(22px);-->
<!--    }-->
<!--  }-->

<!--  &&#45;&#45;reversed {-->
<!--    flex-direction: row-reverse;-->

<!--    &:hover {-->
<!--      .action-button__text {-->
<!--        transform: translateX(-22px);-->
<!--      }-->
<!--    }-->

<!--    .action-button__shapes {-->
<!--      transform: rotate(180deg);-->
<!--    }-->

<!--    .action-button__text {-->
<!--      margin-right: 0px;-->
<!--      margin-left: 38px;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.action-button__text {-->
<!--  display: inline-block;-->
<!--  margin-right: 24px;-->
<!--  @include mainFontBold();-->
<!--  font-size: 18px;-->
<!--  transition: all 0.5s ease;-->
<!--}-->

<!--.action-button__shapes {-->
<!--  position: relative;-->
<!--  width: 64px;-->
<!--  height: 64px;-->
<!--  transform: scale(0.7);-->
<!--}-->

<!--.action-button__rectangle {-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  right: 32px;-->
<!--  transform: translateY(-50%) scaleX(1);-->
<!--  width: 50px;-->
<!--  height: 2px;-->
<!--  background-color: $grey;-->
<!--  transform-origin: right;-->
<!--  transition: all 0.5s ease;-->
<!--}-->

<!--.action-button__arrow {-->
<!--  position: absolute;-->
<!--  top: 26px;-->
<!--  left: 27px;-->

<!--  polygon {-->
<!--    fill: $grey;-->
<!--    transition: all 0.6s ease;-->
<!--  }-->
<!--}-->

<!--.action-button__circle {-->
<!--  position: absolute;-->
<!--  top: 0;-->
<!--  left: 0;-->

<!--  &&#45;&#45;base {-->
<!--    transform: rotate(-154deg);-->
<!--    transition: all 0.6s ease;-->
<!--    opacity: 0.6;-->

<!--    circle {-->
<!--      stroke-width: 2px;-->
<!--      stroke: $grey;-->
<!--      fill: none;-->
<!--      stroke-dasharray: 200;-->
<!--      stroke-dashoffset: 50;-->
<!--      transition: all 0.6s ease;-->
<!--    }-->
<!--  }-->

<!--  &&#45;&#45;fill {-->
<!--    transition: all 0.6s ease;-->

<!--    circle {-->
<!--      stroke-width: 2px;-->
<!--      stroke: $main-color;-->
<!--      fill: none;-->
<!--      stroke-dasharray: 200;-->
<!--      stroke-dashoffset: 200;-->
<!--      transition: all 0.6s ease;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->


