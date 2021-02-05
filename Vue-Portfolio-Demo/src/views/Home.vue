/* eslint-disable */

<template>
  <div class="page home">
    <div class="home__actions">
      <action-button
        ref="actionPrev"
        :reversed="true"
        text="Previous"
        class="action-element"
        data-x="-26"
        data-y="8"
        data-visible="0"
        v-on:onClick="onPreviousProject"
      ></action-button>
      <action-button
        ref="actionNext"
        text="Next"
        class="action-element"
        data-x="-26"
        data-y="8"
        data-visible="0"
        v-on:onClick="onNextProject"
      ></action-button>
    </div>
    
    <div class="home__list">
      <div class="home__list-container" ref="list">
        <h2
          :class="{ [`home__title home__title--${index + 1}`]: true, 'home__title--active': activeListElement === index + 1 }"
          v-for="(project, index) in content.projects"
          :key="index"
          ref="listTitles"
        >
          <span
            :class="`home__title-line home__title-line-${index2 + 1}`"
            v-for="(line, index2) in project.titleParts"
            :key="index2"
          >
            <span
              class="home__title-letter-container"
              v-for="(letter, index3) in line.split('')"
              :key="index3"
            >
              <span class="home__title-letter">{{ letter }}</span>
            </span>
          </span>
        </h2>
      </div>
    </div>
    
    <div class="home__content">
      <div class="home__content-container" ref="content">
        <div class="home__titles">
          <h2
            :class="`home__title home__title--${index + 1}${index + 1 === currentStage ? ' home__title--current' : ''}${index + 1 === previousStage ? ' home__title--previous' : ''}`"
            v-for="(project, index) in content.projects"
            ref="titles"
            :key="index"
          >
            <span
              :class="`home__title-line home__title-line-${index2 + 1}`"
              v-for="(line, index2) in project.titleParts"
              :key="index2"
            >
              <span
                class="home__title-letter-container"
                v-for="(letter, index3) in line.split('')"
                :key="index3"
              >
                <span class="home__title-letter">{{ letter }}</span>
              </span>
            </span>
          </h2>
        </div>
        
        <div class="home__enter">
          <span
            class="home__enter-action action-element"
            @click="onEnterProject"
            data-x="-26"
            data-y="8"
            data-visible="0"
          >
            <span class="home__enter-action-part" ref="action1">
              <span
                class="home__enter-action-letter"
                v-for="(letter, index) in 'Discover'.split('')"
                :key="index"
              >{{ letter }}</span>
            </span>
            <span class="home__enter-action-part" ref="action2">
              <span
                class="home__enter-action-letter"
                v-for="(letter, index) in 'project'.split('')"
                :key="index"
              >{{ letter }}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { TimelineMax, TweenMax, Power1, Power4, Bounce } from "gsap";
  import Hammer from "hammerjs";
  import { Lethargy } from "lethargy";
  import { clamp, isMobile } from "@/services/utils";
  import { ease } from "@/services/Easings";
  import ActionButton from "@/components/ActionButton";
  import {
    SWITCH_NEXT_STAGE_CLICK,
    SWITCH_PREVIOUS_STAGE_CLICK,
    SWITCH_STAGE_TRANSITION_DIRECTION,
    SWITCH_LIST_ACTIVE,
    SWITCH_PROJECT_ACTIVE,
    SWITCH_ABOUT_ACTIVE,
    SWITCH_CURRENT_STAGE
  } from "@/store/types";
  
  export default {
    name: "home",
    components: {
      ActionButton
    },
    data() {
      return {
        lethargy: null,
        readyToAnimate: false,
        activeListElement: null,
        hammerManager: null,
        hammerPan: null
      };
    },
    computed: {
      websiteReady() {
        return this.$store.state.websiteReady;
      },
      content() {
        return this.$store.state.content;
      },
      currentStage() {
        return this.$store.state.currentStage;
      },
      previousStage() {
        return this.$store.state.previousStage;
      },
      stageTransitionDirection() {
        return this.$store.state.stageTransitionDirection;
      },
      centerGap() {
        return this.$store.state.centerGap;
      },
      cursorState() {
        return this.$store.state.cursorState;
      },
      centerGapDown() {
        return this.$store.state.centerGapDown;
      },
      listActive() {
        return this.$store.state.listActive;
      }
    },
    watch: {
      cursorState(value) {
        if (value === "normal") {
          this.leaveListAnimation();
        } else if (value === "pressed") {
          this.enterListAnimation();
        }
      },
      websiteReady(value) {
        if (value === true) {
          this.enterAnimation();
        }
      },
      currentStage(index) {
        if (this.listActive === false && this.readyToAnimate === true) {
          this.switchProject();
        }
      },
      centerGap(e) {
        if (this.cursorState === "normal") {
          TweenMax.to(this.$refs.content, 1, {
            x: e.x * 0.2,
            y: e.y * 0.4,
            ease: Power1.easeOut
          });
        }
      },
      centerGapDown(y) {
        const mapped = clamp(y, -300, 300);
        
        if (mapped < -150) {
          this.activeListElement = 1;
        } else if (mapped < 150) {
          this.activeListElement = 2;
        } else {
          this.activeListElement = 3;
        }
        
        TweenMax.to(this.$refs.list, 0.7, {
          y: -mapped,
          ease: Power1.easeOut
        });
      }
    },
    mounted() {
      this.$store.commit(SWITCH_CURRENT_STAGE, 1);
      
      TweenMax.to(document.querySelector(".global-canvas"), 1.2, {
        y: 0,
        ease: ease
      });
      
      this.lethargy = new Lethargy();
      
      this.wheelHandler = event => {
        this.onMouseWheel(event);
      };
      
      this.keydownHandler = event => {
        this.onKeydown(event);
      };
      
      this.wheelHandler = this.wheelHandler.bind(this);
      this.keydownHandler = this.keydownHandler.bind(this);
      
      window.addEventListener("mousewheel", this.wheelHandler, { passive: true });
      window.addEventListener("wheel", this.wheelHandler, { passive: true });
      window.addEventListener("DOMMouseScroll", this.wheelHandler, {
        passive: true
      });
      window.addEventListener("MozMousePixelScroll", this.wheelHandler, {
        passive: true
      });
      
      document.addEventListener("keydown", this.keydownHandler, {
        passive: true
      });
      
      if (isMobile() === true) {
        this.hammerManager = new Hammer.Manager(document.querySelector(".page"));
        this.hammerPan = new Hammer.Pan();
        this.hammerManager.add(this.hammerPan);
        this.hammerManager.on("panleft", () => {
          this.$store.commit(SWITCH_STAGE_TRANSITION_DIRECTION, 1);
          this.$store.commit(SWITCH_NEXT_STAGE_CLICK);
        });
        this.hammerManager.on("panright", () => {
          this.$store.commit(SWITCH_STAGE_TRANSITION_DIRECTION, -1);
          this.$store.commit(SWITCH_PREVIOUS_STAGE_CLICK);
        });
      }
      
      if (this.websiteReady === true) {
        this.enterAnimation(2.5);
      }
    },
    beforeDestroy() {
      window.removeEventListener("mousewheel", this.wheelHandler);
      window.removeEventListener("wheel", this.wheelHandler);
      window.removeEventListener("DOMMouseScroll", this.wheelHandler);
      window.removeEventListener("MozMousePixelScroll", this.wheelHandler);
      document.removeEventListener("keydown", this.keydownHandler);
    },
    beforeRouteLeave(to, from, next) {
      if (
        to.name === "project1" ||
        to.name === "project2" ||
        to.name === "project3"
      ) {
        this.leaveToProject(next);
      } else if (to.name === "about") {
        this.leaveToAbout(next);
      }
    },
    methods: {
      leaveToAbout(next) {
        this.$store.commit(SWITCH_ABOUT_ACTIVE, true);
        
        const timeline = new TimelineMax({
          onComplete: () => {
            next();
          }
        });
        
        timeline
          .staggerTo(
            this.$refs.content.querySelectorAll(".home__title-letter-container"),
            1.8,
            {
              x: -1 * this.stageTransitionDirection * 40,
              y: -1 * this.stageTransitionDirection * 80,
              rotationX: 80,
              rotationY: this.stageTransitionDirection * -120,
              scale: 0,
              ease: ease
            },
            0.01
          )
          .fromTo(
            this.$refs.action1,
            0.8,
            {
              y: "0%"
            },
            {
              y: `${-100 * this.stageTransitionDirection}%`,
              ease: ease,
              onComplete: () => {
                TweenMax.set(this.$refs.action1, {
                  y: `${-100 * this.stageTransitionDirection * -1}%`
                });
              }
            },
            "-=1.8"
          )
          .fromTo(
            this.$refs.action2,
            0.8,
            {
              y: "0%"
            },
            {
              y: `${-100 * this.stageTransitionDirection}%`,
              ease: ease,
              onComplete: () => {
                TweenMax.set(this.$refs.action2, {
                  y: `${-100 * this.stageTransitionDirection * -1}%`
                });
              }
            },
            "-=1.7"
          )
          .fromTo(
            this.$refs.actionPrev.$el,
            1.2,
            {
              y: "0%"
            },
            {
              y: "-100%",
              ease: ease
            },
            "-=1.8"
          )
          .fromTo(
            this.$refs.actionNext.$el,
            1.2,
            {
              y: "0%"
            },
            {
              y: "-100%",
              ease: ease
            },
            "-=1.7"
          );
      },
      leaveToProject(next) {
        this.$store.commit(SWITCH_PROJECT_ACTIVE, true);
        
        const timeline = new TimelineMax({
          onComplete: () => {
            next();
          }
        });
        
        timeline
          .staggerTo(
            this.$refs.content.querySelectorAll(".home__title-letter-container"),
            1.8,
            {
              x: -1 * this.stageTransitionDirection * 40,
              y: -1 * this.stageTransitionDirection * 80,
              rotationX: 80,
              rotationY: this.stageTransitionDirection * -120,
              scale: 0,
              ease: ease
            },
            0.01
          )
          .fromTo(
            this.$refs.action1,
            0.8,
            {
              y: "0%"
            },
            {
              y: `${-100 * this.stageTransitionDirection}%`,
              ease: ease,
              onComplete: () => {
                TweenMax.set(this.$refs.action1, {
                  y: `${-100 * this.stageTransitionDirection * -1}%`
                });
              }
            },
            "-=1.8"
          )
          .fromTo(
            this.$refs.action2,
            0.8,
            {
              y: "0%"
            },
            {
              y: `${-100 * this.stageTransitionDirection}%`,
              ease: ease,
              onComplete: () => {
                TweenMax.set(this.$refs.action2, {
                  y: `${-100 * this.stageTransitionDirection * -1}%`
                });
              }
            },
            "-=1.7"
          )
          .fromTo(
            this.$refs.actionPrev.$el,
            1.2,
            {
              y: "0%"
            },
            {
              y: "-100%",
              ease: ease
            },
            "-=1.8"
          )
          .fromTo(
            this.$refs.actionNext.$el,
            1.2,
            {
              y: "0%"
            },
            {
              y: "-100%",
              ease: ease
            },
            "-=1.7"
          );
      },
      onEnterProject() {
        this.$router.push({ name: `project${this.currentStage}` });
      },
      enterListAnimation() {
        this.$store.commit(SWITCH_LIST_ACTIVE, true);
        TweenMax.killTweensOf(this.$refs.list);
        
        const timeline = new TimelineMax();
        
        timeline
          .set(this.$refs.list, {
            y: 0
          })
          .staggerFromTo(
            this.$refs.titles[this.currentStage - 1].querySelectorAll(
              ".home__title-letter-container"
            ),
            1.8,
            {
              x: 0,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1
            },
            {
              x: -1 * this.stageTransitionDirection * 40,
              y: -1 * this.stageTransitionDirection * 80,
              rotationX: 80,
              rotationY: this.stageTransitionDirection * -120,
              scale: 0,
              ease: ease
            },
            0.01
          )
          .fromTo(
            this.$refs.action1,
            0.8,
            {
              y: "0%"
            },
            {
              y: `${-100 * this.stageTransitionDirection}%`,
              ease: ease,
              onComplete: () => {
                TweenMax.set(this.$refs.action1, {
                  y: `${-100 * this.stageTransitionDirection * -1}%`
                });
              }
            },
            "-=1.8"
          )
          .fromTo(
            this.$refs.action2,
            0.8,
            {
              y: "0%"
            },
            {
              y: `${-100 * this.stageTransitionDirection}%`,
              ease: ease,
              onComplete: () => {
                TweenMax.set(this.$refs.action2, {
                  y: `${-100 * this.stageTransitionDirection * -1}%`
                });
              }
            },
            "-=1.7"
          )
          .fromTo(
            this.$refs.actionPrev.$el,
            1.2,
            {
              y: "0%"
            },
            {
              y: "-100%",
              ease: ease
            },
            "-=1.8"
          )
          .fromTo(
            this.$refs.actionNext.$el,
            1.2,
            {
              y: "0%"
            },
            {
              y: "-100%",
              ease: ease
            },
            "-=1.7"
          )
          .staggerFromTo(
            this.$refs.list.querySelectorAll(".home__title-letter-container"),
            1.8,
            {
              x: this.stageTransitionDirection * 160,
              y: this.stageTransitionDirection * 80,
              rotationX: 80,
              rotationY: -1 * this.stageTransitionDirection * -120,
              scale: 0
            },
            {
              x: 0,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              delay: 0.3,
              ease: ease
            },
            0.01,
            "-=1.9"
          );
      },
      leaveListAnimation() {
        TweenMax.killTweensOf(
          document.querySelectorAll(".home__title-letter-container")
        );
        TweenMax.killTweensOf(this.$refs.list);
        TweenMax.killTweensOf(this.$refs.action1);
        TweenMax.killTweensOf(this.$refs.action2);
        TweenMax.killTweensOf(this.$refs.actionPrev.$el);
        TweenMax.killTweensOf(this.$refs.actionNext.$el);
        this.activeListElement = null;
        
        const timeline = new TimelineMax({
          onComplete: () => {
            this.$store.commit(SWITCH_LIST_ACTIVE, false);
            TweenMax.set(this.$refs.list, {
              y: 0
            });
          }
        });
        
        timeline
          .staggerTo(
            this.$refs.list.querySelectorAll(".home__title-letter-container"),
            1.8,
            {
              x: this.stageTransitionDirection * 160,
              y: -80,
              rotationX: 80,
              rotationY: -1 * this.stageTransitionDirection * -120,
              scale: 0,
              ease: ease
            },
            0.01
          )
          .to(
            this.$refs.list,
            1.8,
            {
              y: -300,
              ease: ease
            },
            "-=1.8"
          )
          .staggerTo(
            this.$refs.content.querySelectorAll(".home__title-letter-container"),
            1.8,
            {
              x: -1 * this.stageTransitionDirection * 40,
              y: -1 * this.stageTransitionDirection * 80,
              rotationX: 80,
              rotationY: this.stageTransitionDirection * -120,
              scale: 0,
              ease: ease
            },
            0.01,
            "-=1.8"
          )
          .staggerTo(
            this.$refs.titles[this.currentStage - 1].querySelectorAll(
              ".home__title-letter-container"
            ),
            1.8,
            {
              x: 0,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              ease: ease
            },
            0.01,
            "-=1.8"
          )
          .to(
            this.$refs.action1,
            0.8,
            {
              y: "0%",
              ease: ease
            },
            "-=1.2"
          )
          .to(
            this.$refs.action2,
            0.8,
            {
              y: "0%",
              ease: ease
            },
            "-=1.1"
          )
          .to(
            this.$refs.actionPrev.$el,
            1.2,
            {
              y: "0%",
              ease: ease
            },
            "-=1.2"
          )
          .to(
            this.$refs.actionNext.$el,
            1.2,
            {
              y: "0%",
              ease: ease
            },
            "-=1.1"
          );
      },
      enterAnimation(delay = 2.8) {
        setTimeout(() => {
          this.readyToAnimate = true;
        }, 300);
        
        const timeline = new TimelineMax();
        
        timeline
          .staggerFromTo(
            this.$refs.titles[this.currentStage - 1].querySelectorAll(
              ".home__title-letter-container"
            ),
            1.8,
            {
              x: this.stageTransitionDirection * 160,
              y: this.stageTransitionDirection * 80,
              rotationX: 80,
              rotationY: -1 * this.stageTransitionDirection * -120,
              scale: 0
            },
            {
              x: 0,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              delay: delay,
              ease: ease
            },
            0.01,
            "-=1.8"
          )
          .to(
            this.$refs.action1,
            0.8,
            {
              y: "0%",
              ease: ease
            },
            "-=1.2"
          )
          .to(
            this.$refs.action2,
            0.8,
            {
              y: "0%",
              ease: ease
            },
            "-=1.1"
          )
          .fromTo(
            this.$refs.actionPrev.$el,
            1.2,
            {
              y: "-100%"
            },
            {
              y: "0%",
              ease: ease
            },
            "-=1.2"
          )
          .fromTo(
            this.$refs.actionNext.$el,
            1.2,
            {
              y: "-100%"
            },
            {
              y: "0%",
              ease: ease
            },
            "-=1.15"
          );
      },
      switchProject() {
        const timeline = new TimelineMax();
        TweenMax.killTweensOf(
          this.$refs.content.querySelectorAll(".home__title-letter-container")
        );
        
        TweenMax.to(
          document.querySelectorAll(
            ".home__title:not(.home__title--previous):not(.home__title--current) .home__title-letter-container"
          ),
          {
            x: -1 * 40,
            y: -1 * 80,
            rotationX: 80,
            rotationY: -120,
            scale: 0
          }
        );
        
        const topTitleParts = [
          ...this.$refs.titles[this.currentStage - 1].querySelectorAll(
            ".home__title-line-1 .home__title-letter"
          )
        ];
        const bottomTitleParts = [
          ...this.$refs.titles[this.currentStage - 1].querySelectorAll(
            ".home__title-line-2 .home__title-letter"
          )
        ];
        
        timeline
          .staggerFromTo(
            this.$refs.titles[this.previousStage - 1].querySelectorAll(
              ".home__title-letter-container"
            ),
            1.8,
            {
              x: 0,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1
            },
            {
              x: -1 * this.stageTransitionDirection * 40,
              y: -1 * this.stageTransitionDirection * 80,
              rotationX: 80,
              rotationY: this.stageTransitionDirection * -120,
              scale: 0,
              ease: ease
            },
            0.01
          )
          .staggerFromTo(
            this.$refs.titles[this.currentStage - 1].querySelectorAll(
              ".home__title-letter-container"
            ),
            1.8,
            {
              x: this.stageTransitionDirection * 160,
              y: this.stageTransitionDirection * 80,
              rotationX: 80,
              rotationY: -1 * this.stageTransitionDirection * -120,
              scale: 0
            },
            {
              x: 0,
              y: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              ease: ease
            },
            0.01,
            "-=1.8"
          )
          .to(
            topTitleParts[2],
            0.14,
            {
              color: "#ef3f4a",
              yoyo: true,
              repeat: 1
            },
            "-=1.1"
          )
          .to(
            topTitleParts[0],
            0.14,
            {
              color: "#ef3f4a",
              yoyo: true,
              repeat: 1
            },
            "-=1.2"
          )
          .to(
            topTitleParts[3],
            0.14,
            {
              color: "#ef3f4a",
              yoyo: true,
              repeat: 1
            },
            "-=1.22"
          )
          .to(
            bottomTitleParts[1],
            0.14,
            {
              color: "#ef3f4a",
              yoyo: true,
              repeat: 1
            },
            "-=1.3"
          )
          .to(
            bottomTitleParts[4],
            0.14,
            {
              color: "#ef3f4a",
              yoyo: true,
              repeat: 1
            },
            "-=1.14"
          )
          .to(
            bottomTitleParts[2],
            0.14,
            {
              color: "#ef3f4a",
              yoyo: true,
              repeat: 1
            },
            "-=1.05"
          )
          .to(
            bottomTitleParts[1],
            0.14,
            {
              color: "#ef3f4a",
              yoyo: true,
              repeat: 1
            },
            "-=0.8"
          )
          .fromTo(
            this.$refs.action1,
            0.8,
            {
              y: "0%"
            },
            {
              y: `${-100 * this.stageTransitionDirection}%`,
              ease: ease,
              onComplete: () => {
                TweenMax.set(this.$refs.action1, {
                  y: `${-100 * this.stageTransitionDirection * -1}%`
                });
              }
            },
            "-=2"
          )
          .to(
            this.$refs.action1,
            0.8,
            {
              y: "0%",
              ease: ease
            },
            "-=1.2"
          )
          .fromTo(
            this.$refs.action2,
            0.8,
            {
              y: "0%"
            },
            {
              y: `${-100 * this.stageTransitionDirection}%`,
              ease: ease,
              onComplete: () => {
                TweenMax.set(this.$refs.action2, {
                  y: `${-100 * this.stageTransitionDirection * -1}%`
                });
              }
            },
            "-=1.9"
          )
          .to(
            this.$refs.action2,
            0.8,
            {
              y: "0%",
              ease: ease
            },
            "-=1.1"
          );
      },
      onNextProject() {
        this.$store.commit(SWITCH_STAGE_TRANSITION_DIRECTION, 1);
        this.$store.commit(SWITCH_NEXT_STAGE_CLICK);
      },
      onPreviousProject() {
        this.$store.commit(SWITCH_STAGE_TRANSITION_DIRECTION, -1);
        this.$store.commit(SWITCH_PREVIOUS_STAGE_CLICK);
      },
      onKeydown(event) {
        const key = event.keyCode;
        
        if (key === 39) {
          this.$store.commit(SWITCH_STAGE_TRANSITION_DIRECTION, 1);
          this.$store.commit(SWITCH_NEXT_STAGE_CLICK);
        } else if (key === 37) {
          this.$store.commit(SWITCH_STAGE_TRANSITION_DIRECTION, -1);
          this.$store.commit(SWITCH_PREVIOUS_STAGE_CLICK);
        }
      },
      onMouseWheel(event) {
        const check = this.lethargy.check(event);
        
        if (check !== false) {
          if (check === -1) {
            this.$store.commit(SWITCH_STAGE_TRANSITION_DIRECTION, 1);
            this.$store.commit(SWITCH_NEXT_STAGE_CLICK);
          } else {
            this.$store.commit(SWITCH_STAGE_TRANSITION_DIRECTION, -1);
            this.$store.commit(SWITCH_PREVIOUS_STAGE_CLICK);
          }
        }
      }
    }
  };
