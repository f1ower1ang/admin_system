<template>
  <div class="report-list">
    <div class="search-wrapper">
      <search-box :default="input" @search="search"/>
    </div>
    <el-collapse-transition>
      <div class="options" v-show="flag" ref="options">
        <div class="item" ref="list" :class="{wrap: open[0]}">
          <p class="title">按国家筛选：</p>
          <flag :item="item" v-for="(item, index) in getList(0)" :key="index" @click.native="changeActive(item, 0)"
                :active="item.name === country"/>
          <flag :item="countryMore" style="width: 60px; margin-right: 0;" v-show="countries.length > count" @click.native="toggleStatus(0)"/>
        </div>
        <div class="item" :class="{wrap: open[1]}">
          <p class="title">按厂商筛选：</p>
          <flag :item="item" v-for="(item, index) in getList(1)" :key="index" @click.native="changeActive(item, 1)"
                :active="item.name === source"/>
          <flag :item="sourceMore" style="width: 60px; margin-right: 0;" v-show="sources.length > count" @click.native="toggleStatus(1)"/>
        </div>
        <div class="item" :class="{wrap: open[2]}">
          <p class="title">按组织筛选：</p>
          <flag :item="item" v-for="(item, index) in getList(2)" :key="index" @click.native="changeActive(item, 2)"
                :active="item.name === apt"/>
          <flag :item="aptMore" style="width: 60px; margin-right: 0;" v-show="APTs.length > count" @click.native="toggleStatus(2)"/>
        </div>
        <div class="item">
          <p class="title">按时间筛选：</p>
          <flag :item="{name: '全部'}" @click.native="changeActive({name: '全部'}, 3)" :active="month === '全部'"/>
          <el-select style="width: 90px; margin-right: 10px" v-model="year" placeholder="年份" size="mini">
            <el-option
              v-for="year in years"
              :key="year"
              :label="year"
              :value="year"
            >
            </el-option>
          </el-select>
          <flag v-for="item in months" :item="item" style="width: 70px" @click.native="changeActive(item, 3)"
                :key="item.value" :active="month === item.value"/>
        </div>
      </div>
    </el-collapse-transition>
    <div class="sort-wrapper">
      <div class="left">
        <p class="item" @click="changeSort('default', null)">
          <span :class="{active: type.name === 'default'}">默认</span>
        </p>
        <p class="item" @click="changeSort('releaseDate', null)">
          <span :class="{active: type.name === 'releaseDate'}">发布时间</span>
          <span class="icon">
          <i class="el-icon-caret-top" :class="{active: pubTime === 1}"/>
          <i class="el-icon-caret-bottom" :class="{active: pubTime === 2}"/>
        </span>
        </p>
        <p class="item" @click="changeSort('_id', null)">
          <span :class="{active: type.name === '_id'}">录入时间</span>
          <span class="icon">
          <i class="el-icon-caret-top" :class="{active: enrolTime === 1}"/>
          <i class="el-icon-caret-bottom" :class="{active: enrolTime === 2}"/>
        </span>
        </p>
      </div>
      <div class="right">
        <flag :item="toggle" style="width: 60px" @click.native="collapse"/>
      </div>
    </div>
    <div class="result-wrapper" ref="result">
      <h2 class="title">共找到<span>{{total}}</span>条结果</h2>
      <div class="result-list" v-infinite-scroll="load">
        <result-card v-for="(item, index) in list" :item="item" :key="index" @search="filter"
                     locate="false" />
      </div>
    </div>
  </div>
</template>

<script>
import ResultCard from '../../components/Search/result-card'
import SearchBox from '../../components/common/search-box'
import flag from '../../components/common/flag'
import { searchReport } from '../../api/search'
import { getCompanyRank, getCountryCount, getAptRank } from '../../api/thread-info'
import ElementResizeDetectorMaker from 'element-resize-detector'

const ACTION = {
  0: null,
  1: 'asc',
  2: 'desc'
}

