<template>
  <div class="flow-chart-wrapper mobile">
    <Title title="移动设备" />
    <div class="box top" v-if="strategies[0] && strategies[0].length === 11">
      <div class="d2">
        <div class="bg">
          <div class="div">
            <el-tooltip effect="dark" placement="bottom">
              <div slot="content" class="detail" style>
                {{ strategies[0][0].detail }}
              </div>
              <el-button>{{ strategies[0][0].name }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="d5">
        <div class="bg">
          <div class="div" v-for="(item, index) in strategies[0].slice(1, 7)" :key="index">
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
        <div class="bg" v-for="(item, index) in strategies[0].slice(7)" :key="index">
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
    </div>
    <Title title="移动网络" />
    <div class="box bottom" v-if="strategies[1] && strategies[1].length === 2">
      <div class="d2" v-for="(item, index) in strategies[1]" :key="index">
        <div class="bg">
          <div class="div">
            <el-tooltip effect="dark" placement="bottom">
              <div slot="content" class="detail" style>
                {{ item.detail }}
              </div>
              <el-button style="white-space: normal; padding: 0 10px; line-height: 15px">{{ item.name }}</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flowChartMixin from './flowChartMixin'
import Title from './title'

export default {
  name: 'mobile-chart',
  mixins: [flowChartMixin],
  data() {
    return {
      devices: ['移动设备', '移动网络']
    }
  },
  components: { Title }
}
</script>

<style scoped lang="stylus">
  .flow-chart-wrapper
    width 90%
    position absolute
    top 10px
    left 5%

    .box
      display flex
      align-items center
      width 85%
      &.top
        .d2
          flex 2
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
          background: url("../../../assets/images/circle.png") no-repeat;
          background-size: 96%
          background-position center
          position relative

          .div
            position absolute
            width: 18%;
            height: 17.9%;
            color #fff

            &:hover
              cursor pointer

            &:first-child
              top 41%
              transform translateY(-64%)
              left 8%
              background-color: #06C3D8

            &:nth-child(2)
              bottom: 22%;
              left: 9%;
              background-color: #34AAE7

            &:nth-child(3)
              bottom: 3%;
              left: 34%;
              background-color: #7C3FCB

            &:nth-child(4)
              bottom: 12%;
              right: 16%;
              background-color: #785FE8

            &:nth-child(5)
              bottom: 42%
              right 5%
              background-color: #EC6F77

            &:nth-child(6)
              top: 28%
              right: 7%
              background-color: #F2584E

            &:last-child
              top: 12%
              right 26%
              background-color: #005C80

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

      &.fade-enter-active, &.fade-leave-active
        transition all .3s

      &.fade-enter, &.fade-leave-to
        opacity 0
    .bottom
      display flex
      .d2
        width 17%
        margin-right: 30px;
        &:last-child
          .div
            background-color #ADB7C5
    .d2
      background-size 100%
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
          width: 43%;
          height: 70%;
          font-size: $font-size-small
          top 54%
          transform translateY(-57%)
          left 7%
          background-color: #016FFF
          color #fff

          &:hover
            cursor pointer

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
    display flex
    align-items center
    opacity .3
    .el-button
      font-size $font-size-small

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
    font-size $font-size-small
</style>
