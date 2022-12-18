<template>
  <el-form @keyup.enter="initUsers" size="small" style="display: flex;justify-content: space-around">
    <el-form-item label="姓名:">
      <el-input v-model="employeePage.conditionUser.name"/>
    </el-form-item>
    <el-form-item label="账号:">
      <el-input v-model="employeePage.conditionUser.account"/>
    </el-form-item>
    <el-form-item label="邮箱:">
      <el-input v-model="employeePage.conditionUser.mail"/>
    </el-form-item>
    <el-form-item label="状态:">
      <el-radio-group @change="initUsers" v-model="employeePage.conditionUser.disable">
        <el-radio :label="true">禁用</el-radio>
        <el-radio :label="false">启用</el-radio>
        <el-radio :label="null">全部</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-button type="primary" size="small" @click="initUsers">筛选</el-button>
    <el-button type="primary" size="small" @click="removeEmployeePage">重置</el-button>
    <el-button type="primary" size="small" @click="download" :loading="isDownloading">
      <template v-if="isDownloading">
        导出中
      </template>
      <template v-else>
        导出数据<el-icon class="el-icon--right"><Download /></el-icon>
      </template>
    </el-button>
    <el-upload
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :show-file-list="false"
        v-model:file-list="fileList"
        action="/api/users/upload"
        :on-success="uploadSuccess"
        :on-progress="onProgress"
    >
      <el-button type="success" size="small" :loading="isUploading">
        <template v-if="isUploading">
          上传中
        </template>
        <template v-else>
          上传<el-icon class="el-icon--right"><Upload /></el-icon>
        </template>
      </el-button>
    </el-upload>
  </el-form>

  <el-table @expand-change="expandChange" :row-key="getRowKey" :expand-row-keys="expandRows" ref="multipleTableRef" v-loading="loading" :data="users" style="width: 100%" @selection-change="selectChange">
    <el-table-column type="selection"/>
    <el-table-column type="expand">
      <template #default="props">
        <div style="display: flex;">
          <el-tag
              style="margin-left: 6px;margin-right: 6px"
              v-for="item in roles"
              :type="item.checked?'success':'info'"
              round
              size="large"
          >
            {{ item.nameChinese }}
          </el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column sortable prop="name" label="姓名" width="180" />
    <el-table-column sortable prop="account" label="账号" width="180" />
    <el-table-column sortable prop="mail" label="邮箱" />
    <el-table-column :sort-method="disableSort" sortable label="状态">
      <template #default="scope">
        <el-switch @click.stop @change="updateStatus(scope.row)" :active-value="false" :inactive-value="true" v-model="scope.row.disable"/>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.stop="updateOpenDialog(scope.row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 10px">
    <el-button :disabled="deleteButton" type="warning" @click="deleteDialogVisible = true">
      批量删除
    </el-button>
    <el-button type="primary" @click="addOpenDialog">
      添加员工
    </el-button>
    <el-pagination
        style="float: right"
        v-model:current-page="employeePage.current"
        v-model:page-size="employeePage.size"
        :page-sizes="[10, 20, 50, 100]"
        :small=false
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="employeePage.count"
        @size-change="initUsers"
        @current-change="initUsers"
    />
  </div>
  <el-dialog
      @close="closeDialog"
      v-model="addDialogVisible"
      :title="title"
      width="60%"
  >
    <el-form
        ref="ruleFormRef"
        :model="postUser"
        label-width="100px"
        :rules="rules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号" prop="account">
            <el-input v-model="postUser.account"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input show-password type="password" :disabled="passwordDisabled" v-model="postUser.password" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="postUser.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="postUser.mail" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="角色" prop="roles">
            <el-checkbox-group v-model="postUser.roles">
              <el-checkbox v-for="item in allRoles" :label="item.name" name="roles">
                <template #default>
                  {{item.nameChinese}}
                </template>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addOrUpdateMethod">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="deleteDialogVisible"
      width="30%"
  >
    删除后员工将被<span style="color: red">移出系统</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteUsers">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "EmployeeConfig",
  mounted() {
    this.employeePage = this.$store.state.employeePage
    this.initUsers()
  },
  data: function(){
    return {
      fileList: [],
      isUploading: false,
      isDownloading: false,
      passwordDisabled: false,
      addOrUpdate: true,
      rules: {
        account: [
          { required: true, message: 'Please input account'},
          { min: 3, message: 'Length should longer than 3'},
        ],
        password: [
          {
            required: true,
            message: 'Please input password',
          },
        ],
        name: [
          { required: true, message: "Please input name"},
          { min: 2, message: 'Length should longer than 2'}
        ],
        mail: [{required: true,message: 'Please input email address'},{type: 'email',message: 'Please input correct email address'},]
      },
      expandRows: [],
      roles: [],
      deleteButton: true,
      deleteDialogVisible: false,
      addDialogVisible: false,
      loading: false,
      users: [],
      employeePage: {
        conditionUser: {
          name: "",
          account: "",
          mail: "",
          disable: null
        },
        count: 0,
        current: 1,
        size: 10
      },
      title: '',
      postUser: {
        id: null,
        account: "",
        password: "",
        name: "",
        disable: false,
        mail: "",
        roles: []
      },
      allRoles: [],
      currentUpdateUser: null,
      validateField: ["account","name","mail"]
    }
  },
  methods: {
    onProgress() {
      this.isUploading = true
    },
    uploadSuccess(response,file,files) {
      files.length = 0
      if(!response.flag) {
        this.$ElMessage.error(response.message)
      }else{
        this.$ElMessage.success("上传成功")
        this.initUsers()
      }
      this.isUploading = false
    },
    download() {
      let fileDownload = require('../../utils/fileDownload')
      this.isDownloading = true
      axios.post('/api/users/download',this.employeePage.conditionUser,{responseType: 'blob'}).then(response=>{
        fileDownload(response.data,'员工信息表.xlsx')
        this.isDownloading = false
      })
    },
    addOrUpdateMethod() {
      this.$refs.ruleFormRef.validateField(this.validateField,valid => {
        if (valid) {
          if(this.addOrUpdate) {
            this.addUser()
          }else{
            this.updateUser()
          }
        }
      });
      this.$refs.ruleFormRef.clearValidate()
    },
    updateUser() {
      axios.put('/api/user',this.postUser).then(response=>{
        if(response.data.flag) {
          this.$ElMessage.success("更新成功")
          if(this.expandRows.length === 1 && this.expandRows[0] === this.postUser.id) {
            this.expandRows = []
          }
          this.currentUpdateUser.name = this.postUser.name
          this.currentUpdateUser.account = this.postUser.account
          this.currentUpdateUser.mail = this.postUser.mail
          this.addDialogVisible = false
        }
      })
    },
    closeDialog() {
      let newUser = {
        id: null,
        account: "",
        password: "",
        name: "",
        disable: false,
        mail: "",
        roles: []
      }
      this.postUser = newUser
      this.$refs.ruleFormRef.resetFields()
    },
    updateOpenDialog(row){

      if(this.validateField.length === 4) {
        this.validateField.pop()
      }
      this.currentUpdateUser = row
      this.addOrUpdate = false
      this.title = "修改员工”"+row.name+"“的信息"
      axios.get('/api/user/role',{
        params:{
          userId: row.id
        }
      }).then(response=>{
        if(response.data.flag) {
          this.roles = response.data.data
          this.allRoles = []
          this.postUser.roles.length = 0
          this.roles.forEach(role=>{
            this.allRoles.push(role)
            if(role.checked) {
              this.postUser.roles.push(role.name)
            }
          })
          this.postUser.id = row.id
          this.postUser.account = row.account
          this.postUser.password = row.password
          this.postUser.name = row.name
          this.postUser.mail = row.mail
          this.postUser.disable = row.disable
          this.addDialogVisible = true
        }
      })
    },
    addUser(){
      axios.post('/api/register',this.postUser).then(response=>{
        if(response.data.flag) {
          this.$ElMessage.success("添加成功")
          this.addDialogVisible = false
          this.initUsers()
        }
      })
    },
    addOpenDialog(){
      if(this.validateField.length === 3) {
        this.validateField.push("password")
      }
      this.addOrUpdate = true
      this.title = '添加新员工'
      this.addDialogVisible = true
      axios.get('/api/role').then(response=>{
        if(response.data.flag) {
          this.allRoles = response.data.data
        }
      })
    },
    expandChange(row,expandedRows){
      let that=this
      //只展开一行
      if (expandedRows.length) {//说明展开了
        that.expandRows = []
        axios.get('/api/user/role',{
          params:{
            userId: row.id
          }
        }).then(response=>{
          if(response.data.flag) {
            this.roles = response.data.data
            that.expandRows.push(row.id)//只展开当前行id，唯一标识
          }
        })
      }else{
        that.expandRows = []
      }
    },
    getRowKey(row){
      return row.id
    },
    disableSort(a,b){
      if(a.disable&&!b.disable)
        return 1;
      else
        return -1;
    },
    updateStatus(item){
      axios.put('/api/user',item).then(response=>{
        if(!response.data.flag){
          item.disable = !item.disable
        }
      })
    },
    selectChange(checked){
      this.deleteButton = checked.length === 0
    },
    removeEmployeePage(){
      this.employeePage.conditionUser.name = ""
      this.employeePage.conditionUser.account = ""
      this.employeePage.conditionUser.mail = ""
      this.employeePage.conditionUser.disable = null
      this.employeePage.count = 0
      this.employeePage.current = 1
      this.employeePage.size = 10
      this.initUsers()
    },
    initUsers(){
      this.loading = true
      axios.post('/api/users?current='+this.employeePage.current+'&size='+this.employeePage.size,this.employeePage.conditionUser).then(response=>{
        if(response.data.flag){
          this.users = response.data.data.recordList;
          this.employeePage.count = response.data.data.count
        }
        this.loading = false
      })
    },
    deleteUsers(){
      const selectionRows = this.$refs.multipleTableRef.store.getSelectionRows();
      const list = []
      selectionRows.forEach(row=>{
        list.push(row.id)
      })
      if(list.length !== 0){
        axios.delete('/api/user',{
          data: list
        }).then(response=>{
          if(response.data.flag){
            this.initUsers()
            this.$ElMessage.success("删除成功")
          }
        })
        this.deleteDialogVisible = false
      }
    }
  },
  computed: {
  },
  watch: {
    employeePage: {
      handler(newVal, oldVal) {
        this.$store.commit('saveEmployeePage',newVal)
      },
      deep: true
    }
  },
}
</script>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

</style>