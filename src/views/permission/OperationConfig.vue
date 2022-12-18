<template>
    <!-- 标题 -->
    <div class="operation-container">
      <el-button
          type="primary"
          size="small"
          @click="openModel(null)"
      >新增模块</el-button>
      <!-- 数据筛选 -->
      <div style="margin-left:auto">
        <el-input
            v-model="search"
            size="small"
            placeholder="search"
            style="width: 200px"
        />
        <el-button
            type="primary"
            size="small"
            @click="filter"
        >搜索</el-button>
      </div>
    </div>
    <!-- 权限列表 -->
    <el-table
        ref="table"
        row-key="id"
        v-loading="loading"
        :data="resourceListCopy"
    >
      <el-table-column prop="name" label="资源名" align="left"/>
      <el-table-column prop="url" label="资源路径"/>
      <el-table-column prop="requestMethod" label="请求方式">
        <template #default="scope">
          <el-tag v-if="scope.row.requestMethod" :type="tagType(scope.row.requestMethod)">
            {{ scope.row.requestMethod }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isAnonymous" label="匿名访问" align="center">
        <template #default="scope">
          <el-switch
              v-if="scope.row.url"
              v-model="scope.row.isAnonymous"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="true"
              :inactive-value="false"
              @change="changeResource(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
              link
              size="small"
              type="primary"
              @click="openAddResourceModel(scope.row)"
              v-if="scope.row.children"
          >
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button
              link
              size="small"
              type="primary"
              @click="openDrawer(scope.row)"
              v-if="!scope.row.children"
          >
            <el-icon><Avatar /></el-icon>分配角色
          </el-button>
          <el-button
              link
              type="primary"
              size="small"
              @click="openEditResourceModel(scope.row)"
          >
            <el-icon><EditPen /></el-icon> 修改
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              style="margin-left: 10px"
              @confirm="deleteResource(scope.row.id)"
          >
            <template #reference>
              <el-button size="small" type="primary" link>
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增模块框 -->
    <el-dialog v-model="addModule" width="30%" :title="addModuleDialogTitle">
      <el-form label-width="80px" size="default" :model="resourceForm">
        <el-form-item label="模块名">
          <el-input v-model="resourceForm.name" style="width:220px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addModule = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditResource">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 新增资源框 -->
    <el-dialog :title="addDialogTitle" v-model="addResource" width="30%">
      <el-form label-width="80px" size="default" :model="resourceForm">
        <el-form-item label="资源名">
          <el-input v-model="resourceForm.name" style="width:220px" />
        </el-form-item>
        <el-form-item label="资源路径">
          <el-input v-model="resourceForm.url" style="width:220px" />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-radio-group v-model="resourceForm.requestMethod">
            <el-radio :label="'GET'">GET</el-radio>
            <el-radio :label="'POST'">POST</el-radio>
            <el-radio :label="'PUT'">PUT</el-radio>
            <el-radio :label="'DELETE'">DELETE</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addResource = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditResource">
          确 定
        </el-button>
      </span>
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
  name: "OperationConfig.vue",
  mounted() {
    this.listResources()
  },
  methods: {
    drawerClose(){
      axios.put('/api/operation/role',this.roles,{
        params: {
          operationId: this.currentOperationId
        }
      }).then(response=>{
        if(response.data.flag) {
          this.drawerVisible = false
        }
      })
    },
    onChange(role){
      role.checked = !role.checked
    },
    openDrawer(row) {
      this.currentOperationId = row.id
      this.drawerTitle = '正在修改接口“'+row.url+'”的对应角色'
      axios.get('/api/operation/role',{
        params: {
          operationId: row.id
        }
      }).then(response=>{
        if(response.data.flag) {
          this.roles = response.data.data
        }
        this.drawerVisible = true
      })
    },
    listResources() {
      axios.get("/api/operation/module")
          .then(({ data }) => {
            this.resourceList = data.data;
            this.resourceListCopy = this.resourceList
            this.loading = false;
          });
    },
    changeResource(resource) {
      this.axios.put("/api/operation", resource)
    },
    openModel(resource) {
      if (resource != null) {
        this.resourceForm = JSON.parse(JSON.stringify(resource));
        this.addModuleDialogTitle = "修改模块";
      } else {
        this.resourceForm = {};
        this.addModuleDialogTitle = "添加模块";
      }
      this.addModule = true;
    },
    openEditResourceModel(resource) {
      if (resource.url == null) {
        this.openModel(resource);
        return false;
      }
      this.resourceForm = JSON.parse(JSON.stringify(resource));
      this.addDialogTitle = '修改资源'
      this.addResource = true;
    },
    openAddResourceModel(resource) {
      this.resourceForm = {};
      this.resourceForm.parentId = resource.id;
      this.addDialogTitle = '新增资源'
      this.addResource = true;
    },
    deleteResource(id) {
      axios.delete("/api/operation",{
        params: {
          id: id
        }
      }).then(({ data }) => {
        if (data.flag) {
          this.listResources();
        }
      });
    },
    addOrEditResource() {
      if (this.resourceForm.name.trim() === "") {
        this.$message.error("资源名不能为空");
        return false;
      }
      if(this.addModule === true && this.addModuleDialogTitle === '添加模块'){//新增模块
        axios.post('/api/operation/module',null,{
          params: {
            moduleName: this.resourceForm.name
          }
        })
            .then(({ data }) => {
              if (data.flag) {
                this.listResources();
              }
              this.addModule = false;
              this.addResource = false;
            });
        return
      }
      if(this.addResource === true && this.addDialogTitle === '新增资源') {//
        axios.post('/api/operation',this.resourceForm
        ).then(({ data }) => {
              if (data.flag) {
                this.listResources();
              }
              this.addModule = false;
              this.addResource = false;
            });
        return
      }
      axios.put("/api/operation", this.resourceForm)
          .then(({ data }) => {
            if (data.flag) {
              this.listResources();
            }
            this.addModule = false;
            this.addResource = false;
          });
    },
    filter(){
      let copy = JSON.parse(JSON.stringify(this.resourceList));
      this.resourceListCopy = copy.filter(
          (module) => {
            if(module.children !== null) {
              module.children = module.children.filter(operation=>{
                return !this.search || operation.name.toLowerCase().includes(this.search.toLowerCase()) || operation.requestMethod.toLowerCase().includes(this.search.toLowerCase()) || operation.url.toLowerCase().includes(this.search.toLowerCase())
              })
            }
            return true
          }
      )
    }
  },
  data() {
    return {
      resourceListCopy: [],
      roles: [],
      drawerVisible: false,
      currentOperationId: null,
      drawerTitle: '',
      addModuleDialogTitle: '',
      addDialogTitle: '',
      loading: true,
      search: "",
      resourceList: [],
      addModule: false,
      addResource: false,
      resourceForm: {}
    };
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
    },
  }
}
</script>

<style scoped>
.operation-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}
.dialog-footer {
  display: flex;
  justify-content: right;
}
</style>