export default {
  name: 'ReportList',
  components: { ResultCard, SearchBox, flag },
  data () {
    return {
      page: 1,
      limit: 5,
      total: 0,
      list: [],
      input: '',
      status: 'default',
      countries: [{ name: '全部' }],
      curCountries: [],
      country: '全部',
      countryMore: {
        name: '更多',
        icon: 'el-icon-arrow-down'
      },
      sources: [{ name: '全部' }],
      curSources: [],
      source: '全部',
      sourceMore: {
        name: '更多',
        icon: 'el-icon-arrow-down'
      },
      APTs: [{ name: '全部' }],
      curAPTs: [],
      apt: '全部',
      aptMore: {
        name: '更多',
        icon: 'el-icon-arrow-down'
      },
      open: [false, false, false],
      params: '["全部", "全部", "全部", "全部"]',
      year: 2020,
      years: [],
      months: [],
      month: '全部',
      type: {
        name: 'default',
        action: ''
      },
      pubTime: 0,
      enrolTime: 0,
      filterCdn: {},
      flag: true,
      toggle: {
        name: '收起',
        icon: 'el-icon-arrow-up'
      },
      count: 11
    }
  },
  mounted () {
    this.count = Math.floor((this.$refs.list.offsetWidth - 60 - 96) / 100)
    const year = new Date().getFullYear()
    this.year = year
    for (let i = year - 9; i <= year; i++) {
      this.years.push(i)
    }
    for (let i = 1; i < 13; i++) {
      this.months.push({
        name: i + '月',
        value: i < 10 ? '0' + i : i
      })
    }
    let erd = new ElementResizeDetectorMaker()
    erd.listenTo(this.$refs.options, (element) => {
      const height = element.offsetHeight + 107
      this.$refs.result.style.height = `calc(100% - ${height}px)`
    })
  },
  created () {
    getCompanyRank(1000, 1, 'name asc').then((res) => {
      res.data.forEach((item) => {
        this.sources.push({
          name: item.source
        })
      })
      this.curSources = this.sources.slice(0, this.count)
    })
    getCountryCount(1000, 1, 'name asc').then((res) => {
      res.data.forEach((item) => {
        this.countries.push({
          name: item.country,
          flag: item.initiatorFlag
        })
      })
      this.curCountries = this.countries.slice(0, this.count)
    })
    getAptRank(1000, 1, 'name asc').then((res) => {
      res.data.forEach((item) => {
        this.APTs.push({
          name: item.apt
        })
      })
      this.curAPTs = this.APTs.slice(0, this.count)
    })
  },
  activated () {
    let params = JSON.parse(this.params)
    const { country, apt } = this.$route.query
    if (country) {
      params[0] = country
      this.country = params[0]
      this.params = JSON.stringify(params)
    } else if (apt) {
      params[2] = apt
      this.apt = params[2]
      this.params = JSON.stringify(params)
    } else {
      this.getReport()
    }
  },
  watch: {
    page (newPage, oldPage) {
      if (newPage <= oldPage) {
        return
      }
      this.getReport()
      if (this.list.length < this.total) {
      }
    },
    open: {
      handler () {
        this.countryMore = this.open[0]
          ? { name: '收起', icon: 'el-icon-arrow-up' }
          : { name: '更多', icon: 'el-icon-arrow-down' }
        this.sourceMore = this.open[1]
          ? { name: '收起', icon: 'el-icon-arrow-up' }
          : { name: '更多', icon: 'el-icon-arrow-down' }
        this.aptMore = this.open[2]
          ? { name: '收起', icon: 'el-icon-arrow-up' }
          : { name: '更多', icon: 'el-icon-arrow-down' }
      },
      deep: true
    },
    params: {
      handler (cur) {
        cur = JSON.parse(cur)
        if (cur[0] !== '全部') {
          this.filterCdn.country = cur[0]
        } else {
          this.filterCdn.country = ''
        }
        if (cur[1] !== '全部') {
          this.filterCdn.source = cur[1]
        } else {
          this.filterCdn.source = ''
        }
        if (cur[2] !== '全部') {
          this.filterCdn.apt = cur[2]
        } else {
          this.filterCdn.apt = ''
        }
        if (cur[3] !== '全部') {
          let year = this.year
          let month = Number(this.month) + 1
          if (month < 10) {
            month = '0' + month
          } else if (month === 13) {
            month = '01'
            year++
          }
          this.filterCdn.startDate = cur[3]
          this.filterCdn.endDate = `${year}-${month}-01`
        } else {
          this.filterCdn.startDate = ''
          this.filterCdn.endDate = ''
        }
        if (this.status === 'default') {
          this.search()
        }
      },
      deep: true
    },
    type: {
      handler (cur) {
        if (cur.action) {
          this.filterCdn.orderBy = `${cur.name} ${cur.action}`
        } else {
          this.filterCdn.orderBy = ''
        }
        this.search(this.input)
      },
      deep: true
    },
    year (cur) {
      if (this.month !== '全部') {
        this.filterCdn.startDate = `${cur}-${this._pad(this.month)}-01`
        let month = Number(this.month) + 1
        if (month < 10) {
          month = '0' + month
        } else if (month === 13) {
          month = '01'
          cur++
        }
        this.filterCdn.endDate = `${cur}-${month}-01`
        this.search()
      }
    }
  },
  methods: {
    _pad (num, n = 2) {
      while (num.toString().length < n) {
        num = '0' + num
      }
      return num
    },
    collapse () {
      this.flag = !this.flag
      if (this.flag) {
        this.toggle = {
          name: '收起',
          icon: 'el-icon-arrow-up'
        }
      } else {
        this.toggle = {
          name: '展开',
          icon: 'el-icon-arrow-down'
        }
      }
    },
    initData () {
      this.params = '["全部", "全部", "全部", "全部"]'
      this.country = this.apt = this.source = this.month = '全部'
      Object.assign(this.filterCdn, {
        country: '',
        source: '',
        apt: '',
        startDate: '',
        endDate: ''
      })
    },
    load () {
      if ((this.page) * this.limit < this.total) {
        this.page += 1
      }
    },
    getReport () {
      let keywords = this.status === 'search' ? this.input : ''
      searchReport(keywords, this.limit, this.page, this.filterCdn).then((res) => {
        this.list = this.list.concat(res.data.map((item) => {
          return {
            statement: item.statement,
            fileName: item.title,
            title: item.description,
            imgUrl: item.logo,
            url: item.fileUrl,
            date: item.date,
            item: {
              flag: item.countryFlag,
              name: item.country
            },
            apt: item.apt,
            hash: item.hashId
          }
        }))
        this.total = res.count
      })
    },
    goTo (item) {
      open(location.origin + item.url)
    },
    search (k) {
      if (k) {
        this.status = 'search'
        this.initData()
      }
      this.list = []
      this.page = 1
      this.total = 0
      this.input = k
      this.getReport()
    },
    changeActive (item, index) {
      this.status = 'default'
      let params = JSON.parse(this.params)
      if (index === 3) {
        params[3] = item.value ? `${this.year}-${item.value}-01` : item.name
      } else {
        params[index] = item.name
      }
      switch (index) {
        case 0:
          this.country = item.name
          break
        case 1:
          this.source = item.name
          break
        case 2:
          this.apt = item.name
          break
        case 3:
          this.month = item.value ? item.value : item.name
          break
      }
      this.params = JSON.stringify(params)
    },
    toggleStatus (status) {
      let cur = this.open[status]
      this.open = [false, false, false]
      this.open[status] = !cur
    },
    getList (index) {
      switch (index) {
        case 0:
          return this.open[0] ? this.countries : this.curCountries
        case 1:
          return this.open[1] ? this.sources : this.curSources
        case 2:
          return this.open[2] ? this.APTs : this.curAPTs
      }
    },
    changeSort (name, action) {
      if (name === 'releaseDate') {
        this.pubTime = (this.pubTime + 1) % 3
        action = ACTION[this.pubTime]
      } else if (name === '_id') {
        this.enrolTime = (this.enrolTime + 1) % 3
        action = ACTION[this.enrolTime]
      }
      this.type = {
        name, action
      }
    },
    filter(type, name) {
      this.status = 'default'
      let params = JSON.parse(this.params)
      if (type.indexOf('country') > -1) {
        params[0] = name
        this.country = name
      } else if (type.indexOf('apt') > -1) {
        params[2] = name
        this.apt = name
      }
      this.params = JSON.stringify(params)
    }
  }
}
</script>

