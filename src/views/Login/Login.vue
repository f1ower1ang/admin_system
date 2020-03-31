<template>
  <div id="login">
    <div class="login-wrapper">
      <div class="left"></div>
      <div class="right">
        <p class="title">账号密码登录</p>
        <el-form :model="loginForm" status-icon :rules="ruleForm" ref="ruleForm">
          <el-form-item prop="username">
            <el-input type="text" placeholder="用户名/手机号/邮箱" v-model="loginForm.username" autocomplete="off" prefix-icon="el-icon-user" autofocus />
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password" autocomplete="off" prefix-icon="el-icon-lock" @keyup.enter.native="submit" />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native="submit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../../api/user'
import { Message } from 'element-ui'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      ruleForm: {
        username: [{ required: true, message: '请输入用户名、手机号或邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      checked: false
    }
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          login(this.loginForm).then((res) => {
            if (res.code === 0) {
              // 登录成功设置session token
              if (!sessionStorage.token && process.env.NODE_ENV === 'development') {
                sessionStorage.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzIyMzU0NTUsImlhdCI6MTU3MjIzMTg1NSwidXNlcm5hbWUiOiJyb290In0.jlkhZrLwP6IGu_AKZOavJlXwYQnMD6gQwfpe8lXQ48w'
              }
              sessionStorage.user = this.loginForm.username
              this.$router.push('/home')
            } else {
              Message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus">
  @import "Login.styl"
</style>
