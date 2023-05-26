<template>
  <div>
    <el-container  class="main-container">
      <el-aside  width="auto" class="cannotselect">
        <el-menu
            background-color="#304156"
            style="height: 100vh"
            class="side-nav-bar"
            router
            text-color="#BFCBD9"
            :default-active="$route.path"
            active-text-color="#409EFF"
        ><!--:default-active="$route.path"保证当前路由与菜单的选中一致-->
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
      <el-container style="height: 100vh">
        <el-header  height="84px" style="padding:0">
          <NavBar :key="$route.fullPath"/><!--解决标签和菜单不一致的问题-->
        </el-header>
        <el-main style="background:#F7F9FB;overflow-y: scroll;height: 3px">
<!--            <router-view :key="$route.fullPath"/>&lt;!&ndash;解决标签和菜单不一致的问题&ndash;&gt;-->

          <router-view :key="$route.fullPath" v-slot="{ Component }">
            <keep-alive :include="['DailyStatistics']">
              <component :is="Component" />
            </keep-alive>
          </router-view>
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
  min-height: 100vh;
}
.side-nav-bar:not(.el-menu--collapse) {
  width: 210px;
}

*::-webkit-scrollbar {
  width: 0;/*设置滚动条的宽度*/
  height: 1px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0;
  background-color: rgba(144, 147, 153, 0.3);/*设置滚动条的颜色*/
}
</style>