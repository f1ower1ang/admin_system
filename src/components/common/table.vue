<template>
<div class="table"></div>
</template>

<script>
export default {
  name: 'table',
  props: {
    header: {
      type: Array,
      default: null
    }
  }
}
</script>

<style scoped lang="stylus">
.table
  width 100%
</style>
