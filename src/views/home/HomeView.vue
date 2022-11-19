<template>
  <div>
    <el-container  style="height: 100vh">
      <el-aside class="cannotselect" width="200px" style="background-color: #000;color: white">
        <div style="height: 60px;display: flex;align-items: center">
          <span style="width: 100%;text-align: center">不合格品管控程序</span>
        </div>
        <el-menu
            router
            active-text-color="#ffd04b"
            background-color="#000"
            class="el-menu-vertical-demo"
            :default-active="this.$route.path"
            text-color="#fff"
            @open=""
            @close=""
        >
          <el-menu-item index="/home">
            <template #title>
              不合格品列表
            </template>
          </el-menu-item>
          <el-sub-menu index="/submeun">
            <template #title>
              选项设置
            </template>
            <el-menu-item index="/2-1">部门设置</el-menu-item>
            <el-menu-item index="/2-2">系统设置</el-menu-item>
            <el-menu-item index="/2-3">超时设置</el-menu-item>
            <el-menu-item index="/employee">员工设置</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/3">
            <span>统计</span>
          </el-menu-item>
          <el-menu-item index="/4">
            <span>日志管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="60px" style="background-color: dodgerblue">

        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>


export default {
  name: 'HomeView',
  components: {
  }
}
</script>
<style>
.cannotselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>