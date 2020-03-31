<template>
<div class="strategy-page">
  <div class="left">
    <device @select="changeDevice" />
  </div>
  <div class="right">
    <div class="wrapper">
      <pc-chart v-show="devices.length === 1" />
      <mobile-chart v-show="devices.length === 2" />
    </div>
  </div>
</div>
</template>

<script>
import pcChart from '../../../components/Detail/Ttp/pc-chart'
import mobileChart from '../../../components/Detail/Ttp/mobile-chart'
import device from '../../../components/Detail/Ttp/device'
export default {
  name: 'ttp-strategy',
  components: { pcChart, device, mobileChart },
  data() {
    return {
      devices: ['PC']
    }
  },
  methods: {
    changeDevice (device) {
      if (device === 'PC') this.devices = ['PC']
      else this.devices = ['移动设备', '移动网络']
    }
  }
}
</script>

<style scoped lang="stylus">
.strategy-page
  height 100%
  width 100%
  position relative
  overflow: hidden;
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
    overflow auto
    top 0
    .wrapper
      position relative
      width 100%
      height 100%
</style>
