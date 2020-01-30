<template>
  <div class="technology">
    <div class="table-wrapper">
      <div class="table" id="table">
        <el-table v-for="(label, index) in header" :key="index" :data="tableData[label]" :row-style="{height:'40px'}"
                  :cell-style="{height: '50px', padding:'0px', lineHeight: '20px'}"
                  style="font-size: 11px"
                  :header-cell-style="{background:'rgb(143, 205, 100)',color:'#fff', fontSize: '14px'}"
                  :cell-class-name="getCellClassName(index)"
        >
          <el-table-column :key="index" :label="label" align="center">
            <template slot-scope="scope" v-if="scope">
              <el-popover trigger="hover" placement="bottom">
                <div style="max-width: 400px;">{{ scope.row.detail }}</div>
                <div slot="reference" style="color: #fff">
                  <p>{{ scope.row.name }}</p>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="time-wrapper">
      <div class="time">
        <p>起始时间：</p>
        <timeline :items="years" @select="firstTime"></timeline>
      </div>
      <div class="time">
        <p>结束时间：</p>
        <timeline :items="years" @select="secondTime" :active="active"></timeline>
      </div>
    </div>
  </div>
</template>

<script>
import timeline from '../../common/timeline'
import { getTtpTech } from '../../../api/detail'
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
      this.time.first = this.years[0]
      this.time.second = this.years[this.years.length - 1]
      this.active = this.years.length - 1
    },
    time: {
      handler (newTime) {
        if (newTime.first <= newTime.second) {
          setTimeout(() => {
            this.changeTable(this.time)
            this.endLoading()
          }, 1000)
        }
      },
      deep: true
    }
  },
  data () {
    return {
      tableData: {},
      header: ['初始接入', '执行', '维持', '权限提升', '防御规避', '凭据访问', '发现', '横向移动', '信息收集', '命令与控制', '信息渗漏', '影响'],
      active: 0,
      loading: null,
      time: {
        first: -1,
        second: -1
      },
      detail: '',
      style: ''
    }
  },
  methods: {
    getCellClassName (colIndex) {
      return `_col-${colIndex}`
    },
    handleData (tempData) {
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
    changeTable ({ first, second }) {
      getTtpTech(this.$route.query.name, first, second).then((res) => {
        this.handleData(res.data)
      })
    },
    firstTime (time) {
      if (this.time.first === time) {
        return
      }
      this.time.first = time
      if (this.time.second >= time) {
        this.startLoading()
      }
    },
    secondTime (time) {
      if (this.time.second === time) {
        return
      }
      this.time.second = time
      if (this.time.first <= time) {
        this.startLoading()
      }
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
    opacity 0
    padding-top 20px
    height 100%
    box-sizing border-box

    .table-wrapper
      position absolute
      top 20px
      height calc(100% - 140px)
      width 100%
      overflow-y auto

      .table
        width 100%
        overflow-x hidden
        background #fff
        display flex

        .el-table
          border-radius 3px
          margin-right 5px

          &:last-child
            margin-right 0

    .time-wrapper
      position absolute
      bottom 0
      width 100%

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
