<template>
  <div id="app" style="height: 100%">
    <el-container>
      <el-header>
        <p class="title">网络敌情综合跟踪系统</p>
        <div class="user-wrapper">
          <el-avatar
            shape="circle" :size="40"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
          <el-dropdown style="padding-left: 15px" trigger="click" @command="handleCommand">
              <span style="color: #eee">
                {{ user }}<i class="el-icon-arrow-down el-icon--right"/>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <div class="aside" :class="collapse ? 'shrink': 'expand'">
          <sidebar :is-collapse="collapse"/>
          <div @click="toggle" class="btn">
            <i class="el-icon-caret-left" :class="{rotate: collapse}"></i>
          </div>
        </div>
        <el-main :class="collapse ? 'shrink': 'expand'">
          <keep-alive :exclude="['layout', 'InspectIoc', 'InspectTtp', 'TtpResult', 'ReportResult', 'IocResult']">
            <router-view/>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      title="修改密码"
      width="400px"
      :visible.sync="dialogVisible"
      @close="cancel"
    >
      <el-form :model="pwdForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="当前密码" prop="oldPwd">
          <el-input type="password" v-model="pwdForm.oldPwd" autocomplete="off" size="small" style="width: 95%"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="pwdForm.password" autocomplete="off" size="small" style="width:95%"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd" style="margin-bottom: 0;">
          <el-input type="password" v-model="pwdForm.confirmPwd" autocomplete="off" size="small" style="width: 95%"></el-input>
        </el-form-item>
      </el-form>
      <p slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="changePwd" size="mini">确 定</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { logout, editUser } from './api/user'
import sidebar from './components/common/sidebar'

export default {
  name: 'app',
  components: {
    sidebar
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.pwdForm.confirmPwd !== '') {
          this.$refs.ruleForm.validateField('confirmPwd')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入当前密码'))
      } else if (value !== sessionStorage.password) {
        callback(new Error('当前密码不正确'))
      } else {
        callback()
      }
    }
    return {
      user: sessionStorage.user,
      collapse: false,
      icon: 'el-icon-arrow-left',
      dialogVisible: false,
      pwdForm: {
        oldPwd: '',
        password: '',
        confirmPwd: ''
      },
      rules: {
        oldPwd: { required: true, validator: validateOld, trigger: 'blur' },
        password: { validator: validatePass, trigger: 'blur', required: true },
        confirmPwd: { validator: validatePass2, trigger: 'blur', required: true }
      }
    }
  },
  methods: {
    handleCommand(e) {
      switch (e) {
        case 'logout':
          logout().then((res) => {
            sessionStorage.token = ''
            this.$router.push('/login')
          })
          break
        case 'changePwd':
          this.dialogVisible = true
          break
      }
    },
    toggle() {
      this.collapse = !this.collapse
      if (this.collapse) {
        this.icon = 'el-icon-arrow-right'
      } else {
        this.icon = 'el-icon-arrow-left'
      }
    },
    cancel() {
      this.dialogVisible = false
      this.pwdForm = this.$options.data().pwdForm
    },
    changePwd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.pwdForm.id = parseInt(sessionStorage.id)
          editUser(this.pwdForm).then((res) => {
            if (res.code === 0) {
              sessionStorage.token = ''
              this.$router.push('/login')
            }
          })
          this.cancel()
        }
      })
    }
  },
  watch: {
    $route(to, from) {
      if (from.path === '/login') {
        this.user = sessionStorage.user
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-container
    height 100%

  .el-header
    position fixed
    line-height: 60px;
    width 100%
    z-index 10
    top 0
    display flex
    justify-content space-between
    background $color-background-d
    border-bottom 5px solid $color-border
    color #f0f0f0

    .title
      font-size $font-size-large-x

    .user-wrapper
      display flex
      align-items center

      .username
        padding-left 10px
        font-size $font-size-medium-x

  .aside
    position fixed
    top 60px
    bottom 0
    color: #fff;
    background $color-background-d
    border-right 8px solid $color-border
    transition all .4s

    .btn
      position absolute
      right -8px
      width 16px
      top 0
      height 100%
      cursor pointer
      background linear-gradient($color-border, #242443 50%, $color-border)
      display flex
      align-items center

      i
        transition all .4s

      .rotate
        transform rotateY(180deg)

    &.expand
      width 180px

    &.shrink
      width 65px

  .el-main
    margin-top 60px
    height calc(100% - 60px)
    position relative
    transition all .4s
    padding: 0
    background #fff

    &.expand
      margin-left 180px

    &.shrink
      margin-left 65px

  .el-button
    transition margin .4s
    float right
    margin-right 20px

    &.is-circle
      padding 6px
  .dialog-footer
    &:after
      display: table;
      content: '';
      clear: both;
</style>
