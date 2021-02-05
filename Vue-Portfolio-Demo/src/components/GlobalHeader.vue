<template>
  <header class="global-header" :class="{ 'global-header--dark': light === false }">
    <div class="header__container">
<!--      <div class="header__logo">-->
<!--        <router-link-->
<!--          :to="{ name: 'home' }"-->
<!--          class="action-element"-->
<!--          title="Grégoire Mielle"-->
<!--          data-x="-26"-->
<!--          data-y="4"-->
<!--          data-visible="0"-->
<!--        >-->
<!--          <svg-->
<!--            width="86px"-->
<!--            height="21px"-->
<!--            viewBox="0 0 86 21"-->
<!--            version="1.1"-->
<!--            xmlns="http://www.w3.org/2000/svg"-->
<!--            xmlns:xlink="http://www.w3.org/1999/xlink"-->
<!--          >-->
<!--            <g id="Main" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">-->
<!--              <g id="Home" transform="translate(-131.000000, -56.000000)">-->
<!--                <g id="Group-3" transform="translate(130.000000, 43.000000)">-->
<!--                  <path-->
<!--                    d="M1.12,28.756 L4.116,27.972 C4.34,29.652 5.656,30.912 7.532,30.912 C10.108,30.912 11.396,29.596 11.396,26.824 L11.396,25.396 C10.808,26.46 9.436,27.384 7.448,27.384 C3.808,27.384 1.148,24.584 1.148,20.748 C1.148,17.108 3.696,14.112 7.448,14.112 C9.576,14.112 10.892,14.98 11.48,16.1 L11.48,14.364 L14.616,14.364 L14.616,26.712 C14.616,30.352 12.74,33.74 7.616,33.74 C4.004,33.74 1.484,31.5 1.12,28.756 Z M7.98,24.612 C10.052,24.612 11.48,23.1 11.48,20.748 C11.48,18.424 9.996,16.912 7.98,16.912 C5.908,16.912 4.424,18.424 4.424,20.748 C4.424,23.128 5.852,24.612 7.98,24.612 Z M25.072,14.28 L25.072,17.584 C24.708,17.528 24.344,17.5 24.008,17.5 C21.488,17.5 20.34,18.956 20.34,21.504 L20.34,28 L17.092,28 L17.092,14.364 L20.256,14.364 L20.256,16.548 C20.9,15.064 22.412,14.196 24.204,14.196 C24.596,14.196 24.932,14.252 25.072,14.28 Z M28.416,19.684 L35.108,19.684 C35.052,18.088 33.988,16.66 31.748,16.66 C29.704,16.66 28.528,18.228 28.416,19.684 Z M35.472,23.24 L38.216,24.108 C37.488,26.488 35.332,28.42 32.056,28.42 C28.36,28.42 25.084,25.732 25.084,21.112 C25.084,16.8 28.276,13.944 31.72,13.944 C35.92,13.944 38.384,16.716 38.384,21.028 C38.384,21.56 38.328,22.008 38.3,22.064 L28.332,22.064 C28.416,24.136 30.04,25.62 32.056,25.62 C34.016,25.62 35.024,24.584 35.472,23.24 Z M42.26,19.684 L48.952,19.684 C48.896,18.088 47.832,16.66 45.592,16.66 C43.548,16.66 42.372,18.228 42.26,19.684 Z M49.316,23.24 L52.06,24.108 C51.332,26.488 49.176,28.42 45.9,28.42 C42.204,28.42 38.928,25.732 38.928,21.112 C38.928,16.8 42.12,13.944 45.564,13.944 C49.764,13.944 52.228,16.716 52.228,21.028 C52.228,21.56 52.172,22.008 52.144,22.064 L42.176,22.064 C42.26,24.136 43.884,25.62 45.9,25.62 C47.86,25.62 48.868,24.584 49.316,23.24 Z M56.104,19.684 L62.796,19.684 C62.74,18.088 61.676,16.66 59.436,16.66 C57.392,16.66 56.216,18.228 56.104,19.684 Z M63.16,23.24 L65.904,24.108 C65.176,26.488 63.02,28.42 59.744,28.42 C56.048,28.42 52.772,25.732 52.772,21.112 C52.772,16.8 55.964,13.944 59.408,13.944 C63.608,13.944 66.072,16.716 66.072,21.028 C66.072,21.56 66.016,22.008 65.988,22.064 L56.02,22.064 C56.104,24.136 57.728,25.62 59.744,25.62 C61.704,25.62 62.712,24.584 63.16,23.24 Z M66.7,28.756 L69.696,27.972 C69.92,29.652 71.236,30.912 73.112,30.912 C75.688,30.912 76.976,29.596 76.976,26.824 L76.976,25.396 C76.388,26.46 75.016,27.384 73.028,27.384 C69.388,27.384 66.728,24.584 66.728,20.748 C66.728,17.108 69.276,14.112 73.028,14.112 C75.156,14.112 76.472,14.98 77.06,16.1 L77.06,14.364 L80.196,14.364 L80.196,26.712 C80.196,30.352 78.32,33.74 73.196,33.74 C69.584,33.74 67.064,31.5 66.7,28.756 Z M73.56,24.612 C75.632,24.612 77.06,23.1 77.06,20.748 C77.06,18.424 75.576,16.912 73.56,16.912 C71.488,16.912 70.004,18.424 70.004,20.748 C70.004,23.128 71.432,24.612 73.56,24.612 Z M82.448,25.9 C82.448,24.64 83.456,23.604 84.716,23.604 C85.976,23.604 87.012,24.64 87.012,25.9 C87.012,27.16 85.976,28.168 84.716,28.168 C83.456,28.168 82.448,27.16 82.448,25.9 Z"-->
<!--                    id="cta"-->
<!--                    fill="#0F0F0F"-->
<!--                  ></path>-->
<!--                  <rect id="Rectangle" fill="#000000" x="33" y="20" width="29" height="2"></rect>-->
<!--                </g>-->
<!--              </g>-->
<!--            </g>-->
<!--          </svg>-->
<!--        </router-link>-->
<!--      </div>-->

      <div class="header__content">
        <nav class="header__nav">
          <ul class="header__nav-list">
            <li class="header__nav-item action-element" data-x="-10" data-y="8" data-visible="1">
              <router-link :to="{ name: 'home' }" title="All projects">Home</router-link>
            </li>
            
            <li class="header__nav-item action-element" data-x="-10" data-y="8" data-visible="1">
              <router-link :to="{ name: 'home' }" title="All projects">All projects.</router-link>
            </li>

            <li class="header__nav-item action-element" data-x="-10" data-y="8" data-visible="1">
              <router-link :to="{ name: 'about' }" title="About me">About me.</router-link>
            </li>
          </ul>
        </nav>

        <ul class="header__socials">
          <li class="header__socials-item">
            <a
              :href="general.socials.twitter"
              target="_blank"
              class="header__socials-link action-element"
              data-x="-6"
              data-y="30"
              data-visible="1"
              title="Twitter"
              rel="noopener"
            >Tw</a>
          </li>
          <li class="header__socials-item">
            <a
              :href="general.socials.linkedin"
              target="_blank"
              class="header__socials-link action-element"
              data-x="-6"
              data-y="30"
              data-visible="1"
              title="LinkedIn"
              rel="noopener"
            >Lk</a>
          </li>
          <li class="header__socials-item">
            <a
              :href="general.socials.github"
              target="_blank"
              class="header__socials-link action-element"
              data-x="-6"
              data-y="30"
              data-visible="1"
              title="GitHub"
              rel="noopener"
            >Gh</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="lateral__text lateral__text--left">
      <span>{{ general.bars.left }}</span>
    </div>

    <div class="lateral__text lateral__text--right">
      <span>{{ general.bars.right }}</span>
    </div>
  </header>