<style scoped lang="stylus">
  .report-list
    width 100%
    height 100%
    position relative
    overflow hidden
    padding 20px 20px

    .search-wrapper
      width: 70%
      margin 0 auto

    .options
      width 100%
      padding-right: 20px;

      .item
        display flex
        flex-wrap wrap
        align-items flex-start
        margin-top 20px

        .title
          color $color-text

        .flag
          margin-right 10px
          margin-bottom 5px

    .sort-wrapper
      margin-top 20px
      line-height 30px
      height 30px
      margin-left -20px
      margin-right -20px
      padding 0 20px
      background $color-dialog-background
      display flex
      align-items center
      font-size $font-size-medium
      color $color-text-l

      .left
        flex 1
        display flex
        align-items center

        .item
          display flex
          transition all .3s
          cursor pointer
          margin-right 20px
          align-items center

          .icon
            display flex
            flex-direction column
            justify-content center

            .el-icon-caret-top
              margin-bottom -3px

            .el-icon-caret-bottom
              margin-top -3px

        .active
          color $color-theme

      .right
        padding-right 20px

    .result-wrapper
      position relative
      left 0
      padding 0 70px 0 20px
      width 100%

      .title
        line-height 40px
        font-size $font-size-large

        span
          color $color-theme

      .result-list
        position absolute
        bottom 0
        top 40px
        left 20px
        right 40px
        padding-right 30px
        overflow-y auto
        overflow-x hidden
</style>
