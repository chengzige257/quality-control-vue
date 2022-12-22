<template>

  <div class="container">
      <div style="height: 100%;overflow-y: scroll">
        <el-table stripe height="100%" :data="filterTableData" @cell-click='getCell' :cell-class-name='getRowColumn'>
          <el-table-column
              prop="name"
              label="英文名">
            <template #default='scope'>
              <el-input v-model='scope.row.name' v-if='scope.row.index === this.tabRowIndex  && scope.column.index === this.tabColumnIndex' @blur='inputBlur(scope.row)'></el-input>
              <div v-else> {{scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column
              prop="nameChinese"
              label="中文名">
            <template #default='scope'>
              <el-input v-model='scope.row.nameChinese' v-if='scope.row.index === this.tabRowIndex  && scope.column.index === this.tabColumnIndex' @blur='inputBlur(scope.row)'></el-input>
              <div v-else> {{scope.row.nameChinese}}</div>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <div style="display: flex;">
                <el-input v-model="this.search" size="small" placeholder="search" />
                <el-button style="margin-left: 7px" size="small" @click="openDialog">add Item</el-button>
              </div>
            </template>
            <template #default="scope">
              <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
              >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
    </div>
    <div style="background-color: #7ca995"></div>
    <div style="background-color: #b98542"></div>
    <div style="background-color: #7c42b9"></div>
  </div>





  <el-dialog @close="closeDialog" v-model="addDialogVisible" title="添加角色">
    <el-form ref="elForm" :model="addRole" :rules="rules" label-width="82px">
      <el-row>
            <el-col :span="12">
              <el-form-item label="英文名" prop="name">
                <el-input v-model="addRole.name" placeholder="请输入英文名英文名" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="中文名" prop="nameChinese">
                <el-input v-model="addRole.nameChinese" placeholder="请输入名中文中文名" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
import axios from "axios";
import {ElMessageBox} from "element-plus";

export default {
  name: "RoleConfig",
  mounted() {
    this.initRoles()
  },
  data: function (){
    return {
      rules: {
        name: [{
          required: true,
          message: '请输入英文名英文名',
          trigger: 'blur'
        }],
        nameChinese: [{
          required: true,
          message: '请输入名中文中文名',
          trigger: 'blur'
        }],
      },
      addDialogVisible: false,
      roles: [],
      tabRowIndex: null,
      tabColumnIndex: '',
      search: '',
      addRole: {
        name: '',
        nameChinese: ''
      },
    }
  },
  methods: {
    closeDialog() {
      this.$refs.elForm.resetFields()
    },
    openDialog() {
      this.addDialogVisible = true
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid){
          axios.post('/api/role',this.addRole).then(response=>{
            if(response.data.flag) {
              this.$ElMessage.success('添加成功')
              this.addDialogVisible = false
              this.initRoles()
            }
          })
        }
      })
    },
    handleDelete(id){
      ElMessageBox.confirm(
          'you will permanently delete the role. Continue?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
      ).then(() => {
        const list = []
        list.push(id)
        axios.delete('/api/role',{
          data: list
        }).then(response=>{
          if(response.data.flag) {
            this.$ElMessage.success('删除成功')
            this.initRoles()
          }
        })
      })
      .catch(() => {
        this.$ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
    },
    initRoles(){
      axios.get('/api/role').then(response=>{
        if(response.data.flag) {
          this.roles = response.data.data
        }
      })
    },
    getCell (row, column, cell, event) {
      this.tabRowIndex = row.index
      this.tabColumnIndex = column.index
    },
    getRowColumn ({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex
      column.index = columnIndex
    },
    inputBlur (item) {
      this.tabRowIndex = null
      this.tabColumnIndex = ''
      axios.put('/api/role',item)
    },
  },
  computed: {
    filterTableData() {
      return this.roles.filter(
          (role) =>
              !this.search ||
              role.name.toLowerCase().includes(this.search.toLowerCase()) || role.nameChinese.toLowerCase().includes(this.search.toLowerCase())
      )
    },
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  justify-items: stretch;
  align-items: stretch;
}
</style>