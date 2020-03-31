<template>
  <div class="ioc-wrapper" id="ioc-wrapper">
    <div class="content" style="width: 100%; height: 100%; background-color: white">
      <div class="ioc" ref="ioc"></div>
      <div class="exitFScreen no-radius">
        <el-button v-if="screenShow"  @click="exitFullScreen" icon="el-icon-full-screen" type="primary" size="medium" />
      </div>
      <div class="menuBox" style="display: none;">
        <div><span class="menuValue" style="display: none;"></span></div>
        <div><span class="menuURL" style="display: none;"></span></div>
        <div class="title"><span class="menuTitle"></span></div>
        <div class="choose">
          <ul>
            <li v-for="(item, index) in menuData" :key="index">
             <!-- <div>
                <router-link :to="item.url" target="_blank"><p>{{item.name}}</p></router-link>
              </div>-->
              <div @click="openURl1(item.url)"><p>{{item.name}}</p></div>
            </li>
            <li v-for="(item, index) in openMenuData" :key="index">
              <div @click="openURl(item.url)"><p>{{item.name}}</p></div>
            </li>
          </ul>
          <ul>
            <li class="clue" @click="clueClick" style="display: none;"><p>扩展关联线索</p></li>
          </ul>
        </div>
        <p class="menuValue">{{menuValue}}</p>
      </div>
      <div class="no-result" v-show="flag">
        <div class="box">
          <img src="../../assets/images/no-result.jpg" width="250" alt="">
          <p>暂无结果</p>
        </div>
      </div>
      <div class="getTag">
        <div class="input">
          <el-input v-model="test" placeholder="请输入标签内容" />
        </div>
        <div class="button f">
          <el-button class="submit" style="margin-left: 155px" size="mini" type="primary">提交</el-button>
        </div>
        <div class="button f">
          <el-button @click="Cancel" class="cancel" size="mini" type="primary">取消</el-button>
        </div>
      </div>
      <div class="editTag">
        <div class="editInput">
          <el-input v-model="test" placeholder="请输入修改内容" />
        </div>
        <div class="editButton f">
          <el-button class="delete" style="margin-left:105px; background-color: #ff3b06; border: none" size="mini" type="primary">删除</el-button>
        </div>
        <div class="editButton f">
          <el-button class="edit" size="mini" type="primary">提交</el-button>
        </div>
        <div class="editButton f">
          <el-button @click="Cancel" class="cancel" size="mini" type="primary">取消</el-button>
        </div>
      </div>
      <div class="iocPopup">
        <div class="text">
          <p>没有关联到任何线索</p>
        </div>
        <div class="iocButton">
          <el-button @click="Confirm" size="mini" type="primary">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { searchIoc, searchID, searchExpand, iocRelationTag, TagId, EditTag, DeleteTag } from '../../api/search'
