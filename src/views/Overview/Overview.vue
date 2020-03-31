<template>
  <div class="overview">
    <el-row style="height: 100%; width: 100%">
      <el-col :span="6" class="left">
        <el-row class="background">
          <p class="_title">敌情速览</p>
          <div style="width: 100%; height: calc(100% - 36px); padding: 10px 0 20px 0; overflow: hidden">
            <scroll-list :list="apts" type="apt-name" @select="goTo"></scroll-list>
          </div>
        </el-row>
        <el-row class="background">
          <p class="_title">数据速览</p>
          <spin-card></spin-card>
        </el-row>
      </el-col>
      <el-col :span="18" class="right">
        <el-row class="background top">
          <p class="_title">重点敌情监控</p>
          <el-col :span="14" class="background" style="border-right: 1px solid rgba(46,46,86,1)">
            <div class="border" ref="map" @mouseenter="clearPlay" @mouseleave="autoPlay">
              <p class="describe">地缘关系</p>
              <word-map :country="currentCountry" :pure="pure"></word-map>
              <div class="tooltip" v-if="currentCountry" ref="tooltip">
                <p>{{ currentCountry.name }}</p>
                <img :src="currentCountry.flag" alt="">
              </div>
            </div>
          </el-col>
          <el-col :span="10" class="background">
            <div class="border">
              <p class="describe">动态行为特征</p>
              <process :process-data="processData" :pure="pure"></process>
            </div>
          </el-col>
        </el-row>
        <el-row class="background bottom">
          <p class="_title">静态资源特征</p>
          <div class="title">
            <el-select v-model="value1" placeholder="请选择" class="custom-select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
            <el-select v-model="value2" placeholder="请选择" class="custom-select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
            <el-select v-model="value3" placeholder="请选择" class="custom-select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
            <el-select v-model="value4" placeholder="请选择" class="custom-select" style="margin-right: 0">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </div>
          <div class="list">
            <scroll-list :list="aptDetail" type="apt-detail" border></scroll-list>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ScrollList from '../../components/common/scroll-list'
import SpinCard from '../../components/Overview/spin-card'
import { getApts, getMaps, getProcess, getListData } from '../../api/overview'
import WordMap from '../../components/Detail/map/WordMap'
import process from '../../components/Detail/Ttp/process'

