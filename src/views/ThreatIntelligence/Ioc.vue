<template>
<div class="inspect-ioc">
  <p class="header">
    报告IOC汇总：{{ title }}
  </p>
  <div class="content">
    <detail-ioc :ioc-data="iocData" />
  </div>
</div>
</template>

<script>
import { getIocDirByHash, getInspectName } from '../../api/detail'
import DetailIoc from '../../components/Detail/Ioc'

export default {
  name: 'InspectIoc',
  components: { DetailIoc },
  data() {
    return {
      iocData: null,
      title: ''
    }
  },
  created () {
    getInspectName(this.$route.query.hash).then(res => {
      this.title = res.data.description
    })
    getIocDirByHash(this.$route.query.hash).then(res => {
      this.iocData = res.data
    })
  }
}
</script>

<style scoped lang="stylus">
.inspect-ioc
  width 100%
  height 100%
  .header
    line-height 60px
    padding 0 20px
  .content
    width 100%
    height calc(100% - 20px)
</style>
