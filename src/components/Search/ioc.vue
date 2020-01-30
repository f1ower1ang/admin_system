<template>
<div class="ioc-wrapper" id="ioc-wrapper">
  <div class="ioc" ref="ioc"></div>
  <div class="no-result" v-show="flag">
    <div class="box">
      <img src="../../assets/images/no-result.jpg" width="250" alt="">
      <p>暂无结果</p>
    </div>
  </div>
</div>
</template>

<script>
import { searchIoc } from '../../api/search'
import { Loading } from 'element-ui'

export default {
  name: 'ioc',
  components: {},
  props: {
    keywords: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.options.tooltip.formatter = function (params) {
      let html = params.name
      let detail = params.data.detail
      let text1 = JSON.stringify(detail, null, 2)
      let text2 = '<pre>' + text1 + '</pre>'
      let str = ''
      if (params.data.flag === '3') {
        str = '<div style="text-align: left;width:400px;height:300px; ' +
          'white-space:normal; word-break:break-all;overflow:scroll;">'
        return str + text2 + '</div>'
      } else {
        str = '<div style="text-align: left;width:150px;height:50px;">'
        return str + html + '</div>'
      }
    }
  },
  data() {
    return {
      myCharts: null,
      options: {
        title: { // 图表标题
          left: '3%', // 标题距离左侧边距
          top: '3%', // 标题距顶部边距
          textStyle: { // 标题样式
            color: '#000', // 标题字体颜色
            fontSize: '12' // 标题字体大小
          }
        },
        tooltip: {
          triggerOn: 'click',
          enterable: true
        },
        series: [{
          type: 'graph', // 系列类型:关系图
          top: '10%', // 图表距离容器顶部的距离
          roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          focusNodeAdjacency: true, // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。[ default: false ]
          force: { // 力引导布局相关的配置项，力引导布局是模拟弹簧电荷模型在每两个节点之间添加一个斥力，每条边的两个节点之间添加一个引力，每次迭代节点会在各个斥力和引力的作用下移动位置，多次迭代后节点会静止在一个受力平衡的位置，达到整个模型的能量最小化。
            // 力引导布局的结果有良好的对称性和局部聚合性，也比较美观。
            repulsion: 1000, // [ default: 50 ]节点之间的斥力因子(关系对象之间的距离)。支持设置成数组表达斥力的范围，此时不同大小的值会线性映射到不同的斥力。值越大则斥力越大
            edgeLength: [150, 100] // [ default: 30 ]边的两个节点之间的距离(关系对象连接线两端对象的距离,会根据关系对象值得大小来判断距离的大小)，
            // 这个距离也会受 repulsion。支持设置成数组表达边长的范围，此时不同大小的值会线性映射到不同的长度。值越小则长度越长。如下示例:
            // 值最大的边长度会趋向于 10，值最小的边长度会趋向于 50      edgeLength: [10, 50]
          },
          layout: 'force', // 图的布局。[ default: 'none' ]
          // 'none' 不采用任何布局，使用节点中提供的 x， y 作为节点的位置。
          // 'circular' 采用环形布局;'force' 采用力引导布局.

          // symbol: 'circle',
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [1, 5],
          lineStyle: { // 关系边的公用线条样式。其中 lineStyle.color 支持设置为'source'或者'target'特殊值，此时边会自动取源节点或目标节点的颜色作为自己的颜色。
            normal: {
              color: '#000', // 线的颜色[ default: '#aaa' ]
              width: 1, // 线宽[ default: 1 ]
              type: 'solid', // 线的类型[ default: solid ]   'dashed'    'dotted'
              opacity: 0.5, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。[ default: 0.5 ]
              curveness: 0 // 边的曲度，支持从 0 到 1 的值，值越大曲度越大。[ default: 0 ]
            }
          },
          label: { // 关系对象上的标签
            normal: {
              show: true, // 是否显示标签
              position: 'top', // 标签位置:'top''left''right''bottom''inside''insideLeft''insideRight''insideTop''insideBottom''insideTopLeft''insideBottomLeft''insideTopRight''insideBottomRight'
              textStyle: { // 文本样式
                fontSize: 12
              }
            }
          }
        }],
        animationEasingUpdate: 'quinticInOut', // 数据更新动画的缓动效果。[ default: cubicOut ]    "quinticInOut"
        animationDurationUpdate: 100
      },
      flag: false
    }
  },
  watch: {
    async keywords() {
      if (!this.myCharts) {
        this.myCharts = this.$echarts.init(this.$refs.ioc)
        this.myCharts.on('click', (params) => {
          if (params.data.flag === '1') {
            open(params.data.url)
          }
        })
      }
      this.startLoading()
      const { data, links } = await this.getIoc()
      this.endLoading()
      if (data.length > 0) {
        this.flag = false
      } else {
        this.flag = true
        return
      }
      this.options.series[0].data = data
      this.options.series[0].links = links
      this.myCharts.setOption(this.options)
    }
  },
  methods: {
    load() {
      if ((this.page) * this.limit < this.total) {
        this.page += 1
      }
    },
    async getIoc() {
      const { data: totalData } = await searchIoc(this.keywords)
      const { data, links } = totalData
      return {
        data,
        links
      }
    },
    startLoading() {
      this.loading = Loading.service({
        lock: true,
        target: '#ioc-wrapper'
      })
    },
    endLoading() {
      this.loading && this.loading.close()
    }
  }
}
</script>

<style scoped lang="stylus">
.ioc-wrapper
  height 100%
  width 100%
  position: relative;
  .ioc
    height 100%
    width 100%
  .no-result
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    .box
      margin 100px auto
      text-align center
      font-size 14px
      p
        margin-top 10px
</style>
