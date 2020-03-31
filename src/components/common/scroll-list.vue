<template>
  <div class="vueBox">
    <div class="marquee">
      <div class="marquee_box" ref="box" @mouseenter="clearScroll(-1)" @mouseleave="scroll" :class="{border: !border}">
        <div :class="type">
          <div class="marquee_list" :class="getClass(index)" v-for="(li, index) in dataList" :key="index">
            <ul ref="list">
              <li v-for="(item, idx) in li" :key="idx" @click="select(item)">
                <p>
                  {{ item.name }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '../../assets/js/dom'

export default {
  name: 'scroll-list',
  props: {
    list: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataList: [],
      timer: []
    }
  },
  mounted () {
    this.scroll()
  },
  watch: {
    list: {
      handler(newList) {
        this.clearScroll(-1)
        newList = JSON.parse(newList)
        this.dataList = []
        this.timer = []
        newList.forEach((item) => {
          this.timer.push(null)
          this.dataList.push(JSON.parse(item))
        })
        this.scroll()
      },
      deep: true
    }
  },
  methods: {
    getClass(index) {
      if (this.type === 'apt-name') {
        return `col-${index}`
      } else {
        return 'col-1'
      }
    },
    showMarquee(index) {
      addClass(this.$refs.list[index], 'marquee_top')
      setTimeout(() => {
        this.dataList[index].push(this.dataList[index][0])
        this.dataList[index].shift()
        removeClass(this.$refs.list[index], 'marquee_top')
      }, 1000)
    },
    scroll () {
      setTimeout(() => {
        if (!this.$refs.list || !this.$refs.list.length) {
          return
        }

        this.clearScroll(-1)

        const offsetHeight = this.$refs.box.offsetHeight
        for (let i = 0; i < this.$refs.list.length; i++) {
          if (this.dataList[i] && this.dataList[i].length * 30 + 5 * this.dataList[i].length + 10 > offsetHeight) {
            this.timer[i] = setInterval(() => {
              this.showMarquee(i)
            }, 2000)
          } else {
            this.clearScroll(i)
          }
        }
      }, 20)
    },
    clearScroll (i) {
      if (i === -1) {
        this.timer.forEach((item) => {
          if (item) {
            clearInterval(item)
          }
        })
        return
      }
      if (this.timer[i]) {
        clearInterval(this.timer[i])
      }
    },
    select(item) {
      this.$emit('select', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../assets/stylus/mixin.styl"
  @import "../../assets/stylus/variable.styl"
  .vueBox
    width 100%
    height 100%
    color #eee

    .marquee
      width: 100%;
      height: 100%
      box-sizing: border-box;

      .marquee_box
        padding 0 10px
        box-sizing border-box
        position: relative;
        width: 100%
        height: 100%
        overflow: hidden;

        .marquee_list
          height: 100%;
          overflow: hidden

          .marquee_top
            transition all .4s
            margin-top: -35px

          li
            height: 30px;
            line-height: 30px;
            width 100%
            font-size: 14px;
            overflow hidden
            margin 5px 0
            padding 0 5px
            no-wrap()

            p
              no-wrap()

  .apt-name
    width 100%
    display flex
    no-wrap()

    .col-0
      width 60px
      margin-right 10px
      font-size $font-size-small
      no-wrap()
      cursor pointer

      li
        background $color-theme
        text-align center
    .col-1
      flex 1
      font-size $font-size-small
      no-wrap()

    .col-2
      width 82px
      font-size $font-size-small
      no-wrap()

      li
        padding 0 5px

  .apt-detail
    display flex
    overflow hidden
    width 100%
    height 100%

    .col-1
      padding 10px 0
      no-wrap()
      margin-right 10px
      flex 1
      font-size $font-size-medium-x
      border-right: 1px solid rgba(46,46,86,1);
      &:last-child
        margin-right 0
        border-right: none;
</style>