</script>


<!--<style lang="scss">-->
<!--  .home {-->
<!--    position: fixed;-->
<!--    top: 0;-->
<!--    right: 0;-->
<!--    bottom: 0;-->
<!--    left: 0;-->
<!--  }-->
<!--  -->
<!--  .home__actions {-->
<!--    position: absolute;-->
<!--    bottom: 80px;-->
<!--    left: 200px;-->
<!--    display: flex;-->
<!--    flex-direction: row;-->
<!--    align-items: center;-->
<!--    pointer-events: all;-->
<!--    overflow: hidden;-->
<!--    -->
<!--    @include responsive($sm) {-->
<!--      left: 20px;-->
<!--      bottom: 30px;-->
<!--      width: calc(100% - 60px);-->
<!--    }-->
<!--    -->
<!--    .action-button:first-child {-->
<!--      margin-right: 60px;-->
<!--      -->
<!--      @include responsive($sm) {-->
<!--        margin-right: 0px;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .home__content {-->
<!--    position: absolute;-->
<!--    left: 200px;-->
<!--    top: 50%;-->
<!--    transform: translateY(-50%);-->
<!--    z-index: 20;-->
<!--    pointer-events: none;-->
<!--    -->
<!--    @include responsive($sm) {-->
<!--      left: 30px;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .home__titles {-->
<!--    position: relative;-->
<!--    -->
<!--    .home__title:first-child {-->
<!--      position: relative;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .home__title {-->
<!--    position: absolute;-->
<!--    top: 0;-->
<!--    left: 0;-->
<!--    @include headingFont();-->
<!--    perspective: 800px;-->
<!--    perspective-origin: 50% 50%;-->
<!--    transform-style: preserve-3d;-->
<!--    user-select: none;-->
<!--  }-->
<!--  -->
<!--  .home__title-line {-->
<!--    display: block;-->
<!--    line-height: 1.2;-->
<!--  }-->
<!--  -->
<!--  .home__title-letter-container {-->
<!--    display: inline-block;-->
<!--    transform-style: preserve-3d;-->
<!--    transform: scale(0);-->
<!--  }-->
<!--  -->
<!--  .home__title-letter {-->
<!--    display: inline-block;-->
<!--    @include headingFont();-->
<!--    text-transform: uppercase;-->
<!--    font-size: 74px;-->
<!--    color: $black;-->
<!--    -->
<!--    @include responsive($sm) {-->
<!--      font-size: 44px;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .home__enter {-->
<!--    margin-top: 52px;-->
<!--    pointer-events: all;-->
<!--    -->
<!--    a {-->
<!--      text-decoration: none;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .home__enter-action {-->
<!--    display: inline-block;-->
<!--    overflow: hidden;-->
<!--    cursor: pointer;-->
<!--    -->
<!--    &:hover {-->
<!--      .home__enter-action-part {-->
<!--        .home__enter-action-letter:nth-child(odd) {-->
<!--          transform: translateY(-2px);-->
<!--        }-->
<!--        -->
<!--        .home__enter-action-letter:nth-child(even) {-->
<!--          transform: translateY(2px);-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    -->
<!--    .home__enter-action-part:first-child {-->
<!--      margin-right: 5px;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .home__enter-action-part {-->
<!--    display: inline-block;-->
<!--    transform: translateY(100%);-->
<!--  }-->
<!--  -->
<!--  .home__enter-action-letter {-->
<!--    display: inline-block;-->
<!--    @include mainFontBold();-->
<!--    color: $main-color;-->
<!--    text-transform: uppercase;-->
<!--    font-size: 18px;-->
<!--    transition: all 0.8s $easing;-->
<!--    -->
<!--    @include responsive($sm) {-->
<!--      font-size: 16px;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .home__list {-->
<!--    position: absolute;-->
<!--    left: 50%;-->
<!--    top: 50%;-->
<!--    transform: translateY(-50%);-->
<!--    z-index: 20;-->
<!--    pointer-events: none;-->
<!--    -->
<!--    .home__list-container {-->
<!--      .home__title:not(:last-child) {-->
<!--        margin-bottom: 140px;-->
<!--      }-->
<!--    }-->
<!--    -->
<!--    .home__title {-->
<!--      position: relative;-->
<!--      top: inherit;-->
<!--      left: inherit;-->
<!--      @include headingFont();-->
<!--      perspective: 800px;-->
<!--      perspective-origin: 50% 50%;-->
<!--      transform-style: preserve-3d;-->
<!--      -->
<!--      &&#45;&#45;active {-->
<!--        .home__title-letter {-->
<!--          color: $main-color;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    -->
<!--    .home__title-line {-->
<!--      display: block;-->
<!--      line-height: 1.2;-->
<!--    }-->
<!--    -->
<!--    .home__title-letter-container {-->
<!--      transform: scale(0);-->
<!--    }-->
<!--    -->
<!--    .home__title-letter {-->
<!--      display: inline-block;-->
<!--      @include headingFont();-->
<!--      text-transform: uppercase;-->
<!--      font-size: 74px;-->
<!--      color: $black;-->
<!--      transition: all 0.8s $easing;-->
<!--    }-->
<!--  }-->
<!--</style>-->

