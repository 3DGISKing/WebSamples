<template>
  <section class="project-section project-intro">
    <div class="container">
      <div class="project-intro__content">
        <h2 class="project-intro__title">{{ data.title }}</h2>
        <p class="project-intro__description">{{ data.description }}</p>

        <div class="project-intro__action">
          <a
            class="action-button action-element"
            :href="data.link"
            :title="data.linkTitle"
            target="_blank"
            data-x="-12"
            data-y="32"
            data-visible="0"
            rel="noopener"
          >
            <span class="action-button__text">{{ data.linkTitle }}</span>

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
          </a>
        </div>
      </div>
      <div class="project-intro__meta">
        <div class="project-intro__meta-section" v-for="(section, index) in data.meta" :key="index">
          <p class="project-intro__meta-title">{{ section.title }}</p>
          <ul class="project-intro__meta-list">
            <li
              class="project-intro__meta-item"
              v-for="(item, index2) in section.items"
              :key="index2"
            >{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ProjectIntroduction",
  props: ["data"]
};
</script>

<!--<style lang="scss" scoped>-->
<!--.project-intro {-->
<!--  padding: 120px 0px;-->
<!--  padding-top: 100px;-->

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

<!--.project-intro__content {-->
<!--  width: 65%;-->

<!--  @include responsive($md) {-->
<!--    width: 100%;-->
<!--  }-->
<!--}-->

<!--.project-intro__title {-->
<!--  @include headingFont();-->
<!--  text-transform: uppercase;-->
<!--  color: $black;-->
<!--  font-size: 48px;-->
<!--  max-width: 680px;-->
<!--  margin-bottom: 40px;-->
<!--  line-height: 1.1;-->

<!--  @include responsive($md) {-->
<!--    font-size: 36px;-->
<!--  }-->
<!--}-->

<!--.project-intro__description {-->
<!--  color: $grey;-->
<!--  font-size: 18px;-->
<!--  line-height: 1.5;-->
<!--  @include mainFont();-->
<!--  max-width: 620px;-->
<!--}-->

<!--.project-intro__meta {-->
<!--  width: 35%;-->
<!--  padding-left: 80px;-->

<!--  @include responsive($md) {-->
<!--    width: 100%;-->
<!--    padding-left: 0px;-->
<!--    padding-top: 40px;-->
<!--  }-->

<!--  .project-intro__meta-section:not(:last-child) {-->
<!--    margin-bottom: 20px;-->
<!--  }-->
<!--}-->

<!--.project-intro__meta-title {-->
<!--  font-size: 14px;-->
<!--  @include headingFont();-->
<!--  color: $black;-->
<!--  text-transform: uppercase;-->
<!--}-->

<!--.project-intro__meta-list {-->
<!--  margin-top: 12px;-->
<!--}-->

<!--.project-intro__meta-item {-->
<!--  line-height: 1.5;-->
<!--  @include mainFont();-->
<!--  color: $grey;-->
<!--}-->

<!--.project-intro__action {-->
<!--  display: inline-block;-->
<!--  margin-top: 40px;-->
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
<!--  color: $black;-->
<!--  text-decoration: none;-->

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


