<template>
  <div class="box" title="关联记录">
    <div class="display" v-infinite-scroll="load" ref="Box">
      <el-table
        :data="tableData" :row-style="{height: '5px'}"
        :cell-style="{padding: '1px 0'}" :show-header="false">
        <el-table-column min-width="60%">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.value }}</p>
              <div class="tableContent" slot="reference">
                <el-input v-show="scope.row.rowShow" size="medium" v-model="scope.row.name"></el-input>
                <span @click="iocKeywords(scope.row.value)" v-show="!scope.row.rowShow">{{scope.row.name}}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="时间" min-width="27%">
          <template slot-scope="scope">
            <span class="date">{{scope.row.date}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="13%">
          <template slot-scope="scope">
            <i v-show="!scope.row.editShow" class="el-icon-edit editIcon" @click="handleEdit(scope.$index, scope.row)"></i>
            <i v-show="scope.row.editShow" class="el-icon-check editIcon" @click="saveEdit(scope.$index, scope.row)"></i>
            <i class="el-icon-delete deleteIcon" @click="handleDelete(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { searchRecord, searchRecordEdit, searchRecordDelete, ExpandDelete } from '../../api/search'
export default {
  name: 'SearchRecord',
  props: ['importShow'],
  data() {
    return {
      tableData: [],
      show: false,
      delIndex: '',
      result: [],
      limit: 10,
      page: 1,
      total: 0
    }
  },
  watch: {
    importShow: function (value) {
      this.show = value
    }
  },
  mounted() {
    // 先给页面注册滚动事件
    this.getSearchRecord()
    document.addEventListener('scroll', this.Scroll, true)
  },
  async created() {
    // 关联记录的数据接口
    /* const { data: searchRecordData } = await searchRecord(sessionStorage.user, 10, 1)
    searchRecordData.forEach((item) => {
      this.tableData.push({
        name: item.name,
        value: item.value,
        id: item.id,
        date: item.date,
        rowShow: false,
        editShow: false
      })
    }) */
  },
  methods: {
    Scroll() {
      console.log('scrollHeight', this.$refs.Box.scrollHeight)
      console.log('scrollTop', Math.ceil(this.$refs.Box.scrollTop))
      console.log('clientHeight', this.$refs.Box.clientHeight)
      if (Math.ceil(this.$refs.Box.clientHeight + this.$refs.Box.scrollTop) === this.$refs.Box.scrollHeight && this.page * this.limit < this.total) {
        let height = Math.ceil(this.$refs.Box.clientHeight + this.$refs.Box.scrollTop)
        let i = 1
        let number = 2 * (i++)
        this.$refs.Box.scrollTop = height / number
        this.page += 1
        this.getSearchRecord()
      }
      console.log(this.page)
    },
    load () {
      /* if (this.page * this.limit < this.total) {
        this.page += 1
        this.getSearchRecord()
        console.log('滚动数据', this.result)
      } */
    },
    getSearchRecord() {
      searchRecord(sessionStorage.user, this.limit, this.page).then(res => {
        this.total = res.count
        this.tableData = this.tableData.concat(res.data.map((item) => {
          return {
            name: item.name,
            value: item.value,
            id: item.id,
            date: item.date,
            rowShow: false,
            editShow: false
          }
        }))
      })
    },
    // 取消删除
    cancel() {
      let pop = document.getElementsByClassName('Popup')[0]
      pop.style.display = 'none'
    },
    // 编辑关联记录
    handleEdit(index, row) {
      row.rowShow = !row.rowShow
      row.editShow = !row.editShow
    },
    // 保存编辑
    async saveEdit(index, row) {
      // row.rowShow = false
      row.rowShow = !row.rowShow
      row.editShow = !row.editShow
      // 编辑数据接口
      await searchRecordEdit(sessionStorage.user, row.id, row.name)
    },
    // 点击删除按钮 删除逻辑
    async handleDelete(index, row) {
      this.delIndex = index
      let pop = document.getElementsByClassName('Popup')[0]
      pop.style.left = '40%'
      pop.style.top = '30%'
      pop.style.display = 'block'
      let confirm = document.getElementsByClassName('confirm')[0]
      let _this = this
      confirm.onclick = async function() {
        let pop = document.getElementsByClassName('Popup')[0]
        pop.style.display = 'none'
        _this.tableData.splice(index, 1)
        await searchRecordDelete(sessionStorage.user, row.id)
        // 请求删除扩展关联记录
        await ExpandDelete(sessionStorage.user, row.id)
      }
    },
    // 传递keywords
    iocKeywords(name) {
      this.$emit('iocKeywords', name)
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
    box-shadow 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .4)
    .text
      width 90%
      height 60px
      p
        font-size 16px
        font-family "Adobe 宋体 Std L"
        color $color-text
        padding 15px 25px
    .button
      width 50%
      height 20px
      margin-left 50%
      border none
  .tableContent
    margin-left 4%
    span
      color $color-theme
      font-size $font-size-small
  .editIcon
    color #0270FF
    margin 10px
  .deleteIcon
    color red
    margin-right 3%
  .date
    font-size $font-size-small
    color $color-text-l = #999999
  .box
    position relative
    width 100%
    margin-top 20px
    height 380px
    border 1px solid $color-theme-d
    .display
      width 100%
      height 300px
      margin-top 20px
      overflow auto
</style>