</template>

<script>
export default {
  name: "GlobalHeader",
  data() {
    return {
      light: true
    };
  },
  computed: {
    general() {
      return this.$store.state.content.general;
    }
  },
  watch: {
    $route() {
      if (this.$route.name === "about") {
        this.light = false;
      } else {
        this.light = true;
      }
    }
  },
  mounted() {
    if (this.$route.name === "about") {
      this.light = false;
    }
  }
};
</script>

<!--<style lang="scss" scoped>-->
<!--.global-header {-->
<!--  &&#45;&#45;dark {-->
<!--    .header__logo {-->
<!--      path,-->
<!--      rect {-->
<!--        fill: #fff;-->
<!--      }-->
<!--    }-->

<!--    .header__nav-item {-->
<!--      a {-->
<!--        color: #fff;-->
<!--      }-->
<!--    }-->

<!--    .header__socials-link {-->
<!--      color: #fff;-->
<!--    }-->

<!--    .lateral__text span {-->
<!--      color: #fff;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.header__container {-->
<!--  position: fixed;-->
<!--  top: 70px;-->
<!--  left: 100px;-->
<!--  right: 100px;-->
<!--  z-index: 32;-->
<!--  width: calc(100% - 200px);-->
<!--  max-width: 1400px;-->
<!--  margin: 0 auto;-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->

<!--  @include responsive($sm) {-->
<!--    width: calc(100% - 60px);-->
<!--    left: 30px;-->
<!--    right: 30px;-->
<!--    top: 30px;-->
<!--  }-->
<!--}-->

<!--.header__logo {-->
<!--  transform: scale(0.9) translateY(4px);-->
<!--  transform-origin: center;-->
<!--  padding-right: 100px;-->

<!--  @include responsive($sm) {-->
<!--    padding-right: 40px;-->
<!--  }-->

<!--  path,-->
<!--  rect {-->
<!--    transition: all 0.4s $easing;-->
<!--  }-->
<!--}-->

<!--.header__description {-->
<!--  @include mainFontMedium();-->
<!--  font-size: 16px;-->
<!--  color: $grey;-->
<!--}-->

<!--.header__content {-->
<!--  flex: 1;-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->

<!--  @include responsive($sm) {-->
<!--    justify-content: flex-end;-->
<!--  }-->
<!--}-->

<!--.header__nav-list {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  align-items: center;-->
<!--  pointer-events: all;-->

<!--  .header__nav-item:last-child {-->
<!--    a {-->
<!--      padding-right: 0px;-->
<!--    }-->

<!--    @include responsive($sm) {-->
<!--      margin-right: 28px;-->
<!--      display: none;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.header__nav-item {-->
<!--  font-size: 17px;-->

<!--  @include responsive($sm) {-->
<!--    font-size: 16px;-->
<!--  }-->

<!--  a {-->
<!--    text-decoration: none;-->
<!--    color: $black;-->
<!--    @include mainFontMedium();-->
<!--    padding: 20px;-->
<!--    transition: all 0.6s $easing;-->
<!--  }-->
<!--}-->

<!--body:not(.is-touch) {-->
<!--  .header__nav-item {-->
<!--    a {-->
<!--      &:hover {-->
<!--        color: $main-color;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.header__socials {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  align-items: center;-->
<!--  pointer-events: all;-->

<!--  @include responsive($sm) {-->
<!--    display: none;-->
<!--  }-->

<!--  .header__socials-item:last-child {-->
<!--    padding-right: 0px;-->
<!--  }-->
<!--}-->

<!--.header__socials-item {-->
<!--  font-size: 16px;-->
<!--}-->

<!--.header__socials-link {-->
<!--  text-decoration: none;-->
<!--  color: $black;-->
<!--  @include mainFontMedium();-->
<!--  padding: 20px 10px;-->
<!--  transition: all 0.6s $easing;-->
<!--}-->

<!--body:not(.is-touch) {-->
<!--  .header__socials-link {-->
<!--    &:hover {-->
<!--      color: $main-color;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.lateral__text {-->
<!--  position: fixed;-->
<!--  top: 50%;-->
<!--  z-index: 90;-->
<!--  user-select: none;-->

<!--  @include responsive($lg) {-->
<!--    display: none;-->
<!--  }-->

<!--  &&#45;&#45;left {-->
<!--    left: 50px;-->
<!--    writing-mode: vertical-rl;-->
<!--    transform: translateY(-50%) rotate(180deg);-->
<!--  }-->

<!--  &&#45;&#45;right {-->
<!--    right: 50px;-->
<!--    writing-mode: vertical-rl;-->
<!--    transform: translateY(-50%);-->
<!--  }-->

<!--  span {-->
<!--    @include headingFont();-->
<!--    text-transform: uppercase;-->
<!--    color: $black;-->
<!--    font-size: 13px;-->
<!--    transition: all 0.8s $easing;-->
<!--  }-->
<!--}-->
<!--</style>-->
