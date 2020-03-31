<template>
  <div class="process-page">
    <div class="left">
      <device @select="changeDevice" />
    </div>
    <div class="right">
      <div class="wrapper">
        <process :device="device" :process-data="dataList.data" :years="dataList.years" />
      </div>
    </div>
  </div>
</template>

<script>
import process from '../../../components/Detail/Ttp/process'
import device from '../../../components/Detail/Ttp/device'
import ttpMixin from './ttpMixin'

export default {
  name: 'ttp-process',
  components: { process, device },
  mixins: [ttpMixin]
}
</script>

<style scoped lang="stylus">
  .process-page
    height 100%
    width 100%
    position relative
    .left
      position absolute
      left 0
      top 0
      width 40px
      height 100%
      margin-right 20px
    .right
      position absolute
      left 60px
      right 20px
      height 100%
      top 0
      overflow hidden
      .wrapper
        position relative
        width 100%
        height 100%
        overflow scroll
        .right-0
          position: absolute;
          left 0
          right 20px
          height 100%
          top 0
        .right-1
          position: absolute;
          left 0
          right 20px
          height 100%
          top 100%
        .title
          width 90%
          margin 10px auto
        .process-wrapper
          position absolute
          width 100%
          top 30px
          bottom 0
</style>
