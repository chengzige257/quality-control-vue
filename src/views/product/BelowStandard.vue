<template>
  不合格品页面
  <br/>
  <el-button type="primary" @click="logout"></el-button>
  <router-link to="/product/12345">去不合格品12345</router-link>
  <br/>
  <router-link to="/product/abcde">去不合格品abcde</router-link>
</template>

<script>
export default {
  name: "BelowStandard",
  methods:{
    logout(){
      this.$store.commit("logout")
    }
  }
}
</script>

<style scoped>

</style>