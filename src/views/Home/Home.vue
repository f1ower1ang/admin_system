<template>
  <div class="home">
    <div class="selector">
      <el-radio-group v-model="radio">
        <el-radio-button label="全部" style="margin-right: 10px; margin-bottom: 5px">全部</el-radio-button>
        <div class="choose-group" v-for="(item, index) in selectors" :key="index">
          <div class="flag">
            <el-image :src="item.flag" lazy fits="fill">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline-round"></i>
              </div>
            </el-image>
          </div>
          <el-radio-button :label="item.name"></el-radio-button>
        </div>
      </el-radio-group>
    </div>
    <div style="padding: 10px 20px" id="card">
      <pagination :page="page" :page-size="pageSize" :total="total" @updateData="splitCards">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(card, index) in cards" :key="index">
            <el-card :body-style="{padding: '15px'}" shadow="hover">
              <div class="top">
                <el-image :src="logo" style="width: 50px;height: 29px" lazy v-for="(logo, index) in card.logo" :key="index">
                  <div slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>{{ card.name }}</p>
              </div>
              <div class="content">
                {{ card.description }}
              </div>
              <div class="bottom">
                <router-link :to="`/detail?name=${card.name}`" tag="p">
                  <i class="iconfont icon-more"></i>
                  详情
                </router-link>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '../../components/common/pagination'
import { Loading } from 'element-ui'
import { getCards, getCategory } from '../../api/home'
export default {
  name: 'home',
  components: {
    Pagination
  },
  data() {
    return {
      cardList: [],
      cards: [],
      pageSize: 8,
      total: 0,
      loading: null,
      selectors: [],
      radio: '全部',
      page: 1
    }
  },
  created() {
    this.getAndFormalCards(1)
    getCategory().then((res) => {
      this.selectors = res.data.map((item) => {
        return {
          name: item.initiator,
          flag: item.initiatorFlag
        }
      })
    })
  },
  watch: {
    $route(to, from) {
      if (from.path === '/login') {
        location.reload()
      }
    },
    radio: {
      handler() {
        this.startLoading()
        setTimeout(() => {
          this.getAndFormalCards(1)
          this.endLoading()
        }, 200)
      },
      deep: true
    }
  },
  methods: {
    splitCards(val) {
      this.startLoading()
      setTimeout(() => {
        this.getAndFormalCards(val)
        this.endLoading()
      }, 200)
    },
    async getAndFormalCards(page) {
      this.page = page
      let res = null
      if (this.radio === '全部') {
        res = await getCards(this.pageSize, page, '')
      } else {
        res = await getCards(this.pageSize, page, this.radio)
      }
      if (res.code === 0) {
        this.cards = res.data.map((item) => {
          return {
            name: item.name,
            logo: item.initiatorFlag.split(';'),
            description: item.summary
          }
        })
        this.total = res.count
      }
    },
    startLoading() {
      this.loading = Loading.service({
        lock: true,
        target: '#card'
      })
    },
    endLoading() {
      this.loading && this.loading.close()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "Home.styl"
</style>
