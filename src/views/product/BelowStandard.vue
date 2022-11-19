<template>
  不合格品页面
  <el-button type="primary" @click="logout"></el-button>
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