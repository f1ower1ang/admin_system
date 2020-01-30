<template>
  <div class="search">
    <div class="nav">
      <el-menu :default-active="activeIndex" mode="horizontal" background-color="#eee" active-text-color="#ffd04b"
               @select="handleSelect">
        <el-menu-item index="1">报告</el-menu-item>
        <el-menu-item index="2">TTP</el-menu-item>
        <el-menu-item index="3">IOC</el-menu-item>
      </el-menu>
    </div>
    <div class="search-box">
      <el-input v-model="input" :placeholder="placeholder"></el-input>
      <el-button @click="search">搜索</el-button>
    </div>
    <div class="content">
      <report v-show="activeIndex === '1'" :keywords="ttp_keywords"></report>
      <ttp v-show="activeIndex === '2'" :keywords="report_keywords" ref="ttp" @search="search"
           @changeLabel="change"></ttp>
      <ioc v-show="activeIndex === '3'" :keywords="ioc_keywords"></ioc>
    </div>
  </div>
</template>

<script>
import ttp from '../../components/Search/ttp'
import ioc from '../../components/Search/ioc'
import report from '../../components/Search/report'

export default {
  name: 'Search',
  components: {
    ttp,
    report,
    ioc
  },
  data () {
    return {
      input: '',
      activeIndex: '1',
      placeholder: '请输入关键词',
      ttp_keywords: '',
      report_keywords: '',
      ioc_keywords: '',
      keywords_list: ['', '', ''],
      label: '1'
    }
  },
  watch: {
    activeIndex: {
      handler (now, before) {
        this.keywords_list[before - 1] = this.input
        this.input = this.keywords_list[now - 1]
        switch (now) {
          case '1':
            this.placeholder = '请输入关键词'
            break
          case '2':
            this.placeholder = '请输入APT名称、别名或过程'
            break
          case '3':
            this.placeholder = '请输入域名、邮箱、IP、URL或样本哈希'
        }
      },
      deep: true
    },
    label: {
      handler() {
        if (this.activeIndex === '2') {
          this.placeholder = this.label === '1' ? '请输入APT名称、别名或过程' : '请点选TTP项目'
        }
      },
      deep: true
    }
  },
  methods: {
    search () {
      if (this.input.length === 0) {
        return
      }
      if (this.activeIndex === '1') {
        this.ttp_keywords = this.input
      } else if (this.activeIndex === '2') {
        this.report_keywords = this.input
        setTimeout(() => {
          this.$refs.ttp.getTtp()
        }, 20)
      } else if (this.activeIndex === '3') {
        this.ioc_keywords = this.input
      }
    },
    change (label) {
      this.label = label
    },
    handleSelect (key) {
      this.activeIndex = key
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "Search.styl"
</style>
