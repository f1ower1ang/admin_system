<template>
<el-card class="card" shadow="hover" @click.native="select(item)">
  <div class="top">
    <p class="title" v-html="item.title">
    </p>
    <el-image v-for="(logo, index) in item.logo" :src="logo" :key="index" style="width: 50px;height: 29px">
      <div slot="error">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>
  <div class="content">
    <el-image :src="item.imgUrl" style="height: 100px; width: 180px" alt="">
    </el-image>
    <div class="state">
      <div class="description" v-html="item.description"></div>
      <p class="date">{{ item.date }}</p>
    </div>
  </div>
</el-card>
</template>

<script>
export default {
  name: 'result-card',
  props: {
    item: {
      type: Object,
      default: null
    },
    locate: {
      type: String,
      default: 'true'
    }
  },
  methods: {
    select(item) {
      this.$emit('select', item)
      if (this.locate === 'true') {
        this.$router.push(`/detail?name=${item.name}`)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
.card
  margin 20px 0
  .top
    display flex
    align-items center
    .title
      font-size $font-size-large
      line-height 30px
      padding-right 20px
  .content
    margin-top 10px
    height 100px
    display flex
    .state
      flex 1
      padding-left 20px
      display flex
      flex-direction column
      .description
        flex 1
        line-height 20px
        font-size $font-size-medium
        height 100%
        overflow hidden
        position relative
        &:after
          content ''
          position absolute
          left 0
          width 100%
          bottom 0
          height 5px
          background linear-gradient(rgba(255, 255, 255, .5), #fff);
      .date
        line-height 20px
        font-size $font-size-small
        text-align right
        color $color-text-d
</style>
