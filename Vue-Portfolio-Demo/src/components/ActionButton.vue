<template>
  <button
    class="action-button"
    :class="{ 'action-button--reversed': reversed }"
    @click.prevent="onClick"
    role="button"
    :aria-label="text"
  >
    <span class="action-button__text">{{ text }}</span>
    
    <div class="action-button__shapes">
      <div class="action-button__rectangle"></div>
      
      <div class="action-button__arrow">
        <svg height="16" width="16">
          <polygon points="2,2 8,5.5 2,10"></polygon>
        </svg>
      </div>
      
      <div class="action-button__circles">
        <svg class="action-button__circle action-button__circle--base" height="64" width="64">
          <circle cx="32" cy="32" r="28"></circle>
        </svg>
        
        <svg class="action-button__circle action-button__circle--fill" height="64" width="64">
          <circle cx="32" cy="32" r="28"></circle>
        </svg>
      </div>
    </div>
  </button>
</template>

<script>
  export default {
    name: "ActionButton",
    props: {
      text: {
        type: String,
        required: true
      },
      reversed: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onClick() {
        this.$emit("onClick");
      }
    }
  };
</script>


<!--<style lang="scss">-->
<!--  .action-button {-->
<!--    -webkit-appearance: none;-->
<!--    border: none;-->
<!--    background: none;-->
<!--    display: flex;-->
<!--    flex-direction: row;-->
<!--    align-items: center;-->
<!--    cursor: pointer;-->
<!--    outline: none;-->
<!--    -->
<!--    &&#45;&#45;reversed {-->
<!--      flex-direction: row-reverse;-->
<!--      -->
<!--      .action-button__shapes {-->
<!--        transform: rotate(180deg);-->
<!--        -->
<!--        @include responsive($sm) {-->
<!--          transform: rotate(180deg) scale(0.6);-->
<!--        }-->
<!--      }-->
<!--      -->
<!--      .action-button__text {-->
<!--        margin-right: 0px;-->
<!--        margin-left: 38px;-->
<!--        -->
<!--        @include responsive($sm) {-->
<!--          margin-left: 16px;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  body:not(.is-touch) {-->
<!--    .action-button {-->
<!--      &:hover {-->
<!--        .action-button__circle&#45;&#45;base {-->
<!--          transform: rotate(-180deg);-->
<!--          -->
<!--          circle {-->
<!--            stroke-dashoffset: 10;-->
<!--          }-->
<!--        }-->
<!--        -->
<!--        .action-button__circle&#45;&#45;fill {-->
<!--          transform: rotate(-200deg);-->
<!--          -->
<!--          circle {-->
<!--            stroke-dashoffset: 10;-->
<!--          }-->
<!--        }-->
<!--        -->
<!--        .action-button__rectangle {-->
<!--          transform: translateY(-50%) scaleX(0);-->
<!--        }-->
<!--        -->
<!--        .action-button__arrow {-->
<!--          polygon {-->
<!--            fill: $main-color;-->
<!--          }-->
<!--        }-->
<!--        -->
<!--        .action-button__text {-->
<!--          transform: translateX(22px);-->
<!--        }-->
<!--      }-->
<!--      -->
<!--      &&#45;&#45;reversed {-->
<!--        &:hover {-->
<!--          .action-button__text {-->
<!--            transform: translateX(-22px);-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .action-button__text {-->
<!--    display: inline-block;-->
<!--    margin-right: 36px;-->
<!--    @include mainFontBold();-->
<!--    font-size: 18px;-->
<!--    transition: all 0.5s ease;-->
<!--    -->
<!--    @include responsive($sm) {-->
<!--      margin-right: 16px;-->
<!--      display: none;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .action-button__shapes {-->
<!--    position: relative;-->
<!--    width: 64px;-->
<!--    height: 64px;-->
<!--    -->
<!--    @include responsive($sm) {-->
<!--      transform: scale(0.6);-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .action-button__rectangle {-->
<!--    position: absolute;-->
<!--    top: 50%;-->
<!--    right: 32px;-->
<!--    transform: translateY(-50%) scaleX(1);-->
<!--    width: 50px;-->
<!--    height: 2px;-->
<!--    background-color: $grey;-->
<!--    transform-origin: right;-->
<!--    transition: all 0.5s ease;-->
<!--  }-->
<!--  -->
<!--  .action-button__arrow {-->
<!--    position: absolute;-->
<!--    top: 26px;-->
<!--    left: 27px;-->
<!--    -->
<!--    polygon {-->
<!--      fill: $grey;-->
<!--      transition: all 0.6s ease;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .action-button__circle {-->
<!--    position: absolute;-->
<!--    top: 0;-->
<!--    left: 0;-->
<!--    -->
<!--    &&#45;&#45;base {-->
<!--      transform: rotate(-154deg);-->
<!--      transition: all 0.6s ease;-->
<!--      opacity: 0.6;-->
<!--      -->
<!--      circle {-->
<!--        stroke-width: 2px;-->
<!--        stroke: $grey;-->
<!--        fill: none;-->
<!--        stroke-dasharray: 200;-->
<!--        stroke-dashoffset: 50;-->
<!--        transition: all 0.6s ease;-->
<!--      }-->
<!--    }-->
<!--    -->
<!--    &&#45;&#45;fill {-->
<!--      transition: all 0.6s ease;-->
<!--      -->
<!--      circle {-->
<!--        stroke-width: 2px;-->
<!--        stroke: $main-color;-->
<!--        fill: none;-->
<!--        stroke-dasharray: 200;-->
<!--        stroke-dashoffset: 200;-->
<!--        transition: all 0.6s ease;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</style>-->


