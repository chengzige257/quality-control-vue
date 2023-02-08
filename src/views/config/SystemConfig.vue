<template>
  <div class="demo-time-range">
    <span>邮件提醒停止时间段：</span>
    <div>
      <span>第一日：</span>
      <el-time-select
          v-model="this.config.nowarnTimeBegin"
          min-time="11:59"
          start="12:00"
          step="00:15"
          end="23:45"
          format="HH:mm:ss"
      />
    </div>
    <span>——————————————</span>
    <div>
      <span>次日：</span>
      <el-time-select
          v-model="this.config.nowarnTimeEnd"
          max-time="12:01"
          start="00:00"
          step="00:15"
          end="12:00"
          format="HH:mm:ss"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SystemConfig",
  mounted() {
    this.initConfig()
  },
  data: function(){
    return{
      config: {}
    }
  },
  methods: {
    initConfig() {
      axios.get("/api/systemConfig").then(response=>{
        if(response.data.flag) {
          this.config = response.data.data
        }
      })
    }
  }
}
</script>

<style scoped>
.demo-time-range {
  display: flex;
  justify-content: space-around;
}
</style>