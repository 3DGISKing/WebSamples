<template>
  <section class="project-section project-fullwidth" ref="section">
    <div class="project-fullwidth__container">
      <img class="project-fullwidth__source" :src="data.source" :alt="data.title" ref="picture">
    </div>
  </section>
</template>

<script>
export default {
  name: "ProjectFullwidthPicture",
  props: ["data"]
};
</script>

<!--<style lang="scss" scoped>-->
<!--.project-fullwidth {-->
<!--  width: 100%;-->
<!--  margin: 120px 0px;-->

<!--  @include responsive($sm) {-->
<!--    margin: 80px 0px;-->
<!--  }-->
<!--}-->

<!--.project-fullwidth__container {-->
<!--  width: 100%;-->
<!--}-->

<!--.project-fullwidth__source {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--}-->
<!--</style>-->


