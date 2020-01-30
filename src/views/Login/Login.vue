<template>
  <div class="login">
    <div id="container">
      <p id="head">网络敌情综合跟踪系统</p>
      <div class="user">
        <form id="form" method="post">
          <input v-model="username" id="user" type="text" name="Username" placeholder="用户名/手机号/邮箱" required="">
          <div style="width: 400px;height: 30px;margin-left: 73px">
            <p id="userspan">
              {{ umessage }}
            </p>
          </div>
          <input v-model="password" id="password" type="password" name="Password" placeholder="密码" required="">
          <div style="width: 400px;height: 30px;margin-left: 73px">
            <p id="passwordspan">
              {{ pmessage }}
            </p>
          </div>
        </form>
        <ul class="tick">
          <li>
            <input type="checkbox" id="brand" value="">

            <label for="brand"><span></span>记住此账户</label>
          </li>
          <li>
            <a class="a" href="#">找回密码</a>
          </li>
        </ul>
      </div>
      <div class="send-button">
        <input @click="log" type="submit" value="登 录">
        <div id="span"><span style="font-size: 13px">没有账号？立即</span><a class="a" href="#">免费注册</a></div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../../api/user'

export default {
  name: 'Login',
  data() {
    return {
      umessage: '',
      pmessage: '',
      username: '',
      password: ''
    }
  },
  methods: {
    log() {
      let flag = true
      // 验证账号
      if (this.username === '') {
        this.umessage = '请输入用户名、手机号或邮箱'
        flag = false
      } else {
        this.umessage = ''
        this.msg = { user: '' }
      }

      // 验证密码
      if (this.password === '') {
        this.pmessage = '请输入符合格式的密码'
        flag = false
      } else {
        let pattern = /^[a-zA-Z]\w{8,28}$/
        if (!pattern.test(this.msg.password)) {
          this.pmessage = '以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
          flag = false
        } else {
          this.pmessage = ''
        }
      }

      if (flag) {
        const user = {
          username: this.username,
          password: this.password
        }
        login(user).then(res => {
          if (res.code === 0) {
            // 登录成功设置session token
            if (!sessionStorage.token && process.env.NODE_ENV === 'development') {
              sessionStorage.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzIyMzU0NTUsImlhdCI6MTU3MjIzMTg1NSwidXNlcm5hbWUiOiJyb290In0.jlkhZrLwP6IGu_AKZOavJlXwYQnMD6gQwfpe8lXQ48w'
            }
            sessionStorage.user = this.username
            this.$router.push('/home')
          } else {
            this.umessage = '用户名或密码错误！'
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "Login.styl"
</style>
