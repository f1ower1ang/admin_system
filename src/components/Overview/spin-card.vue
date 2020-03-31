<template>
  <div class="spin-card" @mouseenter="clearRotation" @mouseleave="rotation">
    <el-row :gutter="4">
      <el-col :span="8" v-for="(item, index) in cards" :key="index">
        <div :class="{rotate: rotate}" class="wrapper">
          <div>
            <p class="title">{{ item.name }}</p>
            <p class="value" :class="getClass(item.value)">{{ item.value }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getStatistics } from '../../api/overview'

export default {
  name: 'spin-card',
  created () {
    getStatistics().then((res) => {
      let names = [
        'APT', '报告来源', '报告', 'IP', '域名', '漏洞', '邮箱', 'URL', '样本', '注册表', '文件名', '路径'
      ]
      let idx = 0
      for (let k in res.data) {
        if (k === 'techCount') continue
        this.cards.push({
          name: names[idx],
          value: res.data[k]
        })
        idx++
      }
      this.rotation()
    })
  },
  data() {
    return {
      cards: [],
      rotate: false,
      index: 6
    }
  },
  methods: {
    showMarquee() {
      this.rotate = true
      setTimeout(() => {
        if (this.index === 6) {
          this.currentCards = this.cards.slice(this.index)
          this.index = 0
        } else {
          this.currentCards = this.cards.slice(0, 6)
          this.index = 6
        }
        this.rotate = false
      }, 800)
    },
    getClass(value) {
      if (value === 0) {
        return 'white'
      } else if (value < 1000) {
        return 'origin'
      } else {
        return 'red'
      }
    },
    rotation() {
      this.timer = setInterval(this.showMarquee, 5000)
    },
    clearRotation() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  @import "../../assets/stylus/mixin.styl"
  .spin-card
    width 100%
    height calc(100% - 34px)
    border-radius 4px
    padding 0 10px
    overflow hidden
    .el-row
      padding 10px 0
      width 100%
      height 100%
      .el-col
        box-sizing border-box
        text-align center
        padding 2px 0
        height 25%
        .wrapper
          height 100%
          border 1px solid rgba(46,46,86,1)
          padding 0 5px
          no-wrap()
          font-size $font-size-medium
          color #fff
          transition all .4s
          transform scaleX(1)
          position relative
          display flex
          align-items center
          justify-content center
          div
            .title
              font-size $font-size-small
              color #eee
            .value
              font-size $font-size-large
          &.rotate
            transform scaleX(0)
          .white
            color #eee
          .origin
            color #DC5F37
          .red
            color #F42A2A

  .rotate-enter-active
    animation bounce-in .4s
  @keyframes bounce-in {
    0% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }

</style>
