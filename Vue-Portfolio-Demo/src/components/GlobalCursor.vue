<template>
  <div class="global-cursor" :class="{ 'global-cursor--pressed': cursorState === 'pressed' }">
    <div class="global-cursor__element">
      <div class="global-cursor__container">
        <div class="global-cursor__part" ref="cursor">
          <svg
            ref="cursorSvg"
            class="global-cursor__svg"
            width="38"
            height="38"
            viewBox="0 0 38 38"
          >
            <circle ref="cursorCircle" class="global-cursor__circle" r="17" cx="19" cy="19"></circle>
          </svg>
          <div class="global-cursor__grip global-cursor__grip--top"></div>
          <div class="global-cursor__grip global-cursor__grip--bottom"></div>
        </div>

        <div class="global-cursor__part global-cursor__part--circle" ref="cursorCenter">
          <span class="global-cursor__part--circle-inner"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TimelineMax, TweenMax, Power4, Power2 } from "gsap";
import { map, clamp, isMobile } from "@/services/utils";
import { ease, ease2, ease3 } from "@/services/Easings";

export default {
  name: "GlobalCursor",
  data() {
    return {
      magnetic: false,
      cursorX: 0,
      cursorY: 0,
      cursorCenterX: 0,
      cursorCenterY: 0,
      cursorWidth: 0,
      cursorHeight: 0,
      cursorCenterWidth: 0,
      cursorCenterHeight: 0,
      mouseX: 0,
      mouseY: 0,
      watchedElements: [],
      watchedElementsListenerEnter: null,
      watchedElementsListenerLeave: null,
      isActionHover: false
    };
  },
  computed: {
    cursorState() {
      return this.$store.state.cursorState;
    },
    assetsLoadingProgress() {
      return this.$store.state.assetsLoadingProgress;
    },
    websiteReady() {
      return this.$store.state.websiteReady;
    }
  },
  watch: {
    assetsLoadingProgress(percentage) {
      const mappedPercentage = map(percentage, 0, 100, 110, 0);

      TweenMax.to(this.$refs.cursorCircle, 1.8, {
        strokeDashoffset: mappedPercentage,
        ease: ease2
      });

      if (percentage === 100) {
        const timeline = new TimelineMax({
          onComplete: () => {
            this.cursorLoop();
          }
        });

        timeline.to(this.$refs.cursorCenter.querySelector("span"), 1.8, {
          opacity: 1,
          ease: ease2,
          delay: 0.5
        });
      }
    },
    websiteReady(loaded) {
      if (loaded === true) {
        this.enterAnimation();
      }
    },
    $route(value) {
      this.magnetic = false;
      this.watchedElements = [...document.querySelectorAll(".action-element")];
      this.actionLeaveAnimation();

      this.watchedElements.forEach(element => {
        element.addEventListener(
          "mouseenter",
          () => {
            this.isActionHover = true;
            const data = element.getBoundingClientRect();
            const x = parseFloat(element.getAttribute("data-x"));
            const y = parseFloat(element.getAttribute("data-y"));

            this.magnetic = {
              x: Math.round(data.left + x),
              y: Math.round(data.top + y),
              visible: parseInt(element.getAttribute("data-visible"))
            };
          },
          { passive: true }
        );

        element.addEventListener(
          "mouseleave",
          () => {
            this.isActionHover = false;
            this.magnetic = false;
          },
          { passive: true }
        );
      });
    },
    isActionHover(value) {
      if (value === true) {
        this.actionEnterAnimation();
      } else {
        this.actionLeaveAnimation();
      }
    }
  },
  methods: {
    actionEnterAnimation() {
      const timeline = new TimelineMax();

      timeline.to(this.$refs.cursorCircle, 2.2, {
        strokeDashoffset: 110,
        scale: 0,
        ease: ease3
      });
    },
    actionLeaveAnimation() {
      TweenMax.killTweensOf(this.$refs.cursorCircle);
      TweenMax.killTweensOf(this.$refs.cursorSvg);

      const timeline = new TimelineMax();

      timeline.to(this.$refs.cursorCircle, 0.8, {
        strokeDashoffset: 0,
        scale: 1,
        ease: ease3
      });
    },
    enterAnimation() {},
    cursorLoop() {
      if (this.websiteReady === true) {
        const newCursorX = this.cursorX + (this.mouseX - this.cursorX) * 0.14;
        const newCursorY = this.cursorY + (this.mouseY - this.cursorY) * 0.14;

        let newCursorCenterX =
          this.cursorCenterX + (this.mouseX - this.cursorCenterX) * 0.15;
        let newCursorCenterY =
          this.cursorCenterY + (this.mouseY - this.cursorCenterY) * 0.15;

        if (this.magnetic !== false) {
          const xDifference = clamp(
            (this.mouseX - this.magnetic.x) * 0.2,
            -20,
            20
          );
          const yDifference = clamp(
            (this.mouseY - this.magnetic.y) * 0.2,
            -20,
            20
          );

          newCursorCenterX =
            this.cursorCenterX +
            (this.magnetic.x + xDifference - this.cursorCenterX) * 0.06;
          newCursorCenterY =
            this.cursorCenterY +
            (this.magnetic.y + yDifference - this.cursorCenterY) * 0.06;
        }

        const distanceX = newCursorX - this.cursorX;
        const distanceY = newCursorY - this.cursorY;

        this.cursorX = newCursorX;
        this.cursorY = newCursorY;

        this.cursorCenterX = newCursorCenterX;
        this.cursorCenterY = newCursorCenterY;

        const scale = clamp(
          1 + (Math.hypot(distanceX, distanceY) / 15) * 0.15,
          0,
          1.5
        );

        const scale2 =
          this.magnetic && this.magnetic.visible === 0
            ? 0
            : clamp(1 + (Math.hypot(distanceX, distanceY) / 15) * 0.15, 0, 1.5);

        TweenMax.set(this.$refs.cursor, {
          x: `${this.cursorX - this.cursorWidth / 2}px`,
          y: `${this.cursorY - this.cursorHeight / 2}px`,
          scale
        });

        TweenMax.set(this.$refs.cursorCenter, {
          x: `${this.cursorCenterX - this.cursorCenterWidth / 2}px`,
          y: `${this.cursorCenterY - this.cursorCenterHeight / 2}px`,
          scale: scale2
        });
      }

      if (isMobile() === false) {
        requestAnimationFrame(this.cursorLoop.bind(this));
      }
    }
  },
  mounted() {
    this.cursorWidth = this.$refs.cursor.offsetWidth;
    this.cursorHeight = this.$refs.cursor.offsetHeight;
    this.cursorCenterWidth = this.$refs.cursorCenter.offsetWidth;
    this.cursorCenterHeight = this.$refs.cursorCenter.offsetHeight;

    this.watchedElements = [...document.querySelectorAll(".action-element")];

    this.watchedElements.forEach(
      element => {
        element.addEventListener(
          "mouseenter",
          () => {
            this.isActionHover = true;
            const data = element.getBoundingClientRect();
            const x = parseFloat(element.getAttribute("data-x"));
            const y = parseFloat(element.getAttribute("data-y"));

            this.magnetic = {
              x: Math.round(data.left + x),
              y: Math.round(data.top + y),
              visible: parseInt(element.getAttribute("data-visible"))
            };
          },
          { passive: true }
        );

        element.addEventListener("mouseleave", () => {
          this.isActionHover = false;
          this.magnetic = false;
        });
      },
      { passive: true }
    );

    window.addEventListener("mousemove", event => {
      // Update cursor position only if ready
      if (this.websiteReady === true) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
      }
    });

    const loadingContent = document
      .querySelector(".global-transition__content")
      .getBoundingClientRect();

    // Default cursor position
    this.cursorX = this.mouseX = loadingContent.left - 40;
    this.cursorY = this.mouseY = loadingContent.top + 28;
    this.cursorCenterX = loadingContent.left - 40;
    this.cursorCenterY = loadingContent.top + 28;

    TweenMax.set(this.$refs.cursor, {
      x: `${this.cursorX - this.cursorWidth / 2}px`,
      y: `${this.cursorY - this.cursorHeight / 2}px`
    });

    TweenMax.set(this.$refs.cursorCenter, {
      x: `${this.cursorCenterX - this.cursorCenterWidth / 2}px`,
      y: `${this.cursorCenterY - this.cursorCenterHeight / 2}px`
    });
  }
};
</script>

