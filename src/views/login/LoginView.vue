<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">管理员登录</div>
      <!-- 登录表单 -->
      <el-form
          status-icon
          :model="loginForm"
          :rules="rules"
          ref="ruleForm"
          class="login-form"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              prefix-icon="User"
              placeholder="用户名"
              @keyup.enter.native="login"
          />
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              prefix-icon="Lock"
              show-password
              placeholder="密码"
              @keyup.enter.native="login"
          />
        </el-form-item>
      </el-form>
      <!-- 登录按钮 -->
      <el-button type="primary" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "LoginView",
  components:{

  },
  data: function() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.axios.postForm('/api/login',this.loginForm).then(response => {
            if(response.data.flag){
              let data = response.data.data;
              this.$store.commit('login', data)
              this.$ElMessage.success('登录成功')
              let redirect = this.$route.query.redirect
              this.$router.push({path: (redirect === undefined) ? '/index' : redirect});
            }
          })

        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
.login-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: url('../../assets/a6fec42e882111ebb6edd017c2d2eca2.jpg') center center /
    cover no-repeat;
}
.login-card {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  padding: 170px 60px 180px;
  width: 350px;
}
.login-title {
  color: #303133;
  font-weight: bold;
  font-size: 1rem;
}
.login-form {
  margin-top: 1.2rem;
}
.login-card button {
  margin-top: 1rem;
  width: 100%;
}
</style>