import { Loading } from 'element-ui'
// eslint-disable-next-line import/no-duplicates
import Bus from '../../main'
// eslint-disable-next-line no-unused-vars,import/no-duplicates
import ClueData from '../../main'
// eslint-disable-next-line import/no-duplicates
import fScreen from '../../main'
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
    let _this = this
    this.options.tooltip.formatter = function (params) {
      let detail = params.data.detail
      let text1 = JSON.stringify(detail, null, 2)
      let text2 = '<pre>' + text1 + '</pre>'
      let str = ''
      if (params.data.flag === '3') {
        str = '<div style="text-align: left;width:400px;height:300px; ' +
            'white-space:normal; word-break:break-all;overflow:scroll;">'
        return str + text2 + '</div>'
      } else if (params.data.flag === '4') {
        return '<div style="text-align: left;width:150px;height:30px;">右击查看更多功能</div>'
      }
    }
    // 监听元素变化,重置大小
    window.onresize = function () {
      _this.$nextTick(_this.myCharts.resize())
    }
    /* Bus.$on('sendIoc', (val) => {
      console.log('sendIoc', val)
      this.BackClue(val)
    }) */
  },
  created () {
    if (this.keywords.length > 0) {
      this.handleKeywords()
    }
    Bus.$on('sendIoc', (val) => {
      console.log('sendIoc', val)
      this.BackClue(val)
    })
    fScreen.$on('screen', () => {
      this.showFullScreen()
    })
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
        grid: {
          top: '50px',
          left: '50px',
          right: '15px',
          bottom: '50px'
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
              color: '#000000', // 线的颜色[ default: '#aaa' ]
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
          },
          edgeLabel: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 14,
                color: '#aa0908'
              }
            }
          }
        }],
        animationEasingUpdate: 'quinticInOut', // 数据更新动画的缓动效果。[ default: cubicOut ]    "quinticInOut"
        animationDurationUpdate: 100
      },
      flag: false,
      fullscreen: false,
      menuData: [],
      openMenuData: [],
      openClass: '',
      arr: [],
      menuValue: '',
      receiveIoc: '',
      optionData: '',
      optionLinks: '',
      screenShow: false,
      test: ''
    }
  },
  watch: {
    keywords() {
      this.handleKeywords()
    }
  },
  methods: {
    Confirm() {
      let Popup = document.getElementsByClassName('iocPopup')[0]
      Popup.style.display = 'none'
    },
    Cancel() {
      let getTag = document.getElementsByClassName('getTag')[0]
      getTag.style.display = 'none'
      let editTag = document.getElementsByClassName('editTag')[0]
      editTag.style.display = 'none'
    },
    async handleKeywords() {
      for (let i = 0; i < 2000000; i++) {
        this.arr.push(' ')
      }
      if (!this.myCharts) {
        this.options.series[0].edgeLabel.normal.formatter = function (param) {
          return param.data.tag
        }
        this.options.series[0].edgeLabel.normal.show = true
        // this.options.series[0].edgeLabel.normal.show = false
        this.$nextTick(async () => {
          this.myCharts = this.$echarts.init(this.$refs.ioc)
          this.startLoading()
          let totalData = await this.getIoc(this.keywords, '')
          let data = totalData.data
          let links = totalData.links
          this.endLoading()
          if (data.length > 0) {
            this.flag = false
          } else {
            this.flag = true
            return
          }
          this.options.series[0].data = data
          this.options.series[0].links = links
          for (let i = 0; i < this.options.series[0].links.length; i++) {
            this.arr[i] = this.options.series[0].links[i].tag
          }
          this.myCharts.on('click', (params) => {
            if (params.dataType === 'node') {
              if (params.data.flag === '1') {
                open(params.data.url)
              }
            } else if (params.dataType === 'edge') {
              // 点击节点，写入标签
              if (this.arr[params.dataIndex] === '') {
                this.test = ''
                // 输入框为空，则提交和取消
                let getTag = document.getElementsByClassName('getTag')[0]
                getTag.style.display = 'block'
                console.log(event.clientX, event.clientY)
                if (!this.screenShow) {
                  getTag.style.left = event.clientX - 200 + 'px'
                  getTag.style.top = event.clientY - 200 + 'px'
                } else {
                  getTag.style.left = event.clientX + 'px'
                  getTag.style.top = event.clientY + 'px'
                }
                let submit = document.getElementsByClassName('submit')[0]
                let that = this
                let CurrentEdge = params
                // 点击提交按钮
                submit.onclick = async function() {
                  const { data: myID } = await searchID(sessionStorage.user, that.keywords)
                  if (!myID) {
                    await iocRelationTag('', sessionStorage.user, CurrentEdge.data.source, CurrentEdge.data.target, that.test)
                  } else {
                    await iocRelationTag(myID.id, sessionStorage.user, CurrentEdge.data.source, CurrentEdge.data.target, that.test)
                  }
                  getTag.style.display = 'none'
                  that.arr[CurrentEdge.dataIndex] = that.test
                  that.options.series[0].edgeLabel.normal.formatter = function (param) {
                    return that.arr[param.dataIndex]
                  }
                  that.options.series[0].edgeLabel.normal.show = true
                  that.myCharts.setOption(that.options)
                }
              } else {
                this.test = this.arr[params.dataIndex]
                let editTag = document.getElementsByClassName('editTag')[0]
                editTag.style.display = 'block'
                if (!this.screenShow) {
                  editTag.style.left = event.clientX - 200 + 'px'
                  editTag.style.top = event.clientY - 200 + 'px'
                } else {
                  editTag.style.left = event.clientX + 'px'
                  editTag.style.top = event.clientY + 'px'
                }
                let edit = document.getElementsByClassName('edit')[0]
                let del = document.getElementsByClassName('delete')[0]
                let that = this
                let CurrentEdge = params
                // 点击提交按钮
                edit.onclick = async function() {
                  // 请求接口
                  // 打标机
                  // 如果接口数据有标记，则覆盖，没有的话，追加
                  const { data: myID } = await searchID(sessionStorage.user, that.keywords)
                  const { data: tagID } = await TagId(myID.id, sessionStorage.user, that.arr[CurrentEdge.dataIndex], CurrentEdge.data.source, CurrentEdge.data.target)
                  await EditTag(tagID.id, that.test)
                  editTag.style.display = 'none'
                  that.arr[CurrentEdge.dataIndex] = that.test
                  that.options.series[0].edgeLabel.normal.formatter = function (param) {
                    return that.arr[param.dataIndex]
                  }
                  that.options.series[0].edgeLabel.normal.show = true
                  that.myCharts.setOption(that.options)
                }
                // 点击删除按钮
                del.onclick = async function () {
                  const { data: myID } = await searchID(sessionStorage.user, that.keywords)
                  const { data: tagID } = await TagId(myID.id, sessionStorage.user, that.arr[CurrentEdge.dataIndex], CurrentEdge.data.source, CurrentEdge.data.target)
                  await DeleteTag(tagID.id)
                  editTag.style.display = 'none'
                  that.arr[CurrentEdge.dataIndex] = ''
                  that.options.series[0].edgeLabel.normal.formatter = function (param) {
                    return that.arr[param.dataIndex]
                  }
                  that.options.series[0].edgeLabel.normal.show = true
                  that.myCharts.setOption(that.options)
                }
              }
            }
          })
          this.myCharts.setOption(this.options)
          this.bindEChcartsContextMenu(this.myCharts)
        })
      } else {
        this.startLoading()
        let totalData = await this.getIoc(this.keywords, '')
        let data = totalData.data
        let links = totalData.links
        this.endLoading()
        if (data.length > 0) {
          this.flag = false
        } else {
          this.flag = true
          return
        }
        this.options.series[0].data = data
        this.options.series[0].links = links
        this.options.series[0].edgeLabel.normal.formatter = function (param) {
          return param.data.tag
        }
        this.options.series[0].edgeLabel.normal.show = true
        this.myCharts.setOption(this.options)
        this.bindEChcartsContextMenu(this.myCharts)
      }
    },
    load () {
      if ((this.page) * this.limit < this.total) {
        this.page += 1
      }
    },
    async getIoc (keywords, expandType) {
      const { data: myID } = await searchID(sessionStorage.user, this.keywords)
      if (!myID) {
        const { data: totalData } = await searchIoc(keywords, expandType, sessionStorage.user, '')
        return totalData
      } else {
        const { data: totalData } = await searchIoc(keywords, expandType, sessionStorage.user, myID.id)
        return totalData
      }
    },
    startLoading () {
      this.loading = Loading.service({
        lock: true,
        target: '#ioc-wrapper'
      })
    },
    endLoading () {
      this.loading && this.loading.close()
    },
    // 节点菜单
    bindEChcartsContextMenu (ec) {
      let currentItem = null
      let _this = this
      ec.on('mouseover', function (pItem) {
        currentItem = pItem
      })
      ec.on('mouseout', function (pItem) {
        currentItem = null
      })
      document.oncontextmenu = function (event) {
        if (currentItem.dataType === 'node') {
          // 清空数据
          _this.menuData = []
          _this.openMenuData = []
          let li = document.getElementsByClassName('clue')[0]
          li.style.display = 'none'
          _this.menuValue = ''
          // currentItem 的右键菜单；
          if (currentItem.data.flag === '4') {
            // 有菜单
            if (currentItem.data.rightClickMenuList != null) {
              let menu = document.getElementsByClassName('menuBox')[0]
              menu.style.display = 'block'
              if (!this.fullscreen) {
                menu.style.left = event.x * 0.5 + 'px'
                menu.style.top = event.y * 0.5 + 'px'
              } else {
                menu.style.left = event.x + 'px'
                menu.style.top = event.y + 'px'
              }
              menu.getElementsByClassName('menuTitle')[0].innerHTML = currentItem.data.name
              // 第二级菜单判断
              let List = currentItem.data.rightClickMenuList
              List.forEach((item, i) => {
                // 判断menutype
                if (List[i].menuType === '1') {
                  // 显示菜单名字
                  if (List[i].menuURL[0] === '/') {
                    _this.menuData.push({
                      name: List[i].menuName,
                      url: List[i].menuURL
                    })
                  } else {
                    _this.openMenuData.push({
                      name: List[i].menuName,
                      url: List[i].menuURL
                    })
                  }
                } else if (List[i].menuType === '2') {
                  let li = document.getElementsByClassName('clue')[0]
                  li.style.display = 'block'
                  menu.getElementsByClassName('menuValue')[0].innerHTML = currentItem.data.value
                  menu.getElementsByClassName('menuURL')[0].innerHTML = List[i].menuURL
                } else if (List[i].menuType === '3') {
                  _this.menuValue = List[i].menuValue
                }
              })
              window.document.onclick = function () {
                document.getElementsByClassName('menuBox')[0].style.display = 'none'
              }
            }
          }
        }
        return false
      }
    },
    // 扩展关联
    async clueClick () {
      let keyword = document.getElementsByClassName('menuValue')[0].innerHTML
      let expandType = document.getElementsByClassName('menuURL')[0].innerHTML
      const { data: searchId } = await searchID(sessionStorage.user, this.keywords)
      const { data: DataClue } = await searchIoc(keyword, expandType, sessionStorage.user, searchId.id)
      const { data: sExpand } = await searchExpand(sessionStorage.user, 10, 1, searchId.id)
      // 修改1
      // console.log('DataClue', DataClue)
      ClueData.$emit('clueTableData', sExpand)
      if (DataClue.data[0] === undefined && DataClue.links[0] === undefined) {
        let Popup = document.getElementsByClassName('iocPopup')[0]
        Popup.style.display = 'block'
        Popup.style.left = '45%'
        Popup.style.top = '45%'
      } else {
        const dataClue = DataClue.data
        const linkClue = DataClue.links
        dataClue.forEach((item, i) => {
          this.options.series[0].data.push(dataClue[i])
        })
        linkClue.forEach((item, i) => {
          this.options.series[0].links.push(linkClue[i])
        })
        this.optionData = this.options.series[0].data
        this.optionLinks = this.options.series[0].links
        this.myCharts.setOption(this.options)
      }
    },
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    // 撤销和恢复关联
    BackClue (val) {
      // 拿到扩展的数据，删除并重新加载
      // 删除节点
      if (val !== null) {
        if (val.rollback === 0) {
          for (let i in this.options.series[0].data) {
            for (let j in val.backData.data) {
              if (this.options.series[0].data[i].name === val.backData.data[j].name) {
                this.options.series[0].data.splice(i, 1)
              }
            }
          }
          // 删除边
          for (let i in this.options.series[0].links) {
            for (let j in val.backData.links) {
              if (this.options.series[0].links[i] === val.backData.links[j]) {
                // this.options.series[0].data.splice(i, 1)
                this.options.series[0].links.splice(i, 1)
              }
            }
          }
          this.myCharts.setOption(this.options)
        } else if (val.rollback === 1) {
          const dataClue = val.backData.data
          const linkClue = val.backData.links
          dataClue.forEach((item, i) => {
            this.options.series[0].data.push(dataClue[i])
          })
          linkClue.forEach((item, i) => {
            this.options.series[0].links.push(linkClue[i])
          })
          this.myCharts.setOption(this.options)
        }
      }
    },
    showFullScreen () {
      // let full = document.getElementById('contain')
      this.screenShow = true
      let full = document.getElementsByClassName('content')[0]
      this.launchIntoFullscreen(full)
    },
    exitFullScreen () {
      this.exitFullscreen()
      this.screenShow = false
    },
    launchIntoFullscreen (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    exitFullscreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    openURl(url) {
      let URL = 'index.html#/' + url
      window.open(URL)
    },
    openURl1(url) {
      window.open(url)
    }
  }
}
</script>

