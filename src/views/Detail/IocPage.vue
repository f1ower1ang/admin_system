<template>
  <div class="detail-ioc">
    <detail-ioc :ioc-data="iocData" />
  </div>
</template>

<script>
import { getIocDirByName } from '../../api/detail'
import DetailIoc from '../../components/Detail/Ioc'
export default {
  name: 'IocPage',
  components: { DetailIoc },
  data () {
    return {
      iocData: null
    }
  },
  created () {
    getIocDirByName(this.$route.query.name).then((res) => {
      this.iocData = res.data
    })
  }
}
</script>

<style scoped lang="stylus">
  .detail-ioc
    width 100%
    height 100%
</style>
