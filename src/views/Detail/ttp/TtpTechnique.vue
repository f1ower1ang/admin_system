<template>
<div class="technique-page">
  <div class="left">
    <device @select="changeDevice" />
  </div>
  <div class="right">
    <p class="title" :style="{opacity: device === 'PC' ? 0 : 1}">
      <span>移动设备</span>
      <span class="bg" />
      <span>移动网络</span>
    </p>
    <div class="wrapper">
      <technology :device="device" :technique-data="dataList.data" :years="dataList.years" :header-type="device" />
    </div>
  </div>
</div>
</template>

<script>
import technology from '../../../components/Detail/Ttp/technology'
import device from '../../../components/Detail/Ttp/device'
import ttpMixin from './ttpMixin'

export default {
  name: 'ttp-technique',
  mixins: [ttpMixin],
  components: { technology, device }
}
</script>

<style scoped lang="stylus">
  .technique-page
    height 100%
    width 100%
    position relative
    max-height 200%
    .left
      position absolute
      left 0
      top 0
      width 40px
      bottom 0
      margin-right 20px
    .right
      position absolute
      left 60px
      right 20px
      height 100%
      top 0
      overflow hidden
      .title
        display flex
        height 20px
        align-items center
        width 100%
        padding 0 20px
        font-size 12px
        .bg
          flex 1
          border-bottom 1px dashed #aaa
          margin 0 5px
      .wrapper
        position relative
        width 100%
        height calc(100% - 20px)
        overflow auto
        .technology-wrapper
          position absolute
          width 100%
          top 50px
          bottom 10px
</style>