<!--<style lang="scss">-->
<!--.global-cursor {-->
<!--  position: fixed;-->
<!--  top: 0;-->
<!--  right: 0;-->
<!--  bottom: 0;-->
<!--  left: 0;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  pointer-events: none;-->
<!--  user-select: none;-->
<!--  z-index: 110;-->

<!--  @include responsive($sm) {-->
<!--    display: none;-->
<!--  }-->

<!--  &&#45;&#45;pressed {-->
<!--    .global-cursor__part {-->
<!--      &&#45;&#45;circle {-->
<!--        &-inner {-->
<!--          transform: scale(1.2);-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    .global-cursor__svg {-->
<!--      transform: scale(0.75);-->
<!--    }-->

<!--    .global-cursor__grip {-->
<!--      &&#45;&#45;top {-->
<!--        transform: translate(-50%, calc(-50% - 30px)) scale(1);-->
<!--      }-->

<!--      &&#45;&#45;bottom {-->
<!--        transform: translate(-50%, calc(-50% + 30px)) scale(1);-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--body.is-touch {-->
<!--  .global-cursor {-->
<!--    display: none;-->
<!--  }-->
<!--}-->

<!--.global-cursor__element {-->
<!--  position: absolute;-->
<!--  top: 0px;-->
<!--  left: 0px;-->
<!--}-->

<!--.global-cursor__container {-->
<!--  position: relative;-->
<!--  width: 38px;-->
<!--  height: 38px;-->
<!--}-->

<!--.global-cursor__part {-->
<!--  position: absolute;-->
<!--  width: 38px;-->
<!--  height: 38px;-->

<!--  &&#45;&#45;circle {-->
<!--    position: absolute;-->
<!--    will-change: transform;-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    justify-content: center;-->

<!--    &-inner {-->
<!--      display: inline-block;-->
<!--      width: 5px;-->
<!--      height: 5px;-->
<!--      border-radius: 50%;-->
<!--      background-color: $main-color;-->
<!--      opacity: 0;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.global-cursor__grip {-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  width: 5px;-->
<!--  height: 5px;-->
<!--  transform: translate(-50%, -50%) scale(0);-->
<!--  border-radius: 50%;-->
<!--  background-color: $main-color;-->
<!--  transition: all 0.3s $easing;-->

<!--  &&#45;&#45;top {-->
<!--    transform: translate(-50%, -50%) scale(0);-->
<!--  }-->

<!--  &&#45;&#45;bottom {-->
<!--    transform: translate(-50%, -50%) scale(0);-->
<!--  }-->
<!--}-->

<!--.global-cursor__svg {-->
<!--  transition: all 0.6s $easing;-->

<!--  circle {-->
<!--    fill: none;-->
<!--    stroke-width: 2px;-->
<!--    stroke: $main-color;-->
<!--    stroke-dasharray: 110px;-->
<!--    stroke-dashoffset: 110px;-->
<!--    transition: stroke 0.6s ease-in-out;-->
<!--  }-->
<!--}-->

<!--.global-cursor__circle {-->
<!--  transform-origin: center;-->
<!--}-->
<!--</style>-->
