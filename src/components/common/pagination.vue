<template>
<div class="pagination-wrapper">
  <div class="content">
    <slot></slot>
  </div>
  <el-pagination
    :page-size="pageSize"
    :pager-count="11"
    layout="prev, pager, next, jumper"
    :total="total"
    background
    @current-change="changeData"
    :current-page="page"
    :hide-on-single-page="true"
  >
  </el-pagination>
</div>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    pageSize: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      loading: true
    }
  },
  methods: {
    changeData(val) {
      this.$emit('updateData', val)
    }
  }
}
</script>

<style scoped lang="stylus">
.pagination-wrapper
  .el-pagination
    text-align right
    padding 15px 5px
</style>
