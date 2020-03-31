<template>
  <div class="technology">
    <div class="table-wrapper">
      <div class="table" id="table">
        <el-table v-for="(label, index) in header" :key="index" :data="tableData[label]" :row-style="{height:'40px'}"
                  :cell-style="{height: '50px', padding:'0px', lineHeight: '20px'}"
                  style="font-size: 11px"
                  class="custom-table"
                  :class="{bl: index === 11 && device !== 'PC'}"
                  :header-cell-style="{background:'#0270FF',color:'#fff', fontSize: '14px', borderBottom: '3px solid rgba(240,240,240,1)'}"
                  :cell-class-name="getCellClassName(index)"
        >
          <el-table-column :key="index" align="center">
            <template slot="header">
              <p class="no-wrap" :title="label">{{ label }}</p>
            </template>
            <template slot-scope="scope" v-if="scope">
              <el-popover trigger="hover" placement="bottom">
                <div style="max-width: 400px;" v-html="scope.row.detail"></div>
                <div slot="reference">
                  <p>{{ scope.row.name }}</p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="time-wrapper" v-if="years && years.length > 0">
      <timeline :years="years" @select="timeChange" />
    </div>
  </div>
</template>

<script>
import timeline from '../../common/timeline'
import { getTtpTechByName, getTtpTechByHash } from '../../../api/detail'
import { Loading } from 'element-ui'

export default {
  name: 'technology',
  components: {
    timeline
  },
  props: {
    years: {
      type: Array,
      default: null
    },
    techniqueData: {
      type: Array,
      default: null
    },
    headerType: {
      type: String,
      default: 'default'
    },
    device: {
      type: String,
      default: 'PC'
    },
    queryType: {
      type: String,
      default: 'name'
    }
  },
  watch: {
    techniqueData: {
      handler (data) {
        this.handleData(data)
      },
      deep: true
    },
    years () {
      if (this.years && this.years.length === 0) { return }
      this.timeRange = [this.years[0], this.years[this.years.length - 1]]
    },
    timeRange: {
      handler (newTime) {
        if (newTime[0] <= newTime[1]) {
          if (this.timer) {
            clearTimeout(this.timer)
            this.endLoading()
          }
          this.startLoading()
          this.timer = setTimeout(() => {
            this.changeTable({ first: this.timeRange[0], second: this.timeRange[1], terminalType: this.device })
            this.endLoading()
          }, 200)
        }
      },
      deep: true
    }
  },
  data () {
    return {
      tableData: {},
      PC: ['初始接入', '执行', '维持', '权限提升', '防御规避', '凭据访问', '发现', '横向移动', '信息收集', '命令与控制', '信息渗漏', '影响'],
      header: [],
      mobile: ['初始接入', '维持', '权限提升', '防御规避', '凭据访问', '发现', '横向移动', '影响', '信息收集', '信息渗漏', '命令与控制', '网络影响', '远程服务影响'],
      active: 0,
      loading: null,
      timeRange: [-1, -1],
      detail: '',
      style: ''
    }
  },
  methods: {
    getCellClassName (colIndex) {
      return `_col-${colIndex % 2}`
    },
    handleData (tempData) {
      if (this.headerType === '移动') {
        this.header = this.mobile
      } else {
        this.header = this.PC
      }
      if (!tempData) {
        this.header.forEach((item) => {
          this.tableData[item] = []
        })
        return
      }
      this.header.forEach((item) => {
        if (this.tableData[item]) {
          const length = this.tableData[item].length
          this.tableData[item].splice(0, length)
        } else {
          this.tableData[item] = []
        }
      })
      tempData.forEach((item) => {
        item.children.forEach((child) => {
          this.tableData[item.name].push({
            name: child.name,
            detail: child.detail ? child.detail : '暂无详情'
          })
        })
      })
    },
    changeTable ({ first, second, terminalType }) {
      this.queryType === 'name'
        ? getTtpTechByName(this.$route.query.name, first, second, terminalType).then((res) => {
          this.handleData(res.data)
        }) : getTtpTechByHash(this.$route.query.hash, first, second).then((res) => {
          this.handleData(res.data)
        })
    },
    timeChange(timeRange) {
      this.timeRange = timeRange
    },
    startLoading () {
      this.loading = Loading.service({
        lock: true,
        target: '#table'
      })
    },
    endLoading () {
      this.loading && this.loading.close()
    }
  },
  computed: {
    height () {
      return window.innerHeight - 400
    }
  }
}
</script>

<style scoped lang="stylus">
  .technology
    position absolute
    left 0
    width 100%
    top 0
    height 100%
    box-sizing border-box
    background $color-background

    .table-wrapper
      position absolute
      height calc(100% - 70px)
      width 100%
      overflow-y auto
      padding 0 5px

      .table
        width 100%
        overflow-x hidden
        display flex

        .el-table
          margin-right 5px
          background transparent
          &.bl
            margin-left -2.5px
            padding-left 2.5px
            border-left 1px dashed #555

          &:last-child
            margin-right 0

    .time-wrapper
      position absolute
      bottom 30px
      width 70%
      margin-left 15%

      .time
        display flex
        margin-bottom 10px

        p
          font-size 14px

        .timeline
          flex 1

  .detail
    width 400px
    max-height 300px
    overflow-x hidden
    overflow-y auto
    line-height 28px
    font-size 14px
</style>
