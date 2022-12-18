<template>
  <el-table
      ref="table"
      :data="menus"
      style="width: 100%;margin-bottom: 10px"
      row-key="path"
      :row-class-name="isParentMenu"
      @cell-click='getCell' :cell-class-name='getRowColumn'
  >
    <el-table-column align="left" width="25px"/>
    <el-table-column align="center" prop="name" label="名称">
      <template #default='scope'>
        <el-input v-model='scope.row.name' v-if='scope.row.index === this.tabRowIndex  && scope.column.index === this.tabColumnIndex' @blur='inputBlur(scope.row)'></el-input>
        <div v-else> {{scope.row.name}}</div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="path" label="路径">
      <template #default='scope'>
        <el-input v-model='scope.row.path' v-if='scope.row.index === this.tabRowIndex  && scope.column.index === this.tabColumnIndex' @blur='inputBlur(scope.row)'></el-input>
        <div v-else> {{scope.row.path}}</div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="component" label="组件" width="250px">
      <template #default='scope'>
        <el-input v-show="scope.row.component !== null" v-model='scope.row.component' v-if='scope.row.index === this.tabRowIndex  && scope.column.index === this.tabColumnIndex' @blur='inputBlur(scope.row)'></el-input>
        <div v-else> {{scope.row.component}}</div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="orderNum" label="排序" width="100">
      <template #default='scope'>
        <el-input v-model='scope.row.orderNum' v-if='scope.row.index === this.tabRowIndex  && scope.column.index === this.tabColumnIndex' @blur='inputBlur(scope.row)'></el-input>
        <div v-else> {{scope.row.orderNum}}</div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="隐藏">
      <template #default="scope">
        <el-switch v-show="scope.row.component !== null" @click.stop @change="changeHidden(scope.row)" :active-value="true" :inactive-value="false" v-model="scope.row.isHidden"/>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button
            v-show="scope.row.component === null"
            size="small"
            type="danger"
            @click="handleDelete(scope.row.id)"
        >删除分组</el-button>

        <el-button
            v-show="scope.row.component !== null"
            size="small"
            type="primary"
            @click="openDrawer(scope.row)"
        >角色分配</el-button>

        <el-dropdown @command="handleCommand" size="small" v-show="scope.row.component !== null">
          <el-button size="small" class="el-dropdown-link">
            改变分组
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="scope.row.id+'-'+item.id" v-for="item in parentMenu" :disabled="scope.row.parentId === item.id">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary" @click="addDialogVisible = true" plain>添加分组</el-button>
  <el-dialog @close="closeDialog" v-model="addDialogVisible" title="添加分组">
    <el-form ref="elForm" :model="addMenuParent" :rules="rules" label-width="82px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="addMenuParent.name" placeholder="请输入分组名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路径" prop="path">
            <el-input v-model="addMenuParent.path" placeholder="请输入分组的唯一路径" clearable :style="{width: '100%'}">
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
  <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      direction="btt"
      @close="drawerClose"
      size="20%"
  >
    <el-check-tag  style="background-color: white" v-for="role in roles" :checked="role.checked" @change="onChange(role)">
      <template #default>
        <el-tag
            class="cannotselect"
            round
            :type="role.checked?'success':'info'"
            effect="dark"
        >
          {{ role.nameChinese }}
        </el-tag>
      </template>
    </el-check-tag>
  </el-drawer>

</template>

<script>
import axios from "axios";
export default {
  name: "MenuConfig",
  mounted() {
    this.initMenus()
  },
  data: function(){
    return{
      drawerVisible: false,
      drawerTitle: '',
      rules: {
        name: [{
          required: true,
          message: '请输入分组名',
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: '请输入唯一路径',
          trigger: 'blur'
        }],
      },
      addDialogVisible: false,
      addMenuParent: {
        name: '',
        path: ''
      },
      menus: [],
      parentMenu: [],
      tabRowIndex: null,
      tabColumnIndex: '',
      roles: null,
      currentMenuId: null
    }
  },
  methods: {
    onChange(role){
      role.checked = !role.checked
    },
    openDrawer(row) {
      this.currentMenuId = row.id
      this.drawerTitle = '正在修改菜单“'+row.name+'”的对应角色'
      axios.get('/api/menu/role',{
        params: {
          menuId: row.id
        }
      }).then(response=>{
        if(response.data.flag) {
          this.roles = response.data.data
        }
        this.drawerVisible = true
      })
    },
    drawerClose(){
      axios.put('/api/menu/role',this.roles,{
        params: {
          menuId: this.currentMenuId
        }
      }).then(response=>{
        if(response.data.flag) {
          this.drawerVisible = false
        }
      })
    },
    closeDialog() {
      this.$refs.elForm.resetFields()
    },
    openDialog() {
      this.addDialogVisible = true
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (valid){
          axios.post('/api/menu',this.addMenuParent).then(response=>{
            if(response.data.flag) {
              this.$ElMessage.success('添加成功')
              this.addDialogVisible = false
              this.initMenus()
            }
          })
        }
      })
    },
    handleDelete(id) {
      let list = []
      list.push(id)
      axios.delete('/api/menu',{
        data: list,
      }).then(response=>{
        if(response.data.flag){
          this.$ElMessage.success('删除成功')
          this.initMenus()
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
      axios.put('/api/menu',item)

    },
    handleCommand(id){
      let list = id.split('-');
      if(list[1] === 'null')
        list[1] = null
      axios.put('/api/menuParent',null,{
        params: {
          id: list[0],
          parentId: list[1]
        }
      }).then(response=>{
        this.initMenus()
      })
    },
    changeHidden(row){
      console.log(row)
      axios.put('/api/menu',row)
    },
    initMenus() {
      axios.get('/api/menu/all').then(response=>{
        if(response.data.flag) {
          this.menus = response.data.data
          this.parentMenu = this.menus.filter(menu=>menu.component === null)
          let emptyMenu = {
            id: null,
            name: '不分组'
          }
          this.parentMenu.push(emptyMenu)
        }
      })
    },
    isParentMenu(item) {
      if(item.row.component === null) {
        return 'success-row'
      }else if(item.row.parentId !== null){
        return 'warning-row'
      }
      return ''
    }
  },
}
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-input__inner {
  text-align: center;
}
</style>