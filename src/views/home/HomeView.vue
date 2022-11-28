<template>
  <div>
    <el-container>
      <el-aside  width="auto" class="cannotselect">
        <el-menu
            class="side-nav-bar"
            router
            :default-active="this.$route.path"
            :collapse="this.$store.state.collapse"
            background-color="#304156"
            text-color="#BFCBD9"
            active-text-color="#409EFF"
        >
          <template v-for="route of this.$store.state.menu">
            <template v-if="route.children === null || route.children.length === 0"><!--一级菜单-->
              <template v-if="!route.isHidden">
                <el-menu-item :index = "route.path">
                  <span>{{route.name}}</span>
                </el-menu-item>
              </template>
            </template>
            <template v-else><!--二级菜单-->
              <template v-if="!route.isHidden">
                <el-sub-menu :index = "route.path">
                  <template #title>
                    <span>{{route.name}}</span>
                  </template>
                  <template v-for="children of route.children">
                    <template v-if="!children.isHidden">
                      <el-menu-item :index = "children.path">
                        <span>{{children.name}}</span>
                      </el-menu-item>
                    </template>
                  </template>
                </el-sub-menu>
              </template>
            </template>
          </template>

        </el-menu>
      </el-aside>
      <el-container class="main-container">
        <el-header  height="84px" style="padding:0">
          <NavBar :key="$route.fullPath"/>
        </el-header>
        <el-main  style="background:#F7F9FB">
          <div class="fade-transform-box">
              <router-view :key="$route.fullPath"/>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
export default {
  name: 'HomeView',
  components: {
    NavBar
  },
  data(){
    return {
      fullscreen: false,
    };
  },
  methods: {

  }
}
</script>
<style>
.main-container {
  margin-left: 210px;
  min-height: 100vh;
}


.side-nav-bar:not(.el-menu--collapse) {
  width: 210px;
}
.side-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
.side-nav-bar i {
  margin-right: 1rem;
}
*::-webkit-scrollbar {
  width: 0.5rem;
  height: 1px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(144, 147, 153, 0.3);
}
.cannotselect {
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
</style>