<template>

  <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="2">
    <n-grid-item>
      <div style="display: flex;align-items: center">
        <span style="margin-right: 20px">总    经    理：</span>
        <n-select
            @update:value="handleUpdateValue"
            @click="queryUser('general_manager')"
            style="width: 200px;"
            v-model:value="this.config.generalManagerName"
            filterable
            :options="options"
            :loading="loading"
            clearable
            remote
            @search="handleSearch"
        />
      </div>
    </n-grid-item>
    <n-grid-item>
      <div>
        <span style="margin-right: 100px">休息时间段：</span>
        <span>当日：</span>
        <el-time-select
            style="width: 150px;"
            v-model="this.config.nowarnTimeBegin"
            min-time="11:59"
            start="12:00"
            step="00:15"
            end="23:45"
            format="HH:mm:ss"
            @change="changeBegin"
        />
        <span style="margin: 10px 40px">至</span>
        <span>次日：</span>
        <el-time-select
            style="width: 150px;"
            v-model="this.config.nowarnTimeEnd"
            max-time="12:01"
            start="00:00"
            step="00:15"
            end="12:00"
            format="HH:mm:ss"
            @change="changeEnd"
        />
      </div>

    </n-grid-item>
  </n-grid>
  <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="4">
    <n-grid-item style="display: flex;align-items: center">
      <span>技术审批人：</span>
      <n-select
          @click="queryUser('technical_approver')"
          style="width: 200px;"
          @update:value="handleUpdateValue"
        v-model:value="this.config.technicalApproverName"
        filterable
        :options="options"
        :loading="loading"
        clearable
        remote
        @search="handleSearch"
    />
    </n-grid-item>
    <n-grid-item style="display: flex;align-items: center">
      <span>计划负责人：</span>
      <n-select
          @update:value="handleUpdateValue"
          @click="queryUser('project_manager')"
          style="width: 200px;"
          v-model:value="this.config.projectManagerName"
          filterable
          :options="options"
          :loading="loading"
          clearable
          remote
          @search="handleSearch"
      />
    </n-grid-item>
    <n-grid-item style="display: flex;align-items: center">
      <span>质检人：</span>
      <n-select
          @update:value="handleUpdateValue"
          @click="queryUser('quality_inspector')"
          style="width: 200px;"
          v-model:value="this.config.qualityInspectorName"
          filterable
          :options="options"
          :loading="loading"
          clearable
          remote
          @search="handleSearch"
      />
    </n-grid-item>
    <n-grid-item style="display: flex;align-items: center">
      <span>生产中心负责人：</span>
      <n-select
          @update:value="handleUpdateValue"
          @click="queryUser('production_center_leader')"
          style="width: 200px;"
          v-model:value="this.config.productionCenterLeaderName"
          filterable
          :options="options"
          :loading="loading"
          clearable
          remote
          @search="handleSearch"
      />
    </n-grid-item>
  </n-grid>
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
      loading: false,
      options: [],
      config: {},
      currentRole: ''
    }
  },
  methods: {
    changeBegin(time){
      this.updateConfig()
    },
    changeEnd(time){
      this.updateConfig()
    },
    handleUpdateValue(value,option){
      if(this.currentRole === 'technical_approver') {
        this.config.technicalApprover = option.value
        this.config.technicalApproverName = option.label
        this.updateConfig()
      }else if(this.currentRole === 'project_manager'){
        this.config.projectManager = option.value
        this.config.projectManagerName = option.label
        this.updateConfig()
      }else if(this.currentRole === 'quality_inspector'){
        this.config.qualityInspector = option.value
        this.config.qualityInspectorName = option.label
        this.updateConfig()
      }else if(this.currentRole === 'production_center_leader'){
        this.config.productionCenterLeader = option.value
        this.config.productionCenterLeaderName = option.label
        this.updateConfig()
      }else if(this.currentRole === 'general_manager'){
        this.config.generalManager = option.value
        this.config.generalManagerName = option.label
        this.updateConfig()
      }
    },
    queryUser(currentRole){
      this.currentRole = currentRole
      this.handleSearch('')
    },
    handleSearch(query){
      axios.get('/api/search/system/user',{
        params: {
          query: query,
          role: this.currentRole
        }
      }).then(response=>{
        if(response.data.flag){
          this.options = response.data.data
        }
      })
    },
    initConfig() {
      axios.get("/api/systemConfig").then(response=>{
        if(response.data.flag) {
          this.config = response.data.data
        }
      })
    },
    updateConfig(){
      axios.put('/api/systemConfig',this.config)
    }
  }
}
</script>

<style scoped>

</style>