<style scoped lang="stylus">
  .f
    float left
  .r
    float right
  .ioc-wrapper
    height 100%
    width 100%
    position: relative;
    .ioc
      width 100%
      height 100%
      background-color white
    .exitFScreen
      position: absolute;
      right 70px
      height 10%
      bottom 0
      width 50px
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
    .menuBox
      display inline-block
      position absolute
      border 1px solid #dddddd
      background-color #fff
      box-shadow 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .08)
      font-size 12px
      width 300px
      .title
        width 100%
        border 1px solid #ffffff
        padding 10px
        display block
        span
          margin-left 5px
      .choose
        width 100%
        ul
          margin 0
          padding 0
        li
          list-style-type none padding 8px
          cursor pointer
          width 100%
          height 32px
          border 1px solid #f1f1f1
          p
            color #0265d1
            padding 5px
            margin-left 10px
            font-size 13px
        li:hover
          background-color rgba(0,128,245,0.2)
    .getTag
      display none
      position absolute
      width 300px
      height 100px
      border 1px solid #e5eef9
      box-shadow 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .4)
      background-color #fff
      font-size 12px
      z-index 100
      .input
        border none
        margin 10px auto
        width 90%
        height 30px
      .button
        margin 10px 5px
      .input:hover
        border 1px solid rgba(254, 244, 234, .4)
    .iocPopup
      display none
      position absolute
      width 220px
      height 100px
      background-color #ffffff
      box-shadow 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .4)
      .text
        width 100%
        height 55px
        margin-top 5px
        p
          font-size 15px
          font-family "Adobe 宋体 Std L"
          color $color-text
          padding 15px 25px
      .iocButton
        width 50%
        height 15px
        margin-left 60%
        border none
    .editTag
      display none
      position absolute
      width 320px
      height 100px
      border 1px solid #e5eef9
      box-shadow 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .4)
      background-color #fff
      font-size 12px
      .editInput
        border none
        margin 10px auto
        width 90%
        height 30px
      .editButton
        margin 10px 5px
      .editInput:hover
        border 1px solid rgba(254, 244, 234, .4)
</style>
