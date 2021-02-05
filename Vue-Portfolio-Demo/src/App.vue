<template>
  <div id="app">
    <global-canvas></global-canvas>
    <global-cursor></global-cursor>
    <global-transition></global-transition>
    <global-header></global-header>
    <router-view/>
  </div>
</template>

<script>
  import {LOAD_ASSETS, SWITCH_MOBILE} from '@/store/types'
  import GlobalCanvas from "@/components/GlobalCanvas";
  import GlobalHeader from "@/components/GlobalHeader";
  import GlobalCursor from "@/components/GlobalCursor";
  import GlobalTransition from "@/components/GlobalTransition";
  
  export default {
    name: 'App',
    components: {
      GlobalCanvas,
      GlobalCursor,
      GlobalTransition,
      GlobalHeader
    },
    mounted () {
      this.$store.dispatch(LOAD_ASSETS)
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
