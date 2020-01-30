<template>
  <div class="flow-chart-wrapper">
    <div class="box" v-if="strategy.length === 12">
      <div class="d2">
        <div class="bg">
          <div class="div" ref="div0">
            <el-tooltip effect="dark" placement="bottom">
              <div slot="content" class="detail" style>
                {{ strategy[0].detail }}
              </div>
              <el-button>{{ strategy[0].name }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="d5">
        <div class="bg">
          <div class="div" ref="div1" v-for="(item, index) in strategy.slice(1, 8)" :key="index">
            <el-tooltip effect="dark" placement="bottom">
              <div slot="content" class="detail" style>
                {{ item.detail }}
              </div>
              <el-button>{{ item.name }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="d2" id="d2_2">
        <div class="bg" v-for="(item, index) in strategy.slice(8, 11)" :key="index">
          <div class="div" ref="div8">
            <el-tooltip effect="dark" placement="bottom">
              <div slot="content" class="detail" style>
                {{ item.detail }}
              </div>
              <el-button>{{ item.name }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="d2" id="d2_3">
        <div class="bg">
          <div class="div" ref="div11">
            <el-tooltip effect="dark" placement="bottom">
              <div slot="content" class="detail" style>
                {{ strategy[11].detail }}
              </div>
              <el-button>{{ strategy[11].name }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStrategyDetail, getDefaultTtp } from '../../../api/detail'

export default {
  name: 'flow-chart',
  data () {
    return {
      flag: false,
      strategy: [],
      wordArr: []
    }
  },
  async created () {
    const { data: data1 } = await getStrategyDetail()
    this.strategy = data1.map((item) => {
      return {
        name: item.name,
        detail: item.detail
      }
    })
    const { data: data2 } = await getDefaultTtp(this.$route.query.name)
    data2.forEach((item) => {
      this.wordArr.push(item.name)
    })
    this.changeData()
  },
  mounted() {
    this.changeData()
  },
  watch: {
    wordArr () {
      this.changeData()
    }
  },
  methods: {
    changeData () {
      let div = document.querySelectorAll('.div')

      this.wordArr.forEach((item) => {
        for (let i = 0; i < div.length; i++) {
          if (item === div[i].innerText.trim()) {
            div[i].style.opacity = '0.9'
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .flow-chart-wrapper
    width 80%
    position absolute
    top 10px
    left 10%
    opacity 0

    .box
      display flex
      align-items center

      .d2
        background-size 100%
        flex 2
        display flex
        align-items center

        .bg
          background: url("../../../assets/images/bkg03.png") no-repeat;
          background-size 100%
          background-position center
          width 100%
          height 0
          padding-top 60%
          position relative

          &:nth-child(2)
            margin: 7px 0

          .div
            position absolute
            width: 35%;
            height: 60%;
            font-size: 14px;
            top 50%
            transform translateY(-57%)
            left 9px
            background-color: lightseagreen;

            &:hover
              cursor pointer

      .d5
        flex 5
        margin-left 20px
        text-align: center;
        padding-top 2%

        .bg
          width 98%
          overflow: hidden;
          height 0
          padding-top 100%
          background: url("../../../assets/images/dim2.png") no-repeat;
          background-size: 100%
          background-position center
          position relative

          .div
            position absolute
            width: 18%;
            height: 17.9%;

            &:hover
              cursor pointer

            &:first-child
              top 50%
              transform translateY(-64%)
              left 10%
              background-color: seagreen;

            &:nth-child(2)
              bottom: 14%
              left: 18%
              background-color: royalblue;

            &:nth-child(3)
              bottom 3%
              left 41%
              background-color: #336666

            &:nth-child(4)
              bottom: 10%;
              right: 17%;
              background-color: #339966

            &:nth-child(5)
              bottom: 31%
              right 4%
              background-color: #c94a44;

            &:nth-child(6)
              top: 26%
              right: 8%
              background-color: orangered;

            &:last-child
              top: 11%
              right 29%
              background-color: orange

      #d2_2
        flex-direction: column
        margin-left: 20px

      #d2_3
        margin-left: 20px

      .cancel
        position absolute
        display block
        border-radius 50%
        right -5px
        top -5px
        width 20px
        height 20px
        line-height 20px
        text-align center
        background #aaa
        cursor pointer

      .content
        padding 10px
        overflow-x hidden
        overflow-y auto
        width 100%
        font-size 14px
        max-height 300px
        line-height: 30px

      &.fade-enter-active, &.fade-leave-active
        transition all .3s

      &.fade-enter, &.fade-leave-to
        opacity 0

  .el-button
    background none
    border none
    padding 0
    color inherit
    width 100%
    border-radius 0

  .div
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid rgba(255, 254, 240, 0.3);
    box-shadow: 4px 4px 5px gray;
    font-size: 14px;
    display flex
    align-items center
    opacity .3

    p
      text-align center
      width 100%
  .clear
    opacity .9
  .detail
    width 400px
    max-height 300px
    overflow-x hidden
    overflow-y auto
    line-height 28px
    font-size 14px
</style>