export default {
  name: 'Overview',
  components: { ScrollList, SpinCard, WordMap, process },
  data () {
    return {
      aptName: '',
      aptDetail: '',
      maps: [],
      currentCountry: null,
      pure: true,
      processData: [],
      currentIndex: 0,
      apts: '',
      options: [
        {
          value: 'ip',
          label: 'IP信息'
        }, {
          value: 'domain',
          label: '域名信息'
        }, {
          value: 'cve',
          label: '漏洞信息'
        }, {
          value: 'fileName',
          label: '文件信息'
        }, {
          value: 'email',
          label: '邮箱信息'
        }, {
          value: 'filePath',
          label: '文件路径信息'
        }, {
          value: 'registry',
          label: '注册表信息'
        }, {
          value: 'sample',
          label: '样本列表信息'
        }, {
          value: 'url',
          label: 'URL列表信息'
        }],
      value1: '',
      value2: '',
      value3: '',
      value4: ''
    }
  },
  mounted () {
    let choice = []
    if (localStorage.choice) {
      choice = JSON.parse(localStorage.getItem('choice'))
    }
    if (choice.length === 0) {
      this.value1 = 'ip'
      this.value2 = 'domain'
      this.value3 = 'cve'
      this.value4 = 'fileName'
    }
    for (let i = 0; i < choice.length; i++) {
      this[`value${i + 1}`] = choice[i]
    }
  },
  async created () {
    const { data: data1 } = await getApts(1, 100)
    const { data: data2 } = await getMaps(1, 100, true)
    const aptName = []
    const shortName = []
    const date = []
    const apts = []
    data1.forEach((item) => {
      aptName.push({
        name: item.apt
      })
      shortName.push({
        name: item.description,
        url: item.fileUrl
      })
      date.push({
        name: item.date
      })
    })
    data2.forEach((item) => {
      this.maps.push({
        name: item.name,
        flag: item.initiatorFlag,
        0: item.initiatorEnName.split(';').map((val) => {
          return {
            name: val
          }
        })
      })
    })
    this.currentCountry = this.maps[0]
    this.aptName = this.maps[0].name
    apts.push(JSON.stringify(aptName))
    apts.push(JSON.stringify(shortName))
    apts.push(JSON.stringify(date))
    this.apts = JSON.stringify(apts)
    this.autoPlay()
  },
  watch: {
    aptName: {
      async handler (newName, oldName) {
        if (newName === oldName) {
          return
        }
        this.getList(newName)
        const { data: process } = await getProcess(newName)
        this.processData = process
      },
      deep: true
    },
    currentIndex (newIndex) {
      this.currentCountry = this.maps[newIndex]
      this.aptName = this.maps[newIndex].name
      const width = this.$refs.map.offsetWidth
      const height = this.$refs.map.offsetHeight
      let top = Math.random()
      let left = Math.random()
      if (left * width + this.$refs.tooltip.offsetWidth >= width) {
        left = width - this.$refs.tooltip.offsetWidth - 10
      } else {
        left = left * width
      }
      if (top * height + this.$refs.tooltip.offsetHeight >= height) {
        top = height - this.$refs.tooltip.offsetHeight - 10
      } else {
        top = top * height
      }
      this.$refs.tooltip.style.top = `${top}px`
      this.$refs.tooltip.style.left = `${left}px`
    },
    value1: {
      handler (val) {
        this.saveChoice(0, val)
      },
      deep: true
    },
    value2: {
      handler (val) {
        this.saveChoice(1, val)
      },
      deep: true
    },
    value3: {
      handler (val) {
        this.saveChoice(2, val)
      },
      deep: true
    },
    value4: {
      handler (val) {
        this.saveChoice(3, val)
      },
      deep: true
    }
  },
  methods: {
    changeMap () {
      if (this.currentIndex + 1 === this.maps.length) {
        this.currentIndex = 0
      } else {
        this.currentIndex++
      }
    },
    saveChoice (cur, value) {
      let choice = [this.value1, this.value2, this.value3, this.value4]
      for (let i = 0; i < this.options.length; i++) {
        this.options[i].disabled = false
      }
      for (let i = 0; i < this.options.length; i++) {
        let cur = this.options[i]
        if (choice.indexOf(cur.value) > -1) {
          this.options[i].disabled = true
        }
      }
      localStorage.setItem('choice', JSON.stringify(choice))
      this.getList(this.aptName, cur, value)
    },
    async getList (newName, cur = null, value = null) {
      let aptDetail = []
      if (cur !== null && value) {
        if (this.aptDetail.length > 0) {
          aptDetail = JSON.parse(this.aptDetail)
        }
        aptDetail[cur] = JSON.stringify([])
        const { data } = await getListData(value, 1, 100, newName)
        if (data.length > 0) {
          aptDetail[cur] = JSON.stringify(data.map((item) => {
            return {
              name: value === 'sample' ? item.hash : item[value]
            }
          }))
        } else {
          aptDetail[cur] = JSON.stringify([])
        }
        this.aptDetail = JSON.stringify(aptDetail)
      } else if (!cur && !value) {
        const { data: data1 } = await getListData(this.value1, 1, 100, newName)
        const { data: data2 } = await getListData(this.value2, 1, 100, newName)
        const { data: data3 } = await getListData(this.value3, 1, 100, newName)
        const { data: data4 } = await getListData(this.value4, 1, 100, newName)
        aptDetail = [JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), JSON.stringify([])]
        if (data1.length > 0) {
          aptDetail[0] = JSON.stringify(data1.map((item) => {
            return {
              name: this.value1 === 'sample' ? item.hash : item[this.value1]
            }
          }))
        }
        if (data2.length > 0) {
          aptDetail[1] = JSON.stringify(data2.map((item) => {
            return {
              name: this.value2 === 'sample' ? item.hash : item[this.value2]
            }
          }))
        }
        if (data3.length > 0) {
          aptDetail[2] = JSON.stringify(data3.map((item) => {
            return {
              name: this.value3 === 'sample' ? item.hash : item[this.value3]
            }
          }))
        }
        if (data4.length > 0) {
          aptDetail[3] = JSON.stringify(data4.map((item) => {
            return {
              name: this.value4 === 'sample' ? item.hash : item[this.value4]
            }
          }))
        }
        this.aptDetail = JSON.stringify(aptDetail)
      }
    },
    clearPlay () {
      clearInterval(this.timer)
    },
    autoPlay () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(this.changeMap, 10000)
    },
    goTo (item) {
      if (item.url) {
        open(item.url)
      } else {
        this.$router.push(`/detail?name=${item.name}`)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "Overview.styl"
  .background
    background $color-background-d
</style>
