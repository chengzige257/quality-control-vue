<template>
<el-table ref="multipleTableRef" :data="logData" @selection-change="selectChange">
  <el-table-column type="selection"/>
  <el-table-column
      prop="userName"
      label="操作用户"
      align="center"
  />
  <el-table-column
      prop="optDesc"
      label="操作描述"
      align="center"
  />
  <el-table-column
      prop="method"
      label="请求方式"
      align="center"
  >
    <template #default="scope">
      <el-tag :type="tagType(scope.row.method)">
        {{ scope.row.method }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column
      prop="ipAddress"
      label="登录ip"
      align="center"
  />
  <el-table-column
      prop="location"
      label="登录地址"
      align="center"
  />
  <el-table-column
      prop="optTime"
      label="操作日期"
      align="center"
  >
    <template #default="scope">
      <el-icon style="position: relative;top: 2px"><Timer /></el-icon>
      {{ this.$global.dateFormat("YYYY-mm-dd HH-MM-SS",new Date(scope.row.optTime))}}
    </template>
  </el-table-column>
</el-table>
  <div style="margin-top: 10px">
    <el-popconfirm
        width="220"
        confirm-button-text="确定"
        cancel-button-text="不了"
        icon-color="#626AEF"
        title="确定删除选中的数据吗?"
        @confirm="deleteLogs"
    >
      <template #reference>
        <el-button :disabled="deleteButton" type="warning">
          批量删除
        </el-button>
      </template>
    </el-popconfirm>

    <el-pagination
        style="float: right"
        v-model:current-page="current"
        v-model:page-size="size"
        :page-sizes="[15, 20, 40, 60]"
        :small=false
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        @size-change="initLogData"
        @current-change="initLogData"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LogManager",
  mounted() {
    this.initLogData()
  },
  data: function(){
    return{
      deleteButton: true,
      logData: [],
      current: 1,
      size: 15,
      count: 0
    }
  },
  methods: {
    deleteLogs(){
      const selectionRows = this.$refs.multipleTableRef.store.getSelectionRows();
      const list = []
      selectionRows.forEach(row=>{
        list.push(row.id)
      })
      if(list.length !== 0){
        axios.delete('/api/log',{
          data: list
        }).then(response=>{
          if(response.data.flag){
            this.initLogData()
            this.logData = this.logData.filter(log=>{
              list.includes(log.id)
            })
            this.$ElMessage.success("删除成功")
          }
        })
      }
    },
    selectChange(checked){
      this.deleteButton = checked.length === 0
    },
    initLogData() {
      axios.get('/api/log?current='+this.current+'&size='+this.size).then(response=>{
        if(response.data.flag) {
          this.logData = response.data.data.recordList
          this.count = response.data.data.count
        }
      })
    }
  },
  computed: {
    tagType() {
      return function(type) {
        switch (type) {
          case "GET":
            return "";
          case "POST":
            return "success";
          case "PUT":
            return "warning";
          case "DELETE":
            return "danger";
        }
      };
    }
  }
}
</script>

<style scoped>

</style>