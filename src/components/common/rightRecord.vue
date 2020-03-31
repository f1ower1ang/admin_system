<template>
  <div class="clue">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="扩展步骤" min-width="80%">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p v-if="scope.row.rollback === 0">点击撤销此步骤</p>
            <p v-else-if="scope.row.rollback === 1">点击恢复此步骤</p>
            <div @click="returnExpand(scope.$index, scope.row)" slot="reference">
              <span style="color: dodgerblue">{{scope.$index + 1}}、</span>
              <span v-if="scope.row.rollback === 0" style="color: #323232; font-size: 12px; cursor: pointer">{{scope.row.name}}</span>
              <span v-else-if="scope.row.rollback === 1" style="color: #999999; font-size: 12px; cursor: pointer">{{scope.row.name}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column min-width="20%">
        <template slot-scope="scope">
          <div class="delete">
            <i class="el-icon-delete" style="color: red" @click="handleDelete(scope.$index, scope.row)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="Popup">
      <div class="text">
        <p>删除后不可恢复，确定删除？</p>
      </div>
      <div class="button">
        <el-button class="confirm" size="mini" type="primary">确定</el-button>
        <el-button @click="cancel" size="mini" type="danger">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { searchExpand, searchExpandDelete, searchID, Back, searchRecordDelete } from '../../api/search'
// eslint-disable-next-line import/no-duplicates
import Bus from '../../main'
// eslint-disable-next-line import/no-duplicates
import ClueData from '../../main'
import Vue from 'vue'

export default {
  name: 'rightRecord',
  props: {
    keywords: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: true,
      tableData: [],
      delete: '',
      delIndex: '',
      id: '',
      number: 0,
      isNewTable: false
    }
  },
  async created() {
    // 获取参数id 获取关联表格数据
    let _this = this
    ClueData.$on('clueTableData', function (data) {
      if (!this.isNewTable) {
        _this.tableData = []
      }
      this.isNewTable = false
      data.forEach((item) => {
        _this.tableData.push({
          id: item.id,
          name: item.name,
          value: item.value,
          pid: item.pid,
          rollback: item.rollback
        })
      })
    })
    const { data: myID } = await searchID(sessionStorage.user, this.keywords)
    if (!myID) {
      searchExpand(sessionStorage.user, 10, 1, '').then((Expand) => {
        Expand.data.forEach((item) => {
          _this.tableData.push({
            id: item.id,
            name: item.name,
            value: item.value,
            pid: item.pid,
            rollback: item.rollback
          })
        })
      })
      this.isNewTable = true
    } else {
      searchExpand(sessionStorage.user, 10, 1, myID.id).then((Expand) => {
        Expand.data.forEach((item) => {
          _this.tableData.push({
            id: item.id,
            name: item.name,
            value: item.value,
            pid: item.pid,
            rollback: item.rollback
          })
        })
      })
      this.isNewTable = true
    }
  },
  methods: {
    // 取消删除
    cancel() {
      let pop = document.getElementsByClassName('Popup')[0]
      pop.style.display = 'none'
    },
    // 点击删除按钮出现弹框
    handleDelete(index, row) {
      let pop = document.getElementsByClassName('Popup')[0]
      pop.style.left = window.screenX + 400 + 'px'
      pop.style.top = window.screenY + 200 + 'px'
      pop.style.display = 'block'
      let confirm = document.getElementsByClassName('confirm')[0]
      let _this = this
      confirm.onclick = async function() {
        document.getElementsByClassName('Popup')[0].style.display = 'none'
        let delLen = _this.tableData.length - index
        _this.tableData.forEach((item, i) => {
          if (item.name === row.name) {
            _this.tableData.splice(i, delLen)
          }
        })
        const { data: myID } = await searchID(sessionStorage.user, _this.keywords)
        await searchExpandDelete(sessionStorage.user, row.id, myID.id)
      }
    },
    // 根据 rollback 改变字体颜色
    changeColor(sExpand) {
      // Vue.set 批量修改element-UI当前表格的值
      this.tableData.map((i, index) => {
        i.rollback = sExpand[index].rollback
        Vue.set(this.tableData, index, i)
      })
    },
    // 回到扩展之前的步骤
    async returnExpand(index, row) {
      let rollback = row.rollback
      // console.log('已经点击')
      const { data: myID } = await searchID(sessionStorage.user, this.keywords)
      /* const { data: backData } = await Back(sessionStorage.user, row.value, row.pid, row.id, myID.id, row.rollback)
      // 传递信息给ioc组件
      let clueAndBack = { rollback, backData }
      Bus.$emit('sendIoc', clueAndBack) */
      Back(sessionStorage.user, row.value, row.pid, row.id, myID.id, row.rollback).then((res) => {
        // console.log('back res', res)
        let backData = res.data
        // console.log('rollback, backData', rollback, backData)
        let clueAndBack = { rollback, backData }
        let that = this
        searchExpand(sessionStorage.user, 10, 1, myID.id).then((res) => {
          let sExpand = res.data
          that.tableData.map((i, index) => {
            i.rollback = sExpand[index].rollback
            Vue.set(this.tableData, index, i)
          })
          Bus.$emit('sendIoc', clueAndBack)
        })
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .Popup
    display none
    position absolute
    font-size 12px
    width 300px
    height 100px
    background-color #ffffff
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .4)
    .text
      width 100%
      height 60px
      p
        font-size 15px
        padding 15px
    .button
      width 100%
      height 20px
      margin-left 50%
      border none
</style>
