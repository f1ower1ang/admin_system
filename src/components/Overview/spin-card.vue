<template>
  <div class="spin-card" @mouseenter="clearRotation" @mouseleave="rotation">
    <el-row :gutter="10">
      <el-col :span="12" v-for="(item, index) in currentCards.slice(0, 6)" :key="index">
        <p :class="{rotate: rotate}">
          {{ item.name }} : {{ item.value }}
        </p>
      </el-col>
      <el-col :span="12">
        <transition name="rotate">
          <p :class="{rotate: rotate}" v-show="currentCards.length === 7">
            <template v-if="currentCards.length === 7">
              {{ currentCards[6].name }} : {{ currentCards[6].value }}
            </template>
          </p>
        </transition>
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
        'APT', '技术点', '报告来源', '报告', 'IP', '域名', '漏洞', '邮箱', 'URL', '样本', '注册表', '文件名', '路径'
      ]
      let idx = 0
      for (let k in res.data) {
        this.cards.push({
          name: names[idx],
          value: res.data[k]
        })
        idx++
      }
      this.currentCards = this.cards.slice(0, 6)
      this.rotation()
    })
  },
  data() {
    return {
      cards: [],
      currentCards: [],
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
    height 100%
    border-radius 4px
    padding 0 10px
    overflow hidden
    .el-col
      text-align center
      margin 10px 0
      line-height 40px
      p
        padding 0 5px
        no-wrap()
        border-radius 8px
        font-size $font-size-medium
        color #fff
        background #169bd5
        transition all .4s
        transform scaleX(1)
        &.rotate
          transform scaleX(0)

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
