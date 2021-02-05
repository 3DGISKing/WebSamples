<template>
  <footer class="footer" :class="{ 'footer--light': light }">
    <div class="container">
      <div class="footer__divider"></div>

      <p class="footer__text">{{ footer.title }}</p>

      <ul class="footer__items">
        <li class="footer__item">
          <a
            :href="`mailto:${general.socials.email}`"
            target="_blank"
            class="footer__link action-element"
            data-x="-26"
            data-y="12"
            data-visible="1"
            title="Email"
            rel="noopener"
          >
            <span class="footer__link-text">Email</span>
            
            <svg class="footer__link-icon" viewBox="0 0 28 28" width="100%" height="100%">
              <path
                d="M25.7,0.8H4.5v3h17.6L1.2,24.6l2.1,2.1L24.2,5.9v17.6h3V2.3C27.2,1.5,26.5,0.8,25.7,0.8z"
              ></path>
            </svg>
          </a>
        </li>
        <li class="footer__item">
          <a
            :href="general.socials.twitter"
            target="_blank"
            class="footer__link action-element"
            data-x="-26"
            data-y="12"
            data-visible="1"
            title="Twitter"
            rel="noopener"
          >
            <span class="footer__link-text">Twitter</span>
            
            <svg class="footer__link-icon" viewBox="0 0 28 28" width="100%" height="100%">
              <path
                d="M25.7,0.8H4.5v3h17.6L1.2,24.6l2.1,2.1L24.2,5.9v17.6h3V2.3C27.2,1.5,26.5,0.8,25.7,0.8z"
              ></path>
            </svg>
          </a>
        </li>
        <li class="footer__item">
          <a
            :href="general.socials.linkedin"
            target="_blank"
            class="footer__link action-element"
            data-x="-26"
            data-y="12"
            data-visible="1"
            title="LinkedIn"
            rel="noopener"
          >
            <span class="footer__link-text">LinkedIn</span>
            
            <svg class="footer__link-icon" viewBox="0 0 28 28" width="100%" height="100%">
              <path
                d="M25.7,0.8H4.5v3h17.6L1.2,24.6l2.1,2.1L24.2,5.9v17.6h3V2.3C27.2,1.5,26.5,0.8,25.7,0.8z"
              ></path>
            </svg>
          </a>
        </li>
        <li class="footer__item">
          <a
            :href="general.socials.github"
            target="_blank"
            class="footer__link action-element"
            data-x="-26"
            data-y="12"
            data-visible="1"
            title="GitHub"
            rel="noopener"
          >
            <span class="footer__link-text">GitHub</span>
            
            <svg class="footer__link-icon" viewBox="0 0 28 28" width="100%" height="100%">
              <path
                d="M25.7,0.8H4.5v3h17.6L1.2,24.6l2.1,2.1L24.2,5.9v17.6h3V2.3C27.2,1.5,26.5,0.8,25.7,0.8z"
              ></path>
            </svg>
          </a>
        </li>
        <li class="footer__item">
          <a
            :href="general.socials.instagram"
            target="_blank"
            class="footer__link action-element"
            data-x="-26"
            data-y="12"
            data-visible="1"
            title="Instagram"
            rel="noopener"
          >
            <span class="footer__link-text">Instagram</span>
            
            <svg class="footer__link-icon" viewBox="0 0 28 28" width="100%" height="100%">
              <path
                d="M25.7,0.8H4.5v3h17.6L1.2,24.6l2.1,2.1L24.2,5.9v17.6h3V2.3C27.2,1.5,26.5,0.8,25.7,0.8z"
              ></path>
            </svg>
          </a>
        </li>
      </ul>

      <p class="footer__copyright">Copyright © {{ currentYear }} Grégoire Mielle</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "GlobalFooter",
  props: {
    light: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    footer() {
      return this.$store.state.content.footer;
    },
    general() {
      return this.$store.state.content.general;
    }
  }
};
</script>

<!--<style lang="scss" scoped>-->
<!--.footer {-->
<!--  padding: 40px 0px 80px 0px;-->

<!--  &&#45;&#45;light {-->
<!--    .footer__text {-->
<!--      color: $white;-->
<!--    }-->

<!--    .footer__link {-->
<!--      color: $white;-->
<!--    }-->

<!--    .footer__copyright {-->
<!--      color: $white;-->
<!--      opacity: 0.4;-->
<!--    }-->

<!--    .footer__link-icon {-->
<!--      path {-->
<!--        stroke: $white;-->
<!--        fill: $white;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.footer__divider {-->
<!--  width: 100%;-->
<!--  height: 1px;-->
<!--  background-color: $black;-->
<!--  opacity: 0.06;-->
<!--  margin-bottom: 140px;-->

<!--  @include responsive($md) {-->
<!--    margin-bottom: 80px;-->
<!--  }-->
<!--}-->

<!--.footer__text {-->
<!--  font-size: 60px;-->
<!--  max-width: 920px;-->
<!--  @include headingFont();-->
<!--  text-transform: uppercase;-->
<!--  color: $black;-->
<!--  line-height: 1.1;-->
<!--  margin-bottom: 80px;-->

<!--  @include responsive($md) {-->
<!--    font-size: 40px;-->
<!--  }-->
<!--}-->

<!--.footer__items {-->
<!--  display: flex;-->
<!--  flex-direction: row;-->
<!--  align-items: center;-->

<!--  @include responsive($md) {-->
<!--    flex-direction: column;-->
<!--    align-items: flex-start;-->
<!--  }-->

<!--  .footer__item:not(:last-child) {-->
<!--    margin-right: 44px;-->

<!--    @include responsive($md) {-->
<!--      margin-right: 0px;-->
<!--      margin-bottom: 10px;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.footer__link {-->
<!--  @include mainFontMedium();-->
<!--  color: $black;-->
<!--  font-size: 18px;-->
<!--  text-decoration: none;-->
<!--  transition: all 0.8s $easing;-->

<!--  &:hover {-->
<!--    color: $main-color;-->

<!--    .footer__link-icon {-->
<!--      path {-->
<!--        fill: $main-color;-->
<!--        stroke: $main-color;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.footer__link-text {-->
<!--  display: inline-block;-->
<!--  margin-right: 8px;-->
<!--}-->

<!--.footer__link-icon {-->
<!--  width: 10px;-->
<!--  height: auto;-->

<!--  path {-->
<!--    stroke-width: 2px;-->
<!--    stroke: $black;-->
<!--    transition: all 0.8s $easing;-->
<!--  }-->
<!--}-->

<!--.footer__copyright {-->
<!--  margin-top: 140px;-->
<!--  color: $grey;-->
<!--  @include mainFont();-->
<!--  font-size: 17px;-->

<!--  @include responsive($md) {-->
<!--    margin-top: 80px;-->
<!--  }-->
<!--}-->
<!--</style>-->


