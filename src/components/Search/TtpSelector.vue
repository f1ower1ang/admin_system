<template>
  <transition name="drop">
    <div class="ttp-selector" v-show="showFlag">
      <div class="wrapper">
        <div class="header">
          <span :class="{active: device === 'PC'}" @click="changeDevice('PC')">PC</span>
          <span :class="{active: device === 'mobile'}" @click="changeDevice('mobile')">移动</span>
        </div>
        <p class="title" :style="{opacity: device === 'PC' ? 0 : 1}">
          <span>移动设备</span>
          <span class="bg" />
          <span>移动网络</span>
        </p>
        <div class="table-wrapper">
          <div class="table custom-table">
            <el-table v-for="(label, index) in curData.header" :class="{bl: index === 11 && device !== 'PC'}" :key="index" :data="curData.tableData[label]" :row-style="{height:'40px'}"
                      :cell-style="{height: '50px', padding:'0px', lineHeight: '20px', color: '#000'}"
                      style="font-size: 11px"
                      :header-cell-style="{background:'#0270FF',color:'#fff', fontSize: '14px'}"
                      :cell-class-name="getCellClassName(index)"
            >
              <el-table-column :key="index" align="center"
              >
                <template slot="header">
                  <p class="no-wrap" :title="label">{{ label }}</p>
                </template>
                <template slot-scope="scope" v-if="scope.row[label]">
                  <checkbox :label="scope.row[label]" :name="label"></checkbox>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="option">
        <el-button @click="putOn" type="primary">提交筛选</el-button>
        <el-button @click="hidden" type="primary">关闭</el-button>
      </div>
    </div>
  </transition>
</template>

<script>
import checkbox from '../common/checkbox'
import { getTtpSelector } from '../../api/search'

export default {
  name: 'TtpSelector',
  components: {
    checkbox
  },
  data () {
    return {
      curData: {
        header: [],
        tableData: {}
      },
      checkedList: [],
      result: {},
      showFlag: false,
      device: 'PC',
      PCData: {
        result: [],
        list: [{
          header: [],
          tableData: {}
        }]
      },
      mobileData: {
        result: [],
        list: [{
          header: [],
          tableData: {}
        }, {
          header: [],
          tableData: {}
        }] }
    }
  },
  computed: {
    height() {
      return window.innerHeight - 300
    }
  },
  async created () {
    const res = await getTtpSelector('PC')
    const PCData = this.handleData(res.data)
    this.PCData.result = PCData.result
    this.PCData.list[0] = PCData.obj
    this.curData = this.PCData.list[0]

    const mobile = await getTtpSelector('移动设备')
    const mobileData = this.handleData(mobile.data)
    this.mobileData.result = mobileData.result
    this.mobileData.list[0] = mobileData.obj

    const mobileNet = await getTtpSelector('移动网络')
    const netData = this.handleData(mobileNet.data)
    Object.assign(this.mobileData.result, netData.result)
    this.mobileData.list[1] = netData.obj
  },
  methods: {
    getCellClassName(index) {
      return '_col-' + index % 2
    },
    init() {
      Object.keys(this[this.device + 'Data']['result']).forEach((key) => {
        this[this.device + 'Data']['result'][key] = []
      })
    },
    putOn () {
      this.hidden()
      this.init()
      Object.keys(this[this.device + 'Data']['result']).forEach(k => {
        let obj = document.getElementsByName(k)
        for (let key in obj) {
          if (obj[key].checked) {
            this[this.device + 'Data']['result'][k].push(obj[key].value)
            obj[key].checked = false
          }
        }
      })
      console.log(this[this.device + 'Data']['result'])
      this.$emit('search', this[this.device + 'Data']['result'])
    },
    show () {
      this.showFlag = true
    },
    hidden () {
      this.showFlag = false
    },
    changeDevice(device) {
      this.curData = {
        header: [],
        tableData: {}
      }
      if (device === 'PC') {
        this.curData = this.PCData['list'][0]
      } else {
        Object.assign(this.curData.tableData, this.mobileData.list[0].tableData, this.mobileData.list[1].tableData)
        this.curData.header.push(...this.mobileData.list[0].header, ...this.mobileData.list[1].header)
      }
      this.device = device
    },
    handleData(data) {
      let obj = {
        header: [],
        tableData: {}
      }
      let result = {}
      data.forEach((item) => {
        obj.tableData[item.tacticsName] = []
        result[item.tacticsName] = []
        obj.header.push(item.tacticsName)
        item.techniquesList.forEach((tech) => {
          const cur = {}
          cur[item.tacticsName] = tech.name
          obj.tableData[item.tacticsName].push(cur)
        })
      })
      return { obj, result }
    }
  }
}
</script>

<style scoped lang="stylus">
  .ttp-selector
    position absolute
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background rgba(0, 0, 0, .5)

    .wrapper
      position relative
      width 95%
      margin 40px auto
      background $color-background
      height calc(100% - 200px)
      .header
        height 40px
        width 100%
        padding 0 20px
        background $color-theme

        span
          cursor: pointer;
          display inline-block
          padding 5px 20px
          margin-top 9px
          color #fff
          border-top-left-radius 2px
          border-top-right-radius 2px
          margin-right 10px
          font-size $font-size-medium
        .active
          background $color-background
          color $color-theme
      .title
        display flex
        height 20px
        width 100%
        align-items center
        padding 0 20px
        font-size 12px
        .bg
          flex 1
          border-bottom 1px dashed #aaa
          margin 0 5px
      .table-wrapper
        position absolute
        top 60px
        bottom 10px
        left 20px
        right 20px
        overflow-y auto
        .table
          width 100%
          overflow-x hidden
          margin 0 auto
          display flex
          .el-table
            margin-right 3px
            background $color-background
            &.bl
              margin-left -1.5px
              padding-left 1.5px
              border-left 1px dashed #555
            &:last-child
              margin-right 0
    .option
      width 100%
      text-align center

      .el-button
        margin 20px 0
        line-height 40px
        padding 0 10px
        margin-right 10px

    &.drop-enter-active, &.drop-leave-active
      transition all .4s

    &.drop-enter, &.drop-leave-to
      opacity 0
</style>
