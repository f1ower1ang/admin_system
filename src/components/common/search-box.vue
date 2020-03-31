<template>
  <div class="search-box no-radius">
    <el-input v-model="input" :placeholder="placeholder" size="medium" @blur="change"/>
    <el-button @click="search" icon="el-icon-search" type="primary" size="medium"/>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: '请输入关键字'
    },
    default: {
      type: String,
      default: ''
    }
  },
  watch: {
    default(cur) {
      this.input = cur
    }
  },
  created () {
    if (this.default) this.input = this.default
  },
  data () {
    return {
      input: this.default,
      showScreen: false
    }
  },
  methods: {
    search () {
      this.showScreen = true
      this.$emit('search', this.input)
    },
    change() {
      this.$emit('change', this.input)
    }
  }
}
</script>

<style scoped lang="stylus">
  .search-box
    width 100%
    display flex
    .el-input
      flex 1
      margin-right 10px
</style>
