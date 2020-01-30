<template>
  <transition name="drop">
    <div class="ttp-selector" v-show="showFlag">
      <div class="wrapper" :style="{'height': `${height}px`}">
        <div class="table">
          <el-table v-for="(label, index) in header" :key="index" :data="tableData[label]" :row-style="{height:'40px'}"
                    :cell-style="{height: '50px', padding:'0px', lineHeight: '20px'}"
                    style="font-size: 11px"
                    :header-cell-style="{background:'rgb(143, 205, 163)',color:'#fff', fontSize: '14px'}"
                    :cell-class-name="getCellClassName"
          >
            <el-table-column :key="index" :label="label" align="center"
            >
              <template slot-scope="scope" v-if="scope.row[label]">
                <checkbox :label="scope.row[label]" :name="label"></checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="option" :style="{'top': `${height + 70}px`}">
        <el-button @click="putOn">提交筛选</el-button>
        <el-button @click="hidden">关闭</el-button>
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
      tableData: {},
      header: [],
      checkedList: [],
      result: {},
      showFlag: false
    }
  },
  computed: {
    height() {
      return window.innerHeight - 300
    }
  },
  created () {
    getTtpSelector().then((res) => {
      const data = res.data
      data.forEach((item) => {
        this.tableData[item.tacticsName] = []
        this.result[item.tacticsName] = []
        this.header.push(item.tacticsName)
        item.techniquesList.forEach((tech) => {
          const obj = {}
          obj[item.tacticsName] = tech.name
          this.tableData[item.tacticsName].push(obj)
        })
      })
    })
  },
  methods: {
    getCellClassName({ rowIndex }) {
      if (rowIndex >= 10) {
        return 'row-10'
      } else {
        return `row-${rowIndex}`
      }
    },
    init() {
      Object.keys(this.result).forEach((key) => {
        this.result[key] = []
      })
    },
    putOn () {
      this.hidden()
      this.init()
      Object.keys(this.result).forEach(k => {
        let obj = document.getElementsByName(k)
        for (let key in obj) {
          if (obj[key].checked) {
            this.result[k].push(obj[key].value)
            obj[key].checked = false
          }
        }
      })
      this.$emit('search', this.result)
    },
    show () {
      this.showFlag = true
    },
    hidden () {
      this.showFlag = false
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
    background rgba(0, 0, 0, .3)
    text-align center

    .wrapper
      position absolute
      top 60px
      width 100%
      overflow-y auto
      .table
        width 95%
        overflow-x hidden
        margin 0 auto
        background #fff
        display flex
        .el-table
          border-radius 3px
          margin-right 5px
          &:last-child
            margin-right 0
    .option
      position absolute
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
