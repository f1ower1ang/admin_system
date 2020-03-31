<template>
<ul class="tab">
  <li class="active-bar" ref="bar"></li>
  <router-link class="item" ref="list" v-for="(item, index) in tabs" @click.native="selectTab(item, index, $event)" :class="{active: currentIndex === index}" :key="index" tag="li" :to="item.router ? item.router : route">
    {{ item.label }}
  </router-link>
</ul>
</template>

<script>
export default {
  name: 'tab',
  props: {
    tabs: {
      type: Array,
      default: null
    },
    router: {
      type: Boolean,
      default: false
    },
    idx: {
      type: Number,
      default: 0
    }
  },
  computed: {
    route() {
      let path = this.$route.path + '?'
      Object.keys(this.$route.query).forEach(k => {
        path += `${k}=${this.$route.query[k]}`
      })
      return path
    }
  },
  data() {
    return {
      currentIndex: this.idx
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 20)
  },
  activated() {
    setTimeout(() => {
      this.init()
    }, 20)
  },
  methods: {
    selectTab(item, index, e) {
      this.currentIndex = index
      this.$refs.bar.style.width = e.target.offsetWidth + 'px'
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += this.$refs.list[i].$el.offsetWidth
      }
      this.$refs.bar.style.left = offset + 'px'
      this.$emit('handleTab', item.name)
    },
    init() {
      this.currentIndex = this.idx
      this.$refs.bar.style.width = this.$refs.list[this.idx].$el.offsetWidth + 'px'
      let offset = 0
      for (let i = 0; i < this.idx; i++) {
        offset += this.$refs.list[i].$el.offsetWidth
      }
      this.$refs.bar.style.left = offset + 'px'
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../assets/stylus/variable.styl"
.tab
  width 100%
  position relative
  border-bottom 2px solid rgba(0, 0, 0, .5)
  .item
    line-height 50px
    font-size $font-size-large
    color #333
    padding 0 20px
    display inline-block
    font-weight 500
    &.active
      color rgb(255, 200, 105)
  .active-bar
    display block
    position absolute
    bottom -2px
    content ''
    height 2px
    transition all .2s
    left 0
    background-color rgba(255, 200, 105, 1)
</style>
