<template>
  <p class="title">
    <span class="text">{{ title }}</span>
    <span class="bg" />
  </p>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus">
  .title
    line-height 30px
    font-size $font-size-medium
    display flex
    align-items center
    .text
      padding-right 10px
    .bg
      flex 1
      height 3px
      border-bottom: 2px dashed transparent;
      background: linear-gradient(white,white) padding-box,
        repeating-linear-gradient(-45deg,#ccc 0, #ccc 0.25em,white 0,white 0.75em);
</